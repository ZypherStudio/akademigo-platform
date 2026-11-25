import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Crown, Flame, Pause, RotateCw, Shuffle } from 'lucide-react';
import {
  BLOCK_GRID_SIZE,
  applyInventoryBooster,
  canShapeFitAnywhere,
  createBlockAdventureBoard,
  generateBlockTray,
  hasAnyValidTrayMove,
  pickBonusCoords,
  placeShapeAndClearLines,
  previewLineClears,
  rotatePolyomino,
  strikeFeverLightning,
  tickBoardEmbers
} from '../utils/puzzleEngine';
import {
  CubeColor,
  FloatingCallout,
  Grid,
  InventoryBooster,
  KnowzaMood,
  LevelConfig,
  PlayerProgress,
  PolyominoShape,
  TargetKey
} from '../types/game';
import { getBiomeForLevel } from '../data/biomes';
import { computeBlockDropCell, getShapeBounds } from '../utils/blockDrag';
import { buildBlastVfx } from '../utils/boardVfx';
import { triggerHaptic } from '../utils/haptics';
import { sfx } from '../utils/sound';
import { BiomeWorldBackground } from './BiomeWorldArt';
import { BlockTrayPiece } from './BlockTrayPiece';
import {
  BeamVfx,
  BoardVfxLayer,
  BoosterActionLayer,
  BoosterActionVfx,
  GhostVfx,
  RingVfx,
  ShardVfx
} from './BoardVfxLayer';
import { BoosterIcon } from './BoosterIcon';
import { CoachMarkTip, CoachTipId, detectActiveCoachTip } from './CoachMarkTip';
import { CUBE_PALETTE, CubeEmblem, CubeTile } from './CubeTile';
import { FeverMeterControl, INSTANT_FEVER_COIN_COST } from './FeverMeterControl';
import { FloatingDraggedPiece } from './FloatingDraggedPiece';
import { HoldSlotBox } from './HoldSlotBox';
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
  onProgressStats: (delta: {
    cubesBlasted?: number;
    linesCleared?: number;
    boostersUsed?: number;
    bonusCoins?: number;
  }) => void;
  onSpendCoins?: (amount: number) => boolean;
  onMoodChange?: (mood: KnowzaMood) => void;
  seenTutorialTips?: string[];
  onDismissTutorialTip?: (tipId: CoachTipId) => void;
  onWin: (starsEarned: number, remainingMoves: number) => void;
  onFail: () => void;
}

