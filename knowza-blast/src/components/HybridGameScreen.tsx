import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flame, Pause, Sparkles } from 'lucide-react';
import {
  BLOCK_GRID_SIZE,
  applyInventoryBooster,
  canShapeFitAnywhere,
  createBlockAdventureBoard,
  generateBlockTray,
  hasAnyValidTrayMove,
  placeShapeAndClearLines,
  previewLineClears
} from '../utils/puzzleEngine';
import {
  CubeColor,
  FloatingCallout,
  Grid,
  InventoryBooster,
  LevelConfig,
  PlayerProgress,
  PolyominoShape,
  TargetKey
} from '../types/game';
import { assetUrl } from '../utils/assets';
import { TOUCH_LIFT_PX, computeBlockDropCell, getBoardCellPx, getShapeBounds } from '../utils/blockDrag';
import { triggerHaptic } from '../utils/haptics';
import { sfx } from '../utils/sound';
import { BlockTrayPiece } from './BlockTrayPiece';
import { BoosterIcon } from './BoosterIcon';
import { CUBE_PALETTE, CubeEmblem, CubeTile } from './CubeTile';
import { KnowzaSprite } from './KnowzaSprite';
import { TargetChip } from './TargetChip';

interface HybridGameScreenProps {
  level: LevelConfig;
  progress: PlayerProgress;
  startBoosters?: ('rocket' | 'bomb')[];
  bonusMovesCount: number; // triggers center rescue blast + tray refresh
  externalArmBooster?: InventoryBooster | null;
  onClearExternalArm?: () => void;
  onPause: () => void;
  onUseInventoryBooster: (type: InventoryBooster) => void;
  onOpenBoosterDetail: (type: InventoryBooster) => void;
  onProgressStats: (delta: { cubesBlasted?: number; linesCleared?: number; boostersUsed?: number }) => void;
  onWin: (starsEarned: number, remainingMoves: number) => void;
  onFail: () => void;
}

interface DragState {
  shapeIndex: number;
  shape: PolyominoShape;
  pointerX: number;
  pointerY: number;
  pointerType: string;
  hoverR: number | null;
  hoverC: number | null;
  canDrop: boolean;
}