const START_BOOSTER_SLOTS: [number, number][] = [
  [1, 2],
  [6, 5],
  [2, 5],
  [5, 2],
  [1, 4],
  [6, 3]
];

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
  onSpendCoins,
  onMoodChange,
  seenTutorialTips = [],
  onDismissTutorialTip,
  onWin,
  onFail
}) => {
  const biome = getBiomeForLevel(level.id);

  const buildBoard = () => {
    const b = createBlockAdventureBoard(level);
    startBoosters.forEach((sb, idx) => {
      const candidateSlots = [...START_BOOSTER_SLOTS, [0, 0] as [number, number], [7, 7] as [number, number]];
      const slot = candidateSlots.find(([rr, cc], i) => i >= idx && b[rr][cc]?.obstacle !== 'boss');
      if (!slot) return;
      const [rr, cc] = slot;
      b[rr][cc] = {
        uid: `sb_${Date.now()}_${idx}`,
        color: level.colors[idx % level.colors.length],
        special: sb === 'bomb' ? 'bomb' : 'rocket_h',
        obstacle: null
      };
    });
    return b;
  };

  const [grid, setGrid] = useState<Grid>(() => buildBoard());
  const [bonusCoords, setBonusCoords] = useState<Set<string>>(() => pickBonusCoords(grid, 2));
  const [heldShape, setHeldShape] = useState<PolyominoShape | null>(null);
  const [armHoldMode, setArmHoldMode] = useState(false);
  const [tray, setTray] = useState<(PolyominoShape | null)[]>(() =>
    generateBlockTray(level.colors, undefined, { allowAdvanced: level.id >= 3 })
  );
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);
  const [feverPct, setFeverPct] = useState(0);
  const [feverTurns, setFeverTurns] = useState(0);
  const [rotateCharges, setRotateCharges] = useState(3);
  const [rerollCharges, setRerollCharges] = useState(1);
  const [remainingTargets, setRemainingTargets] = useState<Partial<Record<TargetKey, number>>>(() => ({
    ...level.targets
  }));
  const [armedBooster, setArmedBooster] = useState<InventoryBooster | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [callouts, setCallouts] = useState<FloatingCallout[]>([]);
  const [ghosts, setGhosts] = useState<GhostVfx[]>([]);
  const [shards, setShards] = useState<ShardVfx[]>([]);
  const [rocketBeams, setRocketBeams] = useState<BeamVfx[]>([]);
  const [bombRings, setBombRings] = useState<RingVfx[]>([]);
  const [boosterActions, setBoosterActions] = useState<BoosterActionVfx[]>([]);
  const [clearedFlash, setClearedFlash] = useState<{ rows: number[]; cols: number[] }>({ rows: [], cols: [] });
  const [flyingTargets, setFlyingTargets] = useState<
    { id: string; x: number; y: number; color: CubeColor; tx: number; ty: number }[]
  >([]);
  const [targetPulse, setTargetPulse] = useState(false);
  const [boardShaking, setBoardShaking] = useState(false);
  const [mascotBounce, setMascotBounce] = useState(false);
  const [mascotReaction, setMascotReaction] = useState<'none' | 'happy' | 'combo'>('none');
  const [mascotSpeech, setMascotSpeech] = useState<string | null>(null);
  const [recentlyPlaced, setRecentlyPlaced] = useState<Set<string>>(new Set());
  const [outcomeTriggered, setOutcomeTriggered] = useState<'none' | 'won' | 'lost'>('none');
  const [showStageIntro, setShowStageIntro] = useState(true);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const targetsBoxRef = useRef<HTMLDivElement | null>(null);
  const prevBonusRef = useRef<number>(bonusMovesCount);

  useEffect(() => {
    setShowStageIntro(true);
    const t = setTimeout(() => setShowStageIntro(false), 1950);
    return () => clearTimeout(t);
  }, [level.id]);

  const activeCoachTip = useMemo(
    () =>
      detectActiveCoachTip({
        grid,
        bonusCount: bonusCoords.size,
        seenTips: seenTutorialTips,
        allowHoldHint: level.id >= 2
      }),
    [grid, bonusCoords, seenTutorialTips, level.id]
  );

  useEffect(() => {
    const init = buildBoard();
    setGrid(init);
    setBonusCoords(pickBonusCoords(init, 2));
    setHeldShape(null);
    setArmHoldMode(false);
    setTray(generateBlockTray(level.colors, init, { allowAdvanced: level.id >= 3 }));
    setScore(0);
    setComboStreak(0);
    setLinesClearedTotal(0);
    setFeverPct(0);
    setFeverTurns(0);
    setRotateCharges(3);
    setRerollCharges(1);
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

  // Win & Deadlock Fail check (also allows rotate/reroll tactical rescue before triggering Fail!)
  const hasAnyDirectMove = useMemo(
    () =>
      hasAnyValidTrayMove(grid, tray) ||
      Boolean(heldShape && canShapeFitAnywhere(grid, heldShape)),
    [grid, tray, heldShape]
  );
  const canRescueByTactics = useMemo(() => {
    if (hasAnyDirectMove) return true;
    if (rerollCharges > 0) return true;
    if (!heldShape && tray.some((s) => s !== null)) return true; // Holding 1 piece might unlock refill moves!
    if (rotateCharges > 0) {
      const rotatedTray = tray.map((s) => (s ? rotatePolyomino(s) : null));
      if (hasAnyValidTrayMove(grid, rotatedTray)) return true;
      const rotated2 = rotatedTray.map((s) => (s ? rotatePolyomino(s) : null));
      if (hasAnyValidTrayMove(grid, rotated2)) return true;
      const rotated3 = rotated2.map((s) => (s ? rotatePolyomino(s) : null));
      if (hasAnyValidTrayMove(grid, rotated3)) return true;
    }
    return false;
  }, [hasAnyDirectMove, rerollCharges, rotateCharges, grid, tray, heldShape]);

  const boosterBusy = boosterActions.length > 0;
  const winMetaRef = useRef<{ stars: number; bonusMoves: number }>({ stars: 3, bonusMoves: 4 });
  const onWinRef = useRef(onWin);
  const onFailRef = useRef(onFail);
  onWinRef.current = onWin;
  onFailRef.current = onFail;

  useEffect(() => {
    if (outcomeTriggered !== 'none' || boosterBusy) return;
    const allDone = Object.values(remainingTargets).every((v) => (v ?? 0) <= 0);
    if (allDone) {
      const stars = comboStreak >= 2 || boardOccupancy < 0.45 ? 3 : 2;
      const bonusMoves = Math.max(2, Math.round((1 - boardOccupancy) * 8));
      winMetaRef.current = { stars, bonusMoves };
      setOutcomeTriggered('won');
      return;
    }
    if (!canRescueByTactics) {
      setOutcomeTriggered('lost');
    }
  }, [remainingTargets, canRescueByTactics, outcomeTriggered, boosterBusy, comboStreak, boardOccupancy]);

  useEffect(() => {
    if (outcomeTriggered === 'won') {
      const t = window.setTimeout(() => {
        onWinRef.current(winMetaRef.current.stars, winMetaRef.current.bonusMoves);
      }, 480);
      return () => window.clearTimeout(t);
    }
    if (outcomeTriggered === 'lost') {
      const t = window.setTimeout(() => {
        onFailRef.current();
      }, 520);
      return () => window.clearTimeout(t);
    }
  }, [outcomeTriggered]);

  const knowzaMood: KnowzaMood =
    outcomeTriggered === 'won'
      ? 'celebrate'
      : outcomeTriggered === 'lost'
      ? 'sad'
      : feverTurns > 0
      ? 'fever'
      : mascotReaction === 'combo'
      ? 'combo'
      : mascotReaction === 'happy'
      ? 'happy'
      : boardOccupancy >= 0.75
      ? 'worried'
      : drag
      ? 'drag'
      : 'idle';

  useEffect(() => {
    onMoodChange?.(knowzaMood);
  }, [knowzaMood, onMoodChange]);

  const triggerMascotReaction = (reaction: 'happy' | 'combo', speech?: string) => {
    setMascotReaction(reaction);
    if (speech) setMascotSpeech(speech);
    setMascotBounce(true);
    setTimeout(() => setMascotBounce(false), 550);
    setTimeout(() => {
      setMascotReaction('none');
      setMascotSpeech(null);
    }, 1300);
  };

  const handlePetKnowza = () => {
    sfx.pop(4, 2);
    const cheerLines =
      boardOccupancy >= 0.75
        ? ['Dikkat, az yer kaldı!', 'Çekiç kullanabilirsin!']
        : progress.equippedOutfit === 'karate'
        ? ['Dojo odağı!', 'Harika hamle!']
        : ['Haydi şampiyon!', 'Satırları doldur!'];
    triggerMascotReaction('happy', cheerLines[Math.floor(Math.random() * cheerLines.length)]);
  };

  const triggerShake = () => {
    setBoardShaking(true);
    setTimeout(() => setBoardShaking(false), 300);
  };

  const pushCallout = (
    text: string,
    subtext?: string,
    colorClass = 'text-[#ffe659]',
    variant: FloatingCallout['variant'] = 'clear'
  ) => {
    const id = `co_${Date.now()}_${Math.random()}`;
    setCallouts((prev) => [...prev.slice(-2), { id, text, subtext, colorClass, variant }]);
    setTimeout(() => setCallouts((prev) => prev.filter((c) => c.id !== id)), 1050);
  };

  const spawnVfx = (
    coords: [number, number][],
    sourceGrid: Grid,
    beamsInput: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [],
    ringsInput: [number, number][] = []
  ) => {
    const boardPx = boardRef.current?.getBoundingClientRect().width ?? 340;
    const { ghosts: ghostList, shards: shardList, beams: beamList, rings: ringList } = buildBlastVfx(
      coords,
      sourceGrid,
      boardPx,
      beamsInput,
      ringsInput
    );

    setGhosts((prev) => [...prev.slice(-55), ...ghostList]);
    setShards((prev) => [...prev.slice(-110), ...shardList]);
    if (beamList.length > 0) setRocketBeams((prev) => [...prev, ...beamList]);
    if (ringList.length > 0) setBombRings((prev) => [...prev, ...ringList]);

    setTimeout(() => {
      const gids = new Set(ghostList.map((g) => g.id));
      const bids = new Set(beamList.map((b) => b.id));
      setGhosts((prev) => prev.filter((g) => !gids.has(g.id)));
      setRocketBeams((prev) => prev.filter((b) => !bids.has(b.id)));
    }, 340);
    setTimeout(() => {
      const sids = new Set(shardList.map((x) => x.id));
      const rids = new Set(ringList.map((r) => r.id));
      setShards((prev) => prev.filter((x) => !sids.has(x.id)));
      setBombRings((prev) => prev.filter((r) => !rids.has(r.id)));
    }, 560);

    // Target Magnet Fly-to-HUD particles
    const stamp = `${Date.now()}_${Math.random()}`;
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

  const applyCollectedTargets = (collected: Partial<Record<TargetKey, number>>, multiplier = 1) => {
    setRemainingTargets((prev) => {
      const next = { ...prev };
      (Object.keys(collected) as TargetKey[]).forEach((k) => {
        if (next[k] !== undefined) {
          next[k] = Math.max(0, (next[k] || 0) - (collected[k] || 0) * multiplier);
        }
      });
      return next;
    });
  };

  // Armed inventory booster tap on any cell of the 8x8 board -> plays physical booster model animation!
  const handleCellClick = (r: number, c: number) => {
    if (outcomeTriggered !== 'none' || !armedBooster || boosterBusy) return;
    const usedBooster = armedBooster;
    const res = applyInventoryBooster(grid, usedBooster, r, c, undefined, true);
    if (!res) {
      sfx.click();
      return;
    }

    const actionId = `ba_${Date.now()}_${Math.random()}`;
    const delayMs =
      usedBooster === 'hammer'
        ? 185
        : usedBooster === 'bomb'
        ? 210
        : usedBooster === 'disco'
        ? 220
        : 120;

    sfx.click();
    setArmedBooster(null);
    onUseInventoryBooster(usedBooster);
    setBoosterActions((prev) => [
      ...prev,
      {
        id: actionId,
        type: usedBooster,
        r,
        c,
        targets: usedBooster === 'disco' ? res.blastedCoords : undefined
      }
    ]);

    const sourceSnapshot = grid;
    setTimeout(() => {
      spawnVfx(res.blastedCoords, sourceSnapshot, res.rocketBeams, res.bombRings);
      triggerHaptic(progress.hapticsEnabled, 24);
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
        sfx.pop(5, 2);
        triggerShake();
      }
      setGrid(res.grid);
      applyCollectedTargets(res.collected);
      onProgressStats({ cubesBlasted: res.cubesPopped, boostersUsed: 1 });
      if (res.comboLabel) pushCallout(res.comboLabel, 'Güçlendirici!', 'text-amber-300');
      triggerMascotReaction(
        usedBooster === 'disco' || usedBooster === 'bomb' ? 'combo' : 'happy',
        usedBooster === 'hammer'
          ? 'Tam vuruş!'
          : usedBooster === 'rocket'
          ? 'Çapraz roket!'
          : usedBooster === 'bomb'
          ? 'Büyük patlama!'
          : 'Renk yağmuru!'
      );
    }, delayMs);

    setTimeout(() => {
      setBoosterActions((prev) => prev.filter((a) => a.id !== actionId));
    }, delayMs + 340);
  };

  const handleRotateTray = () => {
    if (outcomeTriggered !== 'none' || rotateCharges <= 0 || boosterBusy) return;
    sfx.rotate();
    triggerHaptic(progress.hapticsEnabled, 10);
    setRotateCharges((c) => c - 1);
    setTray((prev) => prev.map((s) => (s ? rotatePolyomino(s) : null)));
  };

  const handleRerollTray = () => {
    if (outcomeTriggered !== 'none' || rerollCharges <= 0 || boosterBusy) return;
    sfx.reward();
    triggerHaptic(progress.hapticsEnabled, 14);
    setRerollCharges((c) => c - 1);
    setTray(
      generateBlockTray(level.colors, grid, {
        allowAdvanced: level.id >= 3,
        forceSpecial: feverTurns > 0
      })
    );
  };

  const handleInstantFever = () => {
    if (outcomeTriggered !== 'none' || feverTurns > 0 || boosterBusy) return;
    if (onSpendCoins && !onSpendCoins(INSTANT_FEVER_COIN_COST)) return;
    setFeverPct(0);
    setFeverTurns(3);
    setRerollCharges((c) => Math.min(3, c + 1));
    triggerShake();
    triggerHaptic(progress.hapticsEnabled, [18, 28, 36]);
    const lightning = strikeFeverLightning(grid, 3);
    if (lightning.blastedCoords.length > 0) {
      spawnVfx(lightning.blastedCoords, grid);
      applyCollectedTargets(lightning.collected, 2);
      setGrid(lightning.grid);
    }
    pushCallout('KNOWZA ATEŞİ 2×!', '3 Hamle 2× Hedef + Yıldırım!', 'text-orange-300', 'fever');
    triggerMascotReaction('combo', 'Ateş modu!');
  };

  // =========================================================================
  // Block Blast Drag & Drop Handlers
  // =========================================================================
  const computeDropCell = (clientX: number, clientY: number, pointerType: string, shape: PolyominoShape) =>
    computeBlockDropCell(boardRef.current, grid, clientX, clientY, pointerType, shape);

  const dragMoveRef = useRef<(e: PointerEvent) => void>(() => {});
  const dragUpRef = useRef<() => void>(() => {});

  dragMoveRef.current = (e: PointerEvent) => {
    if (!drag) return;
    const pos = computeDropCell(e.clientX, e.clientY, e.pointerType, drag.shape);
    setDrag((prev) => (prev ? { ...prev, pointerX: e.clientX, pointerY: e.clientY, ...pos } : null));
  };

  dragUpRef.current = () => {
    if (!drag) return;
    if (drag.canDrop && drag.hoverR !== null && drag.hoverC !== null) {
      const res = placeShapeAndClearLines(grid, drag.shape, drag.hoverR, drag.hoverC, false);
      if (res) {
        const isFeverActive = feverTurns > 0 || Boolean(drag.shape.isGoldBonus);
        const hitBonusSquare = drag.shape.cells.some(([dr, dc]) =>
          bonusCoords.has(`${drag.hoverR! + dr},${drag.hoverC! + dc}`)
        );
        const scoreMult = (isFeverActive ? 2 : 1) * (hitBonusSquare ? 2 : 1);
        const targetMult = isFeverActive || hitBonusSquare ? 2 : 1;
        const basePts = drag.shape.cells.length * 10 * scoreMult;

        let finalGrid = res.grid;
        let nextFeverActiveForTray = isFeverActive;

        if (res.linesCleared > 0) {
          const nextStreak = comboStreak + 1;
          const isCross = res.clearedRows.length > 0 && res.clearedCols.length > 0;
          const crossMult = isCross ? 2 : 1;
          const specialBonus = res.specialsTriggered * 150 + (res.superFusionTriggered ? 300 : 0);
          const bonus = (res.linesCleared * 100 * nextStreak * crossMult + specialBonus) * scoreMult;
          setComboStreak(nextStreak);
          setLinesClearedTotal((l) => l + res.linesCleared);
          setScore((s) => s + basePts + bonus);

          if (res.linesCleared >= 2) {
            setRotateCharges((c) => Math.min(5, c + 1));
          }

          if (res.superFusionTriggered || res.specialsTriggered > 0) {
            sfx.disco();
          } else {
            sfx.lineClear(res.linesCleared);
          }
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
          spawnVfx(res.blastedCoords, preClearGrid, res.rocketBeams, res.bombRings);
          applyCollectedTargets(res.collected, targetMult);
          onProgressStats({
            cubesBlasted: res.blastedCoords.length,
            linesCleared: res.linesCleared,
            bonusCoins: hitBonusSquare ? 15 : 0
          });

          // Charge Knowza Fever or tick active Fever
          let triggeredFeverNow = false;
          if (feverTurns > 0) {
            const left = Math.max(0, feverTurns - 1);
            setFeverTurns(left);
            nextFeverActiveForTray = left > 0;
          } else {
            const gain = res.linesCleared * 28 + (isCross ? 25 : 0) + (nextStreak >= 2 ? 15 : 0);
            const nextPct = feverPct + gain;
            if (nextPct >= 100) {
              triggeredFeverNow = true;
              nextFeverActiveForTray = true;
              setFeverPct(0);
              setFeverTurns(3);
              setRerollCharges((c) => Math.min(3, c + 1));
              sfx.fever();

              const lightning = strikeFeverLightning(finalGrid, 3);
              if (lightning.blastedCoords.length > 0) {
                spawnVfx(lightning.blastedCoords, finalGrid);
                applyCollectedTargets(lightning.collected, 2);
                finalGrid = lightning.grid;
              }
            } else {
              setFeverPct(nextPct);
            }
          }

          const title = triggeredFeverNow
            ? 'KNOWZA ATEŞİ 2×!'
            : res.superFusionTriggered
            ? 'SÜPER BİRLEŞİM!'
            : hitBonusSquare
            ? '2× ALTIN KARE!'
            : isCross
            ? 'ÇAPRAZ PATLAMA!'
            : res.specialsTriggered > 0
            ? 'ZİNCİR PATLAMA!'
            : res.linesCleared > 1
            ? `${res.linesCleared}x BLOK PATLAMASI!`
            : 'SATIR TEMİZLENDİ!';
          const sub =
            triggeredFeverNow
              ? '3 Hamle 2× Hedef + Yıldırım!'
              : res.superFusionTriggered
              ? `3× Lazer Fırtınası! +${bonus}`
              : hitBonusSquare
              ? `2× Hedef & +15 Altın! +${bonus}`
              : nextStreak > 1
              ? `${nextStreak}x Seri! +${bonus}`
              : isFeverActive
              ? `2× Ateş! +${bonus}`
              : `+${bonus}`;
          const variant: FloatingCallout['variant'] = triggeredFeverNow
            ? 'fever'
            : res.superFusionTriggered || res.specialsTriggered > 0
            ? 'chain'
            : isCross
            ? 'cross'
            : res.linesCleared > 1 || nextStreak > 1
            ? 'combo'
            : 'clear';
          pushCallout(title, sub, triggeredFeverNow ? 'text-orange-300' : 'text-[#ffe855]', variant);
          triggerMascotReaction(
            res.linesCleared >= 2 || nextStreak >= 2 || triggeredFeverNow || res.superFusionTriggered
              ? 'combo'
              : 'happy',
            triggeredFeverNow ? 'Ateş modu!' : res.superFusionTriggered ? 'Efsane birleşim!' : isCross ? 'Muhteşem!' : undefined
          );
          setBonusCoords(pickBonusCoords(finalGrid, 2));
        } else {
          setComboStreak(0);
          setScore((s) => s + basePts);
          if (hitBonusSquare) {
            onProgressStats({ bonusCoins: 8 });
            pushCallout('ALTIN KARE!', '+8 Altın Kapıldı!', 'text-yellow-300', 'combo');
            setBonusCoords(pickBonusCoords(finalGrid, 2));
          }
          if (feverTurns > 0) {
            const left = Math.max(0, feverTurns - 1);
            setFeverTurns(left);
            nextFeverActiveForTray = left > 0;
          } else {
            setFeverPct((p) => Math.min(95, p + 6));
          }
          sfx.place();
          triggerHaptic(progress.hapticsEnabled, 14);
        }

        // Tick countdown timers on remaining ember obstacles
        const emberTick = tickBoardEmbers(finalGrid);
        finalGrid = emberTick.grid;
        if (emberTick.eruptedCoords.length > 0) {
          spawnVfx(emberTick.eruptedCoords, finalGrid, [], emberTick.eruptedCoords);
          triggerShake();
          sfx.fail();
          pushCallout('KÖZ PATLADI!', 'Sönmeyen közü temizle!', 'text-orange-300', 'fever');
          triggerMascotReaction('happy', 'Közlere dikkat!');
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

        setGrid(finalGrid);
        if (drag.shapeIndex === -1) {
          setHeldShape(null);
        } else {
          setTray((prevTray) => {
            const nextTray = prevTray.map((item, idx) => (idx === drag.shapeIndex ? null : item));
            if (nextTray.every((item) => item === null)) {
              return generateBlockTray(level.colors, finalGrid, {
                allowAdvanced: level.id >= 3,
                forceSpecial: nextFeverActiveForTray
              });
            }
            return nextTray;
          });
        }
      }
    }
    setDrag(null);
  };

  const dragActive = drag !== null;
  useEffect(() => {
    if (!dragActive) return;
    const onMove = (e: PointerEvent) => dragMoveRef.current(e);
    const onUp = () => dragUpRef.current();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragActive]);

  const startDrag = (e: React.PointerEvent, index: number, shape: PolyominoShape) => {
    if (outcomeTriggered !== 'none' || boosterBusy) return;
    e.preventDefault();
    setArmedBooster(null);
    if (armHoldMode && index >= 0 && !heldShape) {
      sfx.rotate();
      setHeldShape(shape);
      setArmHoldMode(false);
      setTray((prevTray) => {
        const nextTray = prevTray.map((item, idx) => (idx === index ? null : item));
        if (nextTray.every((item) => item === null)) {
          return generateBlockTray(level.colors, grid, {
            allowAdvanced: level.id >= 3,
            forceSpecial: feverTurns > 0
          });
        }
        return nextTray;
      });
      pushCallout('YEDEK ALINDI!', 'İstediğin tur sürükle!', 'text-amber-200', 'clear');
      return;
    }
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
    if (!drag || drag.hoverR === null || drag.hoverC === null) {
      return {
        cells: new Set<string>(),
        invalidCells: new Set<string>(),
        lines: { rows: [] as number[], cols: [] as number[] }
      };
    }
    const coords = drag.shape.cells
      .map(([dr, dc]) => [drag.hoverR! + dr, drag.hoverC! + dc] as [number, number])
      .filter(([rr, cc]) => rr >= 0 && rr < BLOCK_GRID_SIZE && cc >= 0 && cc < BLOCK_GRID_SIZE)
      .map(([rr, cc]) => `${rr},${cc}`);

    if (!drag.canDrop) {
      return {
        cells: new Set<string>(),
        invalidCells: new Set(coords),
        lines: { rows: [] as number[], cols: [] as number[] }
      };
    }
    return {
      cells: new Set(coords),
      invalidCells: new Set<string>(),
      lines: previewLineClears(grid, drag.shape, drag.hoverR, drag.hoverC)
    };
  }, [drag, grid]);

  const targetEntries = Object.entries(level.targets) as [TargetKey, number][];

  return (
    <div
      className={`relative flex-1 w-full h-full overflow-hidden flex flex-col items-center ${
        dragActive ? 'touch-none select-none' : ''
      }`}
    >
      {/* Illustrated & Animated Biome Gameplay World */}
      <BiomeWorldBackground biome={biome} variant="gameplay" />

      {/* Non-scrolling Top Guard matching Floating TopHud */}
      <div className="relative z-20 h-[60px] shrink-0 w-full pointer-events-none" />

      {/* Center Stage: Peeking Knowza + Skor|Hedefler Card + 8x8 Oak Board + 3-Piece Tray + 4 Boosters */}
      <div
        className={`relative z-20 flex-1 min-h-0 w-full flex flex-col items-center px-3 pb-2 no-scrollbar ${
          dragActive ? 'overflow-hidden touch-none' : 'overflow-y-auto'
        }`}
      >
        <div className="w-full max-w-[404px] flex flex-col items-center my-auto">
        {/* Top HUD Row */}
        <div className="relative z-30 w-full flex items-end justify-end mb-1">
          {/* Interactive Live Animated Knowza Mascot resting paws onto the oak frame */}
          <button
            type="button"
            onClick={handlePetKnowza}
            className={`absolute left-0 -bottom-[9px] w-[136px] h-[106px] z-30 transition-transform duration-300 origin-bottom focus:outline-none ${
              mascotBounce ? '-translate-y-1.5 scale-105' : 'active:scale-95'
            }`}
            title="Knowza"
          >
            {mascotSpeech && (
              <span className="absolute -top-4 left-2 whitespace-nowrap bg-[#fff7dc] border-2 border-[#a86f34] text-[#471f04] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg animate-pop-in z-40">
                {mascotSpeech}
              </span>
            )}
            <KnowzaSprite
              pose="peek"
              outfit={progress.equippedOutfit}
              accessory={progress.equippedAccessory}
              mood={knowzaMood}
              className="w-full h-full object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.42)]"
            />
          </button>

          {/* Unified Skor/Seri | Hedefler Biome-Themed Card */}
          <div className={`${biome.hudCardClass} rounded-[20px] px-3 pt-1.5 pb-2 flex flex-col gap-1 w-[66%] ml-auto transition-colors duration-300`}>
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-center justify-center min-w-[60px]">
                <span className={`text-[10.5px] font-extrabold ${biome.hudSubTextClass} leading-none`}>
                  {comboStreak >= 2 ? (
                    <span className="inline-flex items-center gap-0.5 text-orange-500 animate-pulse">
                      <Flame className="w-3 h-3 fill-orange-500" /> {comboStreak}x Seri
                    </span>
                  ) : (
                    'Skor'
                  )}
                </span>
                <span className={`font-display text-2xl font-black ${biome.hudTitleTextClass} leading-none mt-1 tabular-nums`}>
                  {score}
                </span>
              </div>

              <div className="w-[1.5px] self-stretch bg-current opacity-20 rounded-full" />

              <div ref={targetsBoxRef} className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between gap-1 mb-1 px-0.5">
                  <span className={`text-[10.5px] font-extrabold ${biome.hudSubTextClass} leading-none`}>
                    Hedefler
                  </span>
                  <span
                    className={`px-1.5 py-[1px] rounded-full text-[8.5px] font-black border leading-tight ${biome.badgeClass}`}
                  >
                    {biome.name}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {targetEntries.map(([key]) => (
                    <TargetChip
                      key={key}
                      targetKey={key}
                      remaining={remainingTargets[key] ?? 0}
                      theme={progress.equippedBlockTheme}
                      biome={biome.id}
                      labelClass={biome.hudTitleTextClass}
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
            <BoosterIcon type={armedBooster} className="w-4 h-4 shrink-0 drop-shadow" />
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

        {/* Contextual First-Time Spotlight Tip (non-blocking dismiss) */}
        {activeCoachTip && onDismissTutorialTip && !armedBooster && (
          <CoachMarkTip tipId={activeCoachTip} onDismiss={onDismissTutorialTip} />
        )}

        {/* Main Biome-Styled 8x8 Block Blast Board */}
        <div
          className={`rounded-[20px] border-4 ${biome.boardFrameClass} shadow-[0_12px_28px_rgba(0,0,0,0.42)] p-2 w-full aspect-square max-w-[355px] relative transition-shadow ${
            boardShaking ? 'animate-board-shake' : ''
          } ${
            feverTurns > 0
              ? 'ring-2 ring-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.8)]'
              : boardOccupancy >= 0.78
              ? 'ring-2 ring-rose-400/80'
              : ''
          }`}
        >
          <div
            ref={boardRef}
            className={`w-full h-full rounded-[13px] ${biome.boardInnerColor} relative shadow-inner overflow-hidden`}
          >
            {/* 8x8 Grid Slots + Crisp Snapped Slot Guide + Glowing Line-Clear Preview */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 p-0.5">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key = `${r},${c}`;
                  const isGhost = dragPreview.cells.has(key);
                  const isInvalidGhost = dragPreview.invalidCells.has(key);
                  const isLineHighlight =
                    dragPreview.lines.rows.includes(r) ||
                    dragPreview.lines.cols.includes(c) ||
                    clearedFlash.rows.includes(r) ||
                    clearedFlash.cols.includes(c);

                  const isBonusTile = !cell && bonusCoords.has(key);

                  return (
                    <div
                      key={`slot_${key}`}
                      onClick={() => armedBooster && handleCellClick(r, c)}
                      className="p-[1.5px]"
                    >
                      <div
                        className={`w-full h-full rounded-[7px] transition-colors flex items-center justify-center relative ${
                          isLineHighlight
                            ? 'bg-amber-300/50 ring-2 ring-amber-200'
                            : isInvalidGhost
                            ? 'bg-rose-500/45 ring-2 ring-rose-300'
                            : !cell && isGhost
                            ? 'bg-white/25 ring-2 ring-white/90'
                            : isBonusTile
                            ? 'bg-amber-400/20 ring-1 ring-amber-300/90 shadow-[inset_0_0_8px_rgba(251,191,36,0.45)]'
                            : 'bg-black/25'
                        }`}
                      >
                        {isBonusTile && !isGhost && (
                          <span className="text-[9px] font-black text-amber-200 drop-shadow animate-pulse pointer-events-none">
                            2×
                          </span>
                        )}
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
                        biome={biome.id}
                        highlighted={isLineHit}
                        onClick={armedBooster ? () => handleCellClick(r, c) : undefined}
                      />
                    </div>
                  );
                })}

              {/* Unified 2x2 Milestone Boss Crest + Live HP Bar */}
              {(() => {
                const bossCell = grid.flat().find((cell) => cell?.obstacle === 'boss');
                if (!bossCell) return null;
                const hp = bossCell.obstacleHp ?? 4;
                const maxHp = bossCell.bossMaxHp ?? 4;
                const hpPct = Math.max(8, Math.round((hp / maxHp) * 100));
                return (
                  <div
                    className="absolute pointer-events-none z-20 flex flex-col items-center justify-center p-1"
                    style={{ left: '37.5%', top: '37.5%', width: '25%', height: '25%' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 border-2 border-[#4a2000] flex items-center justify-center shadow-md mb-1">
                      <Crown className="w-4 h-4 text-[#4a2000]" />
                    </div>
                    <div className="w-[82%] bg-black/80 border border-amber-300 rounded-full px-1 py-0.5 text-center shadow">
                      <div className="text-[7.5px] font-black text-amber-200 leading-none mb-0.5">
                        PATRON {hp}/{maxHp}
                      </div>
                      <div className="w-full h-1 bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-300 transition-all duration-300"
                          style={{ width: `${hpPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <BoardVfxLayer
              ghosts={ghosts}
              shards={shards}
              clearedFlash={clearedFlash}
              rocketBeams={rocketBeams}
              bombRings={bombRings}
              callouts={callouts}
            />
          </div>
          <BoosterActionLayer actions={boosterActions} />
        </div>

        {/* Interactive Fever Meter + Tactical Rotate / Reroll Controls */}
        <div className="w-full max-w-[355px] mt-1.5 flex items-center justify-between gap-2 relative z-30">
          <FeverMeterControl
            feverPct={feverPct}
            feverTurns={feverTurns}
            panelClass={biome.panelClass}
            coins={progress.coins}
            onInstantIgnite={onSpendCoins ? handleInstantFever : undefined}
          />

          <button
            type="button"
            disabled={rotateCharges <= 0}
            onClick={handleRotateTray}
            className={`brown-btn rounded-full px-2.5 py-1 flex items-center gap-1 text-[10.5px] font-black shrink-0 disabled:opacity-40 ${
              !hasAnyDirectMove && rotateCharges > 0 ? 'ring-2 ring-yellow-300 animate-pulse' : ''
            }`}
          >
            <RotateCw className="w-3 h-3" />
            <span>Döndür ({rotateCharges})</span>
          </button>

          <button
            type="button"
            disabled={rerollCharges <= 0}
            onClick={handleRerollTray}
            className={`brown-btn rounded-full px-2.5 py-1 flex items-center gap-1 text-[10.5px] font-black shrink-0 disabled:opacity-40 ${
              !hasAnyDirectMove && rerollCharges > 0 ? 'ring-2 ring-emerald-300 animate-pulse' : ''
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Yenile ({rerollCharges})</span>
          </button>
        </div>

        {armHoldMode && !heldShape && outcomeTriggered === 'none' && (
          <div className="w-full max-w-[355px] mt-1 bg-amber-500/95 border border-yellow-200 rounded-xl px-2.5 py-1 text-center text-[10px] font-black text-[#471f04] shadow animate-pop-in">
            Yedeklemek istediğin parçaya dokun! (Tekrar Yedek’e basarak iptal edebilirsin)
          </div>
        )}

        {!hasAnyDirectMove && outcomeTriggered === 'none' && (
          <div className="w-full max-w-[355px] mt-1 bg-rose-600/95 border border-rose-200 rounded-xl px-2.5 py-1 text-center text-[10px] font-black text-white shadow animate-pop-in">
            Sığacak blok kalmadı! Döndür, Yenile veya Güçlendirici kullan!
          </div>
        )}

        {/* Sleek Block Blast 3-Piece Polyomino Tray + Hold Pocket */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className={`w-full max-w-[355px] mt-1.5 ${biome.hudCardClass} rounded-2xl p-1.5 grid grid-cols-[1fr_1fr_1fr_62px] gap-1.5 items-center select-none transition-colors duration-300`}
        >
          {tray.map((shape, idx) => {
            if (!shape) {
              return <div key={`empty_${idx}`} className="h-[58px] rounded-xl bg-black/15" />;
            }
            const fits = canShapeFitAnywhere(grid, shape);
            const isDragging = drag?.shapeIndex === idx;
            const { rows: sRows, cols: sCols } = getShapeBounds(shape);
            const maxDim = Math.max(sRows, sCols);
            const trayCellPx = maxDim >= 5 ? 8 : maxDim === 4 ? 10 : maxDim === 3 ? 12 : 14;
            return (
              <div
                key={shape.id}
                onPointerDown={(e) => startDrag(e, idx, shape)}
                className={`h-[58px] rounded-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none transition-transform relative ${
                  armHoldMode
                    ? 'ring-2 ring-amber-400 animate-pulse bg-amber-100/80'
                    : shape.specialCell || shape.isGoldBonus
                    ? 'bg-gradient-to-b from-[#fff3bf] to-[#f4ca64] border-2 border-[#d97706] shadow-[0_0_10px_rgba(251,191,36,0.45)]'
                    : `${biome.traySlotBgClass} border`
                } ${isDragging ? 'opacity-20 scale-90' : 'hover:scale-105'}`}
              >
                <BlockTrayPiece
                  shape={shape}
                  cellPx={trayCellPx}
                  disabled={!fits && !armHoldMode}
                  theme={progress.equippedBlockTheme}
                  biome={biome.id}
                />
                {shape.isGoldBonus && (
                  <span className="absolute top-0.5 right-1 text-[8px] font-black bg-orange-600 text-white px-1 rounded">
                    2×
                  </span>
                )}
              </div>
            );
          })}

          <HoldSlotBox
            heldShape={heldShape}
            armHoldMode={armHoldMode}
            isDraggingHeld={drag?.shapeIndex === -1}
            canFitHeld={Boolean(heldShape && canShapeFitAnywhere(grid, heldShape))}
            theme={progress.equippedBlockTheme}
            biome={biome.id}
            heightClass="h-[58px]"
            slotClass={biome.traySlotBgClass}
            onToggleArm={() => {
              sfx.click();
              setArmHoldMode((v) => !v);
            }}
            onStartDragHeld={(e, shape) => startDrag(e, -1, shape)}
          />
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
                className={`relative flex-1 h-[52px] rounded-2xl ${biome.panelClass} p-1 flex items-center justify-center transition-transform active:scale-95 ${
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
      </div>

      {/* Floating Snapped CubeTile Polyomino Piece */}
      {drag && (
        <FloatingDraggedPiece
          boardEl={boardRef.current}
          shape={drag.shape}
          pointerX={drag.pointerX}
          pointerY={drag.pointerY}
          pointerType={drag.pointerType}
          hoverR={drag.hoverR}
          hoverC={drag.hoverC}
          canDrop={drag.canDrop}
          theme={progress.equippedBlockTheme}
          biome={biome.id}
        />
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

      {/* Non-blocking Stage Intro Banner Overlay */}
      {showStageIntro && (
        <div className="pointer-events-none fixed inset-x-0 top-[29%] z-40 flex justify-center px-4">
          <div className="ribbon-banner-gold rounded-2xl px-4 py-2 text-center animate-stage-ribbon max-w-[300px]">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-display text-lg font-black text-[#471f04]">
                Seviye {level.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${biome.badgeClass}`}>
                {biome.name}
              </span>
            </div>
            <div className="text-[10px] font-black text-[#693506]">
              {level.subtitle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