export const HybridGameScreen: React.FC<HybridGameScreenProps> = ({
  level,
  progress,
  startBoosters = [],
  bonusMovesCount,
  externalArmBooster = null,
  onClearExternalArm,
  onPause,
  onUseInventoryBooster,
  onOpenBoosterDetail,
  onProgressStats,
  onWin,
  onFail
}) => {
  const buildBoard = () => {
    const b = createBlockAdventureBoard(level);
    startBoosters.forEach((sb, idx) => {
      const rr = 3 + idx;
      const cc = idx === 0 ? 3 : 4;
      b[rr][cc] = {
        uid: `sb_${Date.now()}_${idx}`,
        color: level.colors[0],
        special: sb === 'bomb' ? 'bomb' : 'rocket_h',
        obstacle: null
      };
    });
    return b;
  };

  const [grid, setGrid] = useState<Grid>(() => buildBoard());
  const [tray, setTray] = useState<(PolyominoShape | null)[]>(() => generateBlockTray(level.colors));
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);
  const [remainingTargets, setRemainingTargets] = useState<Partial<Record<TargetKey, number>>>(() => ({
    ...level.targets
  }));
  const [armedBooster, setArmedBooster] = useState<InventoryBooster | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [callouts, setCallouts] = useState<FloatingCallout[]>([]);
  const [ghosts, setGhosts] = useState<{ id: string; r: number; c: number; color: CubeColor | null }[]>([]);
  const [shards, setShards] = useState<
    { id: string; r: number; c: number; color: string; dx: number; dy: number; rot: number; size: number }[]
  >([]);
  const [clearedFlash, setClearedFlash] = useState<{ rows: number[]; cols: number[] }>({ rows: [], cols: [] });
  const [flyingTargets, setFlyingTargets] = useState<
    { id: string; x: number; y: number; color: CubeColor; tx: number; ty: number }[]
  >([]);
  const [targetPulse, setTargetPulse] = useState(false);
  const [boardShaking, setBoardShaking] = useState(false);
  const [mascotBounce, setMascotBounce] = useState(false);
  const [recentlyPlaced, setRecentlyPlaced] = useState<Set<string>>(new Set());
  const [outcomeTriggered, setOutcomeTriggered] = useState<'none' | 'won' | 'lost'>('none');

  const boardRef = useRef<HTMLDivElement | null>(null);
  const targetsBoxRef = useRef<HTMLDivElement | null>(null);
  const prevBonusRef = useRef<number>(bonusMovesCount);

  useEffect(() => {
    const init = buildBoard();
    setGrid(init);
    setTray(generateBlockTray(level.colors, init));
    setScore(0);
    setComboStreak(0);
    setLinesClearedTotal(0);
    setRemainingTargets({ ...level.targets });
    setArmedBooster(null);
    setRecentlyPlaced(new Set());
    setOutcomeTriggered('none');
  }, [level]);

  useEffect(() => {
    if (externalArmBooster) {
      setArmedBooster(externalArmBooster);
      onClearExternalArm?.();
    }
  }, [externalArmBooster, onClearExternalArm]);

  // Rescue blast when player buys "Alan Aç" on Fail modal
  useEffect(() => {
    if (bonusMovesCount > prevBonusRef.current) {
      prevBonusRef.current = bonusMovesCount;
      const rescued = grid.map((row, r) =>
        row.map((cell, c) => (r >= 2 && r <= 5 && c >= 2 && c <= 5 ? null : cell))
      );
      setGrid(rescued);
      setTray(generateBlockTray(level.colors, rescued));
      setOutcomeTriggered('none');
      triggerShake();
      sfx.bomb();
      pushCallout('ALAN AÇILDI!', 'Devam Et!', 'text-emerald-300');
    }
  }, [bonusMovesCount]);

  // Count how crowded the board is for Knowza reaction
  const boardOccupancy = useMemo(() => {
    let filled = 0;
    grid.forEach((row) => row.forEach((c) => c && filled++));
    return filled / (BLOCK_GRID_SIZE * BLOCK_GRID_SIZE);
  }, [grid]);

  // Target completion percentage for level progress bar
  const targetProgressPct = useMemo(() => {
    const total = Object.values(level.targets).reduce((acc, v) => acc + (v ?? 0), 0);
    if (total <= 0) return 100;
    const left = Object.values(remainingTargets).reduce((acc, v) => acc + Math.max(0, v ?? 0), 0);
    return Math.max(0, Math.min(100, Math.round(((total - left) / total) * 100)));
  }, [level.targets, remainingTargets]);

  // Win & Deadlock Fail check
  useEffect(() => {
    if (outcomeTriggered !== 'none') return;
    const allDone = Object.values(remainingTargets).every((v) => (v ?? 0) <= 0);
    if (allDone) {
      setOutcomeTriggered('won');
      const stars = comboStreak >= 2 || boardOccupancy < 0.45 ? 3 : 2;
      const bonusMovesEquivalent = Math.max(2, Math.round((1 - boardOccupancy) * 8));
      const t = setTimeout(() => onWin(stars, bonusMovesEquivalent), 480);
      return () => clearTimeout(t);
    }
    if (!hasAnyValidTrayMove(grid, tray)) {
      setOutcomeTriggered('lost');
      const t = setTimeout(() => onFail(), 520);
      return () => clearTimeout(t);
    }
  }, [remainingTargets, grid, tray, outcomeTriggered, comboStreak, boardOccupancy, onWin, onFail]);

  const triggerShake = () => {
    setBoardShaking(true);
    setTimeout(() => setBoardShaking(false), 300);
  };

  const pushCallout = (text: string, subtext?: string, colorClass = 'text-[#ffe659]') => {
    const id = `co_${Date.now()}_${Math.random()}`;
    setCallouts((prev) => [...prev.slice(-2), { id, text, subtext, colorClass }]);
    setMascotBounce(true);
    setTimeout(() => setMascotBounce(false), 550);
    setTimeout(() => setCallouts((prev) => prev.filter((c) => c.id !== id)), 1050);
  };

  const spawnVfx = (coords: [number, number][], sourceGrid: Grid) => {
    const stamp = `${Date.now()}_${Math.random()}`;
    const ghostList = coords.slice(0, 48).map(([r, c], idx) => ({
      id: `g_${stamp}_${idx}`,
      r,
      c,
      color: (sourceGrid[r]?.[c]?.color ?? null) as CubeColor | null
    }));

    const boardPx = boardRef.current?.getBoundingClientRect().width ?? 340;
    const cellPx = boardPx / BLOCK_GRID_SIZE;
    const shardList: typeof shards = [];
    coords.slice(0, 32).forEach(([r, c], idx) => {
      const col = sourceGrid[r]?.[c]?.color;
      const hex = col ? CUBE_PALETTE[col].particle : '#fde68a';
      for (let k = 0; k < 3; k++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = cellPx * (0.65 + Math.random() * 1.1);
        shardList.push({
          id: `s_${stamp}_${idx}_${k}`,
          r,
          c,
          color: hex,
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist - cellPx * 0.2,
          rot: Math.random() * 360,
          size: 5 + Math.random() * 5
        });
      }
    });

    setGhosts((prev) => [...prev.slice(-55), ...ghostList]);
    setShards((prev) => [...prev.slice(-110), ...shardList]);
    setTimeout(() => {
      const gids = new Set(ghostList.map((g) => g.id));
      setGhosts((prev) => prev.filter((g) => !gids.has(g.id)));
    }, 300);
    setTimeout(() => {
      const sids = new Set(shardList.map((x) => x.id));
      setShards((prev) => prev.filter((x) => !sids.has(x.id)));
    }, 560);

    // Target Magnet Fly-to-HUD particles
    const bRect = boardRef.current?.getBoundingClientRect();
    const tRect = targetsBoxRef.current?.getBoundingClientRect();
    if (bRect && tRect) {
      const targetCenterX = tRect.left + tRect.width * 0.5;
      const targetCenterY = tRect.top + tRect.height * 0.5;
      const flies: typeof flyingTargets = [];
      coords.forEach(([r, c], idx) => {
        const col = sourceGrid[r]?.[c]?.color;
        if (!col || (remainingTargets[col] ?? 0) <= 0 || flies.length >= 8) return;
        const startX = bRect.left + ((c + 0.5) / BLOCK_GRID_SIZE) * bRect.width;
        const startY = bRect.top + ((r + 0.5) / BLOCK_GRID_SIZE) * bRect.height;
        flies.push({
          id: `fly_${stamp}_${idx}`,
          x: startX,
          y: startY,
          color: col,
          tx: targetCenterX - startX,
          ty: targetCenterY - startY
        });
      });
      if (flies.length > 0) {
        setFlyingTargets((prev) => [...prev.slice(-12), ...flies]);
        setTimeout(() => {
          setTargetPulse(true);
          setTimeout(() => setTargetPulse(false), 220);
          const fids = new Set(flies.map((f) => f.id));
          setFlyingTargets((prev) => prev.filter((f) => !fids.has(f.id)));
        }, 440);
      }
    }
  };

  const applyCollectedTargets = (collected: Partial<Record<TargetKey, number>>) => {
    setRemainingTargets((prev) => {
      const next = { ...prev };
      (Object.keys(collected) as TargetKey[]).forEach((k) => {
        if (next[k] !== undefined) {
          next[k] = Math.max(0, (next[k] || 0) - (collected[k] || 0));
        }
      });
      return next;
    });
  };

  // Armed inventory booster tap on any cell of the 8x8 board
  const handleCellClick = (r: number, c: number) => {
    if (outcomeTriggered !== 'none' || !armedBooster) return;
    const res = applyInventoryBooster(grid, armedBooster, r, c);
    if (!res) {
      sfx.click();
      return;
    }
    spawnVfx(res.blastedCoords, grid);
    triggerHaptic(progress.hapticsEnabled, 22);
    if (res.soundType === 'disco') {
      sfx.disco();
      triggerShake();
    } else if (res.soundType === 'bomb') {
      sfx.bomb();
      triggerShake();
    } else if (res.soundType === 'rocket') {
      sfx.rocket();
      triggerShake();
    } else {
      sfx.pop(4, 2);
    }
    // Keep Block Blast static coordinates (applyInventoryBooster uses gravity by default; restore exact positions without shifting remaining rows!)
    const staticCleaned = grid.map((row, rr) =>
      row.map((cell, cc) => {
        const hit = res.blastedCoords.some(([br, bc]) => br === rr && bc === cc);
        return hit ? null : cell;
      })
    );
    setGrid(staticCleaned);
    applyCollectedTargets(res.collected);
    onUseInventoryBooster(armedBooster);
    onProgressStats({ cubesBlasted: res.cubesPopped, boostersUsed: 1 });
    if (res.comboLabel) pushCallout(res.comboLabel, 'Güçlendirici!', 'text-amber-300');
    setArmedBooster(null);
  };

  // =========================================================================
  // Block Blast Drag & Drop Handlers
  // =========================================================================
  const computeDropCell = (clientX: number, clientY: number, pointerType: string, shape: PolyominoShape) =>
    computeBlockDropCell(boardRef.current, grid, clientX, clientY, pointerType, shape);

  useEffect(() => {
    if (!drag) return;

    const handleMove = (e: PointerEvent) => {
      const pos = computeDropCell(e.clientX, e.clientY, e.pointerType, drag.shape);
      setDrag((prev) => (prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY, ...pos } : null));
    };

    const handleUp = () => {
      if (drag.canDrop && drag.hoverR !== null && drag.hoverC !== null) {
        const res = placeShapeAndClearLines(grid, drag.shape, drag.hoverR, drag.hoverC, false);
        if (res) {
          const basePts = drag.shape.cells.length * 10;
          if (res.linesCleared > 0) {
            const nextStreak = comboStreak + 1;
            const bonus = res.linesCleared * 100 * nextStreak;
            setComboStreak(nextStreak);
            setLinesClearedTotal((l) => l + res.linesCleared);
            setScore((s) => s + basePts + bonus);
            sfx.lineClear(res.linesCleared);
            triggerHaptic(progress.hapticsEnabled, [18, 24, 30]);
            triggerShake();
            setClearedFlash({ rows: res.clearedRows, cols: res.clearedCols });
            setTimeout(() => setClearedFlash({ rows: [], cols: [] }), 340);

            // Visual source grid before clear for shards + flying target cubes
            const preClearGrid = grid.map((r) => [...r]);
            drag.shape.cells.forEach(([dr, dc]) => {
              preClearGrid[drag.hoverR! + dr][drag.hoverC! + dc] = {
                uid: 'tmp',
                color: drag.shape.color
              };
            });
            spawnVfx(res.blastedCoords, preClearGrid);
            applyCollectedTargets(res.collected);
            onProgressStats({
              cubesBlasted: res.blastedCoords.length,
              linesCleared: res.linesCleared
            });

            pushCallout(
              res.linesCleared > 1 ? `${res.linesCleared}x BLOK PATLAMASI!` : 'SATIR TEMİZLENDİ!',
              nextStreak > 1 ? `🔥 ${nextStreak}x Seri! +${bonus}` : `+${bonus}`,
              'text-[#ffe855]'
            );
          } else {
            setComboStreak(0);
            setScore((s) => s + basePts);
            sfx.place();
            triggerHaptic(progress.hapticsEnabled, 14);
          }

          const clearedR = new Set(res.clearedRows);
          const clearedC = new Set(res.clearedCols);
          const landed = new Set(
            drag.shape.cells
              .map(([dr, dc]) => [drag.hoverR! + dr, drag.hoverC! + dc] as [number, number])
              .filter(([rr, cc]) => !clearedR.has(rr) && !clearedC.has(cc))
              .map(([rr, cc]) => `${rr},${cc}`)
          );
          setRecentlyPlaced(landed);
          setTimeout(() => setRecentlyPlaced(new Set()), 240);

          setGrid(res.grid);
          setTray((prevTray) => {
            const nextTray = prevTray.map((item, idx) => (idx === drag.shapeIndex ? null : item));
            if (nextTray.every((item) => item === null)) {
              return generateBlockTray(level.colors, res.grid);
            }
            return nextTray;
          });
        }
      }
      setDrag(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [drag, grid, comboStreak, level.colors]);

  const startDrag = (e: React.PointerEvent, index: number, shape: PolyominoShape) => {
    if (outcomeTriggered !== 'none') return;
    e.preventDefault();
    setArmedBooster(null);
    sfx.click();
    triggerHaptic(progress.hapticsEnabled, 8);
    const pos = computeDropCell(e.clientX, e.clientY, e.pointerType, shape);
    setDrag({
      shapeIndex: index,
      shape,
      pointerX: e.clientX,
      pointerY: e.clientY,
      pointerType: e.pointerType,
      ...pos
    });
  };

  const dragPreview = useMemo(() => {
    if (!drag || !drag.canDrop || drag.hoverR === null || drag.hoverC === null) {
      return { cells: new Set<string>(), lines: { rows: [] as number[], cols: [] as number[] } };
    }
    return {
      cells: new Set(drag.shape.cells.map(([dr, dc]) => `${drag.hoverR! + dr},${drag.hoverC! + dc}`)),
      lines: previewLineClears(grid, drag.shape, drag.hoverR, drag.hoverC)
    };
  }, [drag, grid]);

  const targetEntries = Object.entries(level.targets) as [TargetKey, number][];

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col items-center justify-center pt-14 pb-3 px-3">
      {/* Scenic Gameplay Backdrop */}
      <img
        src={assetUrl('assets/bg_gameplay.jpg')}
        alt="Oyun Arkaplanı"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 via-transparent to-[#2e1606]/40 pointer-events-none" />

      {/* Center Stage: Peeking Knowza + Skor|Hedefler Card + 8x8 Oak Board + 3-Piece Tray + 4 Boosters */}
      <div className="relative z-20 w-full max-w-[404px] flex flex-col items-center">
        {/* Top HUD Row */}
        <div className="relative z-30 w-full flex items-end justify-end mb-1">
          {/* Peeking Knowza Bear resting paw right onto the oak frame */}
          <div
            className={`absolute left-0 -bottom-[9px] w-[136px] h-[106px] pointer-events-none z-30 transition-transform duration-300 origin-bottom ${
              mascotBounce ? '-translate-y-1.5 scale-105' : ''
            }`}
          >
            {boardOccupancy >= 0.78 ? (
              <img
                src={assetUrl('assets/mascot_sad_clean.png')}
                alt="Knowza"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.42)]"
              />
            ) : (
              <KnowzaSprite
                pose="peek"
                outfit={progress.equippedOutfit}
                accessory={progress.equippedAccessory}
                className="w-full h-full object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.42)]"
              />
            )}
          </div>

          {/* Unified Skor/Seri | Hedefler Parchment Card */}
          <div className="parchment-card rounded-[20px] px-3 pt-1.5 pb-2 flex flex-col gap-1 w-[66%] ml-auto">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-center justify-center min-w-[60px]">
                <span className="text-[10.5px] font-extrabold text-[#6b3910] leading-none">
                  {comboStreak >= 2 ? (
                    <span className="inline-flex items-center gap-0.5 text-orange-600 animate-pulse">
                      <Flame className="w-3 h-3 fill-orange-500" /> {comboStreak}x Seri
                    </span>
                  ) : (
                    'Skor'
                  )}
                </span>
                <span className="font-display text-2xl font-black text-[#3d1c04] leading-none mt-1 tabular-nums">
                  {score}
                </span>
              </div>

              <div className="w-[1.5px] self-stretch bg-[#d29f61]/65 rounded-full" />

              <div ref={targetsBoxRef} className="flex-1 flex flex-col items-center justify-center">
                <span className="text-[10.5px] font-extrabold text-[#6b3910] leading-none mb-1">
                  Hedefler
                </span>
                <div className="flex items-center justify-center gap-2">
                  {targetEntries.map(([key]) => (
                    <TargetChip
                      key={key}
                      targetKey={key}
                      remaining={remainingTargets[key] ?? 0}
                      theme={progress.equippedBlockTheme}
                      pulse={targetPulse}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Target Progress Meter */}
            <div className="w-full h-1.5 rounded-full bg-[#e3c38d] overflow-hidden border border-[#b98344]/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffbe18] via-[#67d83a] to-[#22b126] transition-all duration-300"
                style={{ width: `${targetProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Armed Booster Banner */}
        {armedBooster && (
          <div className="relative z-40 mb-1 px-4 py-0.5 rounded-full bg-amber-400 border-2 border-[#6a3204] shadow-lg flex items-center gap-2 animate-pop-in">
            <Sparkles className="w-3.5 h-3.5 text-[#5e2900]" />
            <span className="text-[11px] font-black text-[#471d00]">
              {armedBooster === 'rocket' || armedBooster === 'bomb'
                ? 'Patlatmak istediğin kareye dokun!'
                : 'Hedef bloğa dokun!'}
            </span>
            <button
              type="button"
              onClick={() => setArmedBooster(null)}
              className="text-[10px] font-black bg-[#5e2900] text-amber-100 px-2 py-0.5 rounded-full"
            >
              İptal
            </button>
          </div>
        )}

        {/* Main 8x8 Oak Wooden Block Blast Board */}
        <div
          className={`wood-board-frame rounded-[20px] p-2 w-full aspect-square max-w-[355px] relative ${
            boardShaking ? 'animate-board-shake' : ''
          }`}
        >
          <div
            ref={boardRef}
            className="w-full h-full rounded-[13px] bg-[#552d0d]/95 relative shadow-inner overflow-hidden"
          >
            {/* 8x8 Grid Slots + Drag Ghost + Glowing Line-Clear Preview */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 p-0.5">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key = `${r},${c}`;
                  const isGhost = dragPreview.cells.has(key);
                  const isLineHighlight =
                    dragPreview.lines.rows.includes(r) ||
                    dragPreview.lines.cols.includes(c) ||
                    clearedFlash.rows.includes(r) ||
                    clearedFlash.cols.includes(c);

                  return (
                    <div
                      key={`slot_${key}`}
                      onClick={() => armedBooster && handleCellClick(r, c)}
                      className="p-[1.5px]"
                    >
                      <div
                        className={`w-full h-full rounded-[7px] transition-colors ${
                          isLineHighlight ? 'bg-amber-300/50 ring-2 ring-amber-200' : 'bg-[#381b05]/60'
                        }`}
                      >
                        {!cell && isGhost && drag ? (
                          <div
                            className={`w-full h-full rounded-[7px] bg-gradient-to-b ${
                              CUBE_PALETTE[drag.shape.color].bg
                            } opacity-70 border-2 border-white/90 animate-pulse`}
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 8x8 Placed Blocks Layer */}
            <div className="absolute inset-0 p-0.5 pointer-events-none">
              {grid
                .flatMap((row, r) => row.map((cell, c) => ({ cell, r, c })))
                .filter((t) => t.cell !== null)
                .map(({ cell, r, c }) => {
                  if (!cell) return null;
                  const coordKey = `${r},${c}`;
                  const isLineHit =
                    dragPreview.lines.rows.includes(r) || dragPreview.lines.cols.includes(c);
                  const isLanded = recentlyPlaced.has(coordKey);
                  return (
                    <div
                      key={cell.uid}
                      className={`absolute p-[1.5px] ${armedBooster ? 'pointer-events-auto' : ''} ${
                        isLanded ? 'animate-cube-land' : ''
                      }`}
                      style={{
                        left: `${(c / BLOCK_GRID_SIZE) * 100}%`,
                        top: `${(r / BLOCK_GRID_SIZE) * 100}%`,
                        width: `${100 / BLOCK_GRID_SIZE}%`,
                        height: `${100 / BLOCK_GRID_SIZE}%`,
                        zIndex: isLineHit ? 12 : 5
                      }}
                    >
                      <CubeTile
                        cell={cell}
                        theme={progress.equippedBlockTheme}
                        highlighted={isLineHit}
                        onClick={armedBooster ? () => handleCellClick(r, c) : undefined}
                      />
                    </div>
                  );
                })}
            </div>

            {/* Blasting Ghosts */}
            {ghosts.map((g) => (
              <div
                key={g.id}
                className="absolute p-[1.5px] pointer-events-none animate-ghost-pop"
                style={{
                  left: `${(g.c / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${(g.r / BLOCK_GRID_SIZE) * 100}%`,
                  width: `${100 / BLOCK_GRID_SIZE}%`,
                  height: `${100 / BLOCK_GRID_SIZE}%`,
                  zIndex: 20
                }}
              >
                <div
                  className={`w-full h-full rounded-[9px] cube-gloss border-2 border-white/85 ${
                    g.color ? `bg-gradient-to-b ${CUBE_PALETTE[g.color].bg}` : 'bg-amber-400'
                  }`}
                />
              </div>
            ))}

            {/* Flying Shards */}
            {shards.map((s) => (
              <span
                key={s.id}
                className="absolute pointer-events-none rounded-[3px] animate-shard-fly"
                style={{
                  left: `${((s.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${((s.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  width: s.size,
                  height: s.size,
                  backgroundColor: s.color,
                  boxShadow: `0 0 8px ${s.color}`,
                  ['--dx' as string]: `${s.dx}px`,
                  ['--dy' as string]: `${s.dy}px`,
                  ['--rot' as string]: `${s.rot}deg`,
                  zIndex: 25
                }}
              />
            ))}

            {/* Shockwave Line-Clear Beams */}
            {clearedFlash.rows.map((rr) => (
              <div
                key={`bbeam_r_${rr}`}
                className="absolute left-0 right-0 h-[12.5%] pointer-events-none bg-gradient-to-r from-transparent via-white/95 to-transparent animate-beam-flash"
                style={{ top: `${(rr / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
              />
            ))}
            {clearedFlash.cols.map((cc) => (
              <div
                key={`bbeam_c_${cc}`}
                className="absolute top-0 bottom-0 w-[12.5%] pointer-events-none bg-gradient-to-b from-transparent via-white/95 to-transparent animate-beam-flash"
                style={{ left: `${(cc / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
              />
            ))}

            {/* Floating Callouts */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-40">
              {callouts.map((co) => (
                <div key={co.id} className="animate-combo-float text-center">
                  <div
                    className={`font-display text-2xl sm:text-3xl font-black tracking-wide text-stroke-brown ${co.colorClass}`}
                  >
                    {co.text}
                  </div>
                  {co.subtext && (
                    <div className="text-xs font-black text-white bg-[#4d2407]/85 px-2.5 py-0.5 rounded-full inline-block border border-amber-300">
                      {co.subtext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sleek Block Blast 3-Piece Polyomino Tray */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="w-full max-w-[355px] mt-2 parchment-card rounded-2xl p-1.5 grid grid-cols-3 gap-1.5 items-center select-none"
        >
          {tray.map((shape, idx) => {
            if (!shape) {
              return <div key={`empty_${idx}`} className="h-[58px] rounded-xl bg-[#e4c48e]/45" />;
            }
            const fits = canShapeFitAnywhere(grid, shape);
            const isDragging = drag?.shapeIndex === idx;
            const { rows: sRows, cols: sCols } = getShapeBounds(shape);
            const maxDim = Math.max(sRows, sCols);
            const trayCellPx = maxDim >= 5 ? 9 : maxDim === 4 ? 11 : maxDim === 3 ? 13 : 15;
            return (
              <div
                key={shape.id}
                onPointerDown={(e) => startDrag(e, idx, shape)}
                className={`h-[58px] rounded-xl bg-[#f4dab0]/80 border border-[#cca065] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none transition-transform ${
                  isDragging ? 'opacity-20 scale-90' : 'hover:scale-105'
                }`}
              >
                <BlockTrayPiece
                  shape={shape}
                  cellPx={trayCellPx}
                  disabled={!fits}
                  theme={progress.equippedBlockTheme}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom 4 Wooden Booster Medallions + Golden Pause Button */}
        <div className="w-full max-w-[355px] mt-2 flex items-center justify-between gap-2">
          {(['hammer', 'rocket', 'bomb', 'disco'] as InventoryBooster[]).map((bType) => {
            const count = progress.boosters[bType] || 0;
            const isArmed = armedBooster === bType;
            return (
              <button
                key={bType}
                type="button"
                onClick={() => {
                  sfx.click();
                  if (count <= 0) {
                    onOpenBoosterDetail(bType);
                    return;
                  }
                  setArmedBooster((cur) => (cur === bType ? null : bType));
                }}
                className={`relative flex-1 h-[52px] rounded-2xl booster-tile p-1 flex items-center justify-center transition-transform active:scale-95 ${
                  isArmed ? 'ring-4 ring-yellow-300 -translate-y-1 scale-105' : ''
                }`}
              >
                <div className="w-full h-full rounded-[11px] booster-tile-inner flex items-center justify-center">
                  <BoosterIcon type={bType} className="w-8 h-8 drop-shadow-md" />
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#fff3d6] shadow ${
                    count > 0 ? 'bg-[#4f270b] text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {count > 0 ? count : '+'}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onPause();
            }}
            aria-label="Duraklat"
            className="gold-btn w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0"
          >
            <Pause className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Floating Dragged Polyomino Piece */}
      {drag && (
        <div
          className="fixed pointer-events-none z-50 drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)]"
          style={{
            left: drag.pointerX,
            top: drag.pointerY - (drag.pointerType === 'touch' ? TOUCH_LIFT_PX : 0),
            transform: 'translate(-50%, -50%)'
          }}
        >
          <BlockTrayPiece
            shape={drag.shape}
            cellPx={getBoardCellPx(boardRef.current)}
            gapPx={3}
            theme={progress.equippedBlockTheme}
          />
        </div>
      )}

      {/* Unclipped Fixed Layer for Target Magnet Fly-to-HUD Mini Cubes */}
      {flyingTargets.map((ft) => (
        <div
          key={ft.id}
          className={`fixed w-6 h-6 rounded-lg bg-gradient-to-b ${CUBE_PALETTE[ft.color].bg} border border-white shadow-lg flex items-center justify-center pointer-events-none animate-fly-target z-50`}
          style={{
            left: ft.x,
            top: ft.y,
            ['--tx' as string]: `${ft.tx}px`,
            ['--ty' as string]: `${ft.ty}px`
          }}
        >
          <CubeEmblem color={ft.color} className="w-3.5 h-3.5 text-white/80" />
        </div>
      ))}
    </div>
  );
};
