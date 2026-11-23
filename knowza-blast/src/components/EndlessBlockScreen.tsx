import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Calendar, Check, Crown, RotateCcw, RotateCw, Share2, Shuffle, Swords, Timer, Trophy } from 'lucide-react';
import { getBiomeForLevel } from '../data/biomes';
import { CubeColor, FloatingCallout, Grid, KnowzaMood, PlayerProgress, PolyominoShape } from '../types/game';
import {
  BLOCK_GRID_SIZE,
  canShapeFitAnywhere,
  createDailyChallengeBoard,
  createEmptyGrid,
  generateBlockTray,
  generateSeededBlockTray,
  hasAnyValidTrayMove,
  pickBonusCoords,
  placeShapeAndClearLines,
  previewLineClears,
  rotatePolyomino,
  strikeFeverLightning
} from '../utils/puzzleEngine';
import {
  buildBlastShareUrl,
  fetchBlastDuelRoom,
  submitBlastDuelScore
} from '../utils/blastApi';
import { computeBlockDropCell, getShapeBounds } from '../utils/blockDrag';
import { buildBlastVfx } from '../utils/boardVfx';
import { triggerHaptic } from '../utils/haptics';
import { sfx } from '../utils/sound';
import { BiomeSceneOverlay } from './BiomeSceneOverlay';
import { BiomeWorldBackground } from './BiomeWorldArt';
import { BlockTrayPiece } from './BlockTrayPiece';
import { BeamVfx, BoardVfxLayer, GhostVfx, RingVfx, ShardVfx } from './BoardVfxLayer';
import { CubeTile } from './CubeTile';
import { ActiveDuelSession } from './DuelLobbyModal';
import { FeverMeterControl } from './FeverMeterControl';
import { FloatingDraggedPiece } from './FloatingDraggedPiece';
import { HoldSlotBox } from './HoldSlotBox';
import { KnowzaSprite } from './KnowzaSprite';

interface EndlessBlockScreenProps {
  progress: PlayerProgress;
  mode?: 'endless' | 'sprint' | 'daily' | 'duel';
  duelSession?: ActiveDuelSession | null;
  onExit: () => void;
  onLineClearedDelta?: (lines: number) => void;
  onGameOverScore: (
    score: number,
    linesCleared: number,
    mode: 'endless' | 'sprint' | 'daily' | 'duel',
    extra?: { duelWon?: boolean }
  ) => void;
}

const ENDLESS_COLORS: CubeColor[] = ['blue', 'yellow', 'red', 'green', 'purple'];

const SCORE_TIERS = [
  { name: 'Çırak', min: 0, pillClass: 'bg-stone-600 text-white border-stone-300' },
  { name: 'Bronz', min: 250, pillClass: 'bg-amber-700 text-amber-50 border-amber-300' },
  { name: 'Gümüş', min: 600, pillClass: 'bg-slate-500 text-white border-slate-200' },
  { name: 'Altın', min: 1200, pillClass: 'bg-amber-500 text-[#471f04] border-yellow-200' },
  { name: 'Elmas', min: 2000, pillClass: 'bg-cyan-500 text-white border-cyan-200' },
  { name: 'Efsane', min: 3500, pillClass: 'bg-purple-600 text-white border-purple-200' }
];

function getEndlessRankInfo(score: number) {
  let idx = 0;
  for (let i = 0; i < SCORE_TIERS.length; i++) {
    if (score >= SCORE_TIERS[i].min) idx = i;
  }
  const current = SCORE_TIERS[idx];
  const next = SCORE_TIERS[idx + 1] || null;
  const pct = next
    ? Math.min(100, Math.round(((score - current.min) / (next.min - current.min)) * 100))
    : 100;
  return { current, next, pct };
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

export const EndlessBlockScreen: React.FC<EndlessBlockScreenProps> = ({
  progress,
  mode = 'endless',
  duelSession = null,
  onExit,
  onLineClearedDelta,
  onGameOverScore
}) => {
  const isSprint = mode === 'sprint';
  const isDaily = mode === 'daily';
  const isDuel = mode === 'duel';
  const isTimed = isSprint || isDuel;
  const dailyDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const dailyTurnRef = useRef(0);
  const [sharedDaily, setSharedDaily] = useState(false);

  const activeBiome = useMemo(() => getBiomeForLevel(progress.unlockedLevel), [progress.unlockedLevel]);
  const buildEndlessTray = (boardGrid: Grid, curScore: number, feverActive: boolean, turnIndex?: number) => {
    if (isDaily || isDuel) {
      const seedStr = isDuel ? duelSession?.seedKey || 'duel_match' : dailyDateStr;
      return generateSeededBlockTray(seedStr, turnIndex ?? dailyTurnRef.current, ENDLESS_COLORS, boardGrid, {
        allowAdvanced: true,
        forceSpecial: feverActive,
        specialChance: 0.16,
        guaranteeFit: curScore < 350
      });
    }
    return generateBlockTray(ENDLESS_COLORS, boardGrid, {
      allowAdvanced: true,
      forceSpecial: feverActive,
      specialChance: curScore >= 400 ? 0.08 : 0.14,
      hardMode: !isSprint && curScore >= 200,
      guaranteeFit: curScore < 350
    });
  };

  const initialDailyBoard = useMemo(
    () => (isDaily ? createDailyChallengeBoard(dailyDateStr, ENDLESS_COLORS) : createEmptyGrid(BLOCK_GRID_SIZE)),
    [isDaily, dailyDateStr]
  );

  const [grid, setGrid] = useState<Grid>(() => initialDailyBoard);
  const [bonusCoords, setBonusCoords] = useState<Set<string>>(() => pickBonusCoords(initialDailyBoard, 2));
  const [heldShape, setHeldShape] = useState<PolyominoShape | null>(null);
  const [armHoldMode, setArmHoldMode] = useState(false);
  const [tray, setTray] = useState<(PolyominoShape | null)[]>(() => buildEndlessTray(initialDailyBoard, 0, false, 0));
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentName, setOpponentName] = useState(duelSession?.opponentName || 'Usta Knowza');
  const rankInfo = useMemo(() => getEndlessRankInfo(score), [score]);
  const [combo, setCombo] = useState(0);
  const [linesTotal, setLinesTotal] = useState(0);
  const [feverPct, setFeverPct] = useState(0);
  const [feverTurns, setFeverTurns] = useState(0);
  const [rotateCharges, setRotateCharges] = useState(1);
  const [rerollCharges, setRerollCharges] = useState(1);
  const [timeLeft, setTimeLeft] = useState(isDuel ? 60 : 90);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'space' | 'time'>('space');
  const [drag, setDrag] = useState<DragState | null>(null);
  const [callouts, setCallouts] = useState<FloatingCallout[]>([]);
  const [ghosts, setGhosts] = useState<GhostVfx[]>([]);
  const [shards, setShards] = useState<ShardVfx[]>([]);
  const [rocketBeams, setRocketBeams] = useState<BeamVfx[]>([]);
  const [bombRings, setBombRings] = useState<RingVfx[]>([]);
  const [clearedFlash, setClearedFlash] = useState<{ rows: number[]; cols: number[] }>({ rows: [], cols: [] });
  const [boardShaking, setBoardShaking] = useState(false);
  const [mascotReaction, setMascotReaction] = useState<'none' | 'happy' | 'combo'>('none');
  const [recentlyPlaced, setRecentlyPlaced] = useState<Set<string>>(new Set());

  const boardRef = useRef<HTMLDivElement | null>(null);

  const endlessMood: KnowzaMood = gameOver
    ? gameOverReason === 'time'
      ? 'celebrate'
      : 'sad'
    : feverTurns > 0
    ? 'fever'
    : mascotReaction === 'combo'
    ? 'combo'
    : mascotReaction === 'happy'
    ? 'happy'
    : drag
    ? 'drag'
    : 'idle';

  const triggerReaction = (r: 'happy' | 'combo') => {
    setMascotReaction(r);
    setTimeout(() => setMascotReaction('none'), 1200);
  };

  const pushCallout = (
    text: string,
    subtext?: string,
    variant: FloatingCallout['variant'] = 'clear'
  ) => {
    const id = `eb_${Date.now()}_${Math.random()}`;
    setCallouts((prev) => [...prev.slice(-2), { id, text, subtext, colorClass: 'text-[#ffe659]', variant }]);
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

    setGhosts((prev) => [...prev.slice(-50), ...ghostList]);
    setShards((prev) => [...prev.slice(-100), ...shardList]);
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
  };

  // Countdown timer for Sprint (90s) and 1v1 Duel (60s)
  useEffect(() => {
    if (!isTimed || gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameOverReason('time');
          setGameOver(true);
          sfx.win();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimed, gameOver]);

  // 1v1 Duel Bot AI & Live Server Room Opponent Sync
  useEffect(() => {
    if (!isDuel || gameOver) return;
    if (duelSession?.kind === 'room' && duelSession.roomCode && duelSession.role) {
      const code = duelSession.roomCode;
      const myRole = duelSession.role;
      const syncTimer = setInterval(async () => {
        await submitBlastDuelScore(code, myRole, score, false);
        const room = await fetchBlastDuelRoom(code);
        if (!room) return;
        const opp = myRole === 'host' ? room.guest : room.host;
        if (opp) {
          setOpponentScore(opp.score || 0);
          if (opp.name) setOpponentName(opp.name);
        }
      }, 1800);
      return () => clearInterval(syncTimer);
    }

    // Responsive Smart Bot opponent in solo Quick Match
    const botTimer = setInterval(() => {
      setOpponentScore((prev) => {
        const diff = score - prev;
        const burst = diff > 250 ? 45 + Math.floor(Math.random() * 90) : 25 + Math.floor(Math.random() * 65);
        return prev + burst;
      });
    }, 2300);
    return () => clearInterval(botTimer);
  }, [isDuel, duelSession, score, gameOver]);

  const prevReportedRef = useRef(false);
  useEffect(() => {
    if (gameOver && !prevReportedRef.current) {
      prevReportedRef.current = true;
      const duelWon = isDuel ? score >= opponentScore : undefined;
      if (isDuel && duelWon) {
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.55 } });
      }
      if (isDuel && duelSession?.kind === 'room' && duelSession.roomCode && duelSession.role) {
        submitBlastDuelScore(duelSession.roomCode, duelSession.role, score, true);
      }
      onGameOverScore(score, linesTotal, mode, isDuel ? { duelWon } : undefined);
    }
    if (!gameOver) {
      prevReportedRef.current = false;
    }
  }, [gameOver, score, opponentScore, linesTotal, mode, isDuel, duelSession, onGameOverScore]);

  const hasDirectFit = useMemo(
    () =>
      hasAnyValidTrayMove(grid, tray) ||
      Boolean(heldShape && canShapeFitAnywhere(grid, heldShape)),
    [grid, tray, heldShape]
  );
  const canRotateFit = useMemo(() => {
    if (rotateCharges <= 0) return false;
    const r1 = tray.map((s) => (s ? rotatePolyomino(s) : null));
    if (hasAnyValidTrayMove(grid, r1)) return true;
    const r2 = r1.map((s) => (s ? rotatePolyomino(s) : null));
    if (hasAnyValidTrayMove(grid, r2)) return true;
    const r3 = r2.map((s) => (s ? rotatePolyomino(s) : null));
    return hasAnyValidTrayMove(grid, r3);
  }, [grid, tray, rotateCharges]);

  // Strict Block Blast deadlock check (also accounts for Hold Pocket rescue!)
  useEffect(() => {
    if (gameOver) return;
    const activeShapes = tray.filter((s): s is PolyominoShape => s !== null);
    const canHoldRescue = !heldShape && activeShapes.length > 0;
    if (activeShapes.length > 0 && !hasDirectFit && !canRotateFit && rerollCharges <= 0 && !canHoldRescue) {
      setGameOverReason('space');
      setGameOver(true);
      sfx.fail();
    }
  }, [tray, heldShape, gameOver, hasDirectFit, canRotateFit, rerollCharges]);

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
        const basePts = drag.shape.cells.length * 10 * scoreMult;
        let finalGrid = res.grid;
        let nextFeverActiveForTray = isFeverActive;
        const prevRank = getEndlessRankInfo(score).current.name;

        if (res.linesCleared > 0) {
          const nextCombo = combo + 1;
          const isCross = res.clearedRows.length > 0 && res.clearedCols.length > 0;
          const crossMult = isCross ? 2 : 1;
          const specialBonus = res.specialsTriggered * 150 + (res.superFusionTriggered ? 300 : 0);
          const bonus = (res.linesCleared * 100 * nextCombo * crossMult + specialBonus) * scoreMult;
          const newTotalScore = score + basePts + bonus;
          const nextRank = getEndlessRankInfo(newTotalScore).current.name;
          setCombo(nextCombo);
          setLinesTotal((l) => l + res.linesCleared);
          onLineClearedDelta?.(res.linesCleared);
          setScore(newTotalScore);

          if (isSprint) {
            const secGain = res.linesCleared * 4 + (isCross ? 4 : 0);
            setTimeLeft((t) => Math.min(120, t + secGain));
          }

          if (res.superFusionTriggered || res.specialsTriggered > 0) sfx.disco();
          else sfx.lineClear(res.linesCleared);
          if (nextRank !== prevRank) {
            setTimeout(() => sfx.reward(), 120);
          }
          triggerHaptic(progress.hapticsEnabled, [18, 24, 30]);
          setBoardShaking(true);
          setTimeout(() => setBoardShaking(false), 300);
          setClearedFlash({ rows: res.clearedRows, cols: res.clearedCols });
          setTimeout(() => setClearedFlash({ rows: [], cols: [] }), 340);

          const preClearGrid = grid.map((r) => [...r]);
          drag.shape.cells.forEach(([dr, dc]) => {
            preClearGrid[drag.hoverR! + dr][drag.hoverC! + dc] = {
              uid: 'tmp',
              color: drag.shape.color
            };
          });
          spawnVfx(res.blastedCoords, preClearGrid, res.rocketBeams, res.bombRings);

          let triggeredFeverNow = false;
          if (feverTurns > 0) {
            const left = Math.max(0, feverTurns - 1);
            setFeverTurns(left);
            nextFeverActiveForTray = left > 0;
          } else {
            const gain = res.linesCleared * 28 + (isCross ? 25 : 0);
            const nextPct = feverPct + gain;
            if (nextPct >= 100) {
              triggeredFeverNow = true;
              nextFeverActiveForTray = true;
              setFeverPct(0);
              setFeverTurns(3);
              sfx.fever();
              const lightning = strikeFeverLightning(finalGrid, 3);
              if (lightning.blastedCoords.length > 0) {
                spawnVfx(lightning.blastedCoords, finalGrid);
                finalGrid = lightning.grid;
              }
            } else {
              setFeverPct(nextPct);
            }
          }

          pushCallout(
            triggeredFeverNow
              ? 'KNOWZA ATEŞİ 2×!'
              : res.superFusionTriggered
              ? 'SÜPER BİRLEŞİM!'
              : hitBonusSquare
              ? '2× ALTIN KARE!'
              : isCross
              ? 'ÇAPRAZ PATLAMA!'
              : res.linesCleared > 1
              ? `${res.linesCleared}x SATIR!`
              : 'BLOK TEMİZLİĞİ!',
            res.superFusionTriggered
              ? `3× Lazer! +${bonus}`
              : hitBonusSquare
              ? `2× Bonus! +${bonus}`
              : isSprint
              ? `+${bonus} • +${res.linesCleared * 4}sn`
              : nextCombo > 1
              ? `${nextCombo}x Seri! +${bonus}`
              : `+${bonus}`,
            triggeredFeverNow
              ? 'fever'
              : res.superFusionTriggered || res.specialsTriggered > 0
              ? 'chain'
              : isCross
              ? 'cross'
              : res.linesCleared > 1 || nextCombo > 1 || hitBonusSquare
              ? 'combo'
              : 'clear'
          );
          triggerReaction(
            res.linesCleared >= 2 || nextCombo >= 2 || triggeredFeverNow || res.superFusionTriggered
              ? 'combo'
              : 'happy'
          );
          setBonusCoords(pickBonusCoords(finalGrid, 2));
        } else {
          setCombo(0);
          const goldPts = hitBonusSquare ? 80 : 0;
          setScore((s) => s + basePts + goldPts);
          if (hitBonusSquare) {
            pushCallout('ALTIN KARE!', '+80 Bonus Puan!', 'combo');
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

        const nextScoreSnapshot = score + basePts + (res.linesCleared > 0 ? res.linesCleared * 100 : 0);
        setGrid(finalGrid);
        if (drag.shapeIndex === -1) {
          setHeldShape(null);
        } else {
          setTray((prevTray) => {
            const nextTray = prevTray.map((it, idx) => (idx === drag.shapeIndex ? null : it));
            if (nextTray.every((it) => it === null)) {
              dailyTurnRef.current += 1;
              return buildEndlessTray(finalGrid, nextScoreSnapshot, nextFeverActiveForTray, dailyTurnRef.current);
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

  const startDrag = (e: React.PointerEvent, idx: number, shape: PolyominoShape) => {
    if (gameOver) return;
    e.preventDefault();
    if (armHoldMode && idx >= 0 && !heldShape) {
      sfx.rotate();
      setHeldShape(shape);
      setArmHoldMode(false);
      setTray((prevTray) => {
        const nextTray = prevTray.map((it, i) => (i === idx ? null : it));
        if (nextTray.every((it) => it === null)) {
          dailyTurnRef.current += 1;
          return buildEndlessTray(grid, score, feverTurns > 0, dailyTurnRef.current);
        }
        return nextTray;
      });
      pushCallout('YEDEK ALINDI!', 'İstediğin tur sürükle!', 'clear');
      return;
    }
    sfx.click();
    triggerHaptic(progress.hapticsEnabled, 8);
    const pos = computeDropCell(e.clientX, e.clientY, e.pointerType, shape);
    setDrag({
      shapeIndex: idx,
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

  const handleRotateTray = () => {
    if (gameOver || rotateCharges <= 0) return;
    sfx.rotate();
    triggerHaptic(progress.hapticsEnabled, 10);
    setRotateCharges((c) => c - 1);
    setTray((prev) => prev.map((s) => (s ? rotatePolyomino(s) : null)));
  };

  const handleRerollTray = () => {
    if (gameOver || rerollCharges <= 0) return;
    sfx.reward();
    triggerHaptic(progress.hapticsEnabled, 14);
    setRerollCharges((c) => c - 1);
    dailyTurnRef.current += 1;
    setTray(buildEndlessTray(grid, score, feverTurns > 0, dailyTurnRef.current));
  };

  const restart = () => {
    sfx.click();
    dailyTurnRef.current = 0;
    const freshBoard = isDaily
      ? createDailyChallengeBoard(dailyDateStr, ENDLESS_COLORS)
      : createEmptyGrid(BLOCK_GRID_SIZE);
    setGrid(freshBoard);
    setBonusCoords(pickBonusCoords(freshBoard, 2));
    setHeldShape(null);
    setArmHoldMode(false);
    setTray(buildEndlessTray(freshBoard, 0, false, 0));
    setScore(0);
    setOpponentScore(0);
    setCombo(0);
    setLinesTotal(0);
    setFeverPct(0);
    setFeverTurns(0);
    setRotateCharges(1);
    setRerollCharges(1);
    setTimeLeft(isDuel ? 60 : 90);
    setSharedDaily(false);
    setGameOver(false);
  };

  const bestScore = Math.max(
    isDaily
      ? progress.dailyChallengeBest || 0
      : isSprint
      ? progress.highSprintScore || 0
      : progress.highBlockScore,
    score
  );

  const handleShareDailyCard = async () => {
    sfx.click();
    const filledSquares = Math.min(8, Math.max(1, Math.round(score / 220)));
    const gridRow = Array.from({ length: 8 }, (_, idx) => (idx < filledSquares ? '■' : '□')).join('');
    const shareUrl = buildBlastShareUrl(progress.inviteCode ? { ref: progress.inviteCode } : {});
    const summaryText = [
      `Knowza Blast — Günün Bulmacası (${dailyDateStr})`,
      `Skor: ${score} (${rankInfo.current.name}) • ${linesTotal} Satır`,
      `[${gridRow}]`,
      `Aynı tahtada yarış: ${shareUrl}`
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Knowza Blast — Günün Bulmacası', text: summaryText, url: shareUrl });
        setSharedDaily(true);
        setTimeout(() => setSharedDaily(false), 2500);
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Ignore restricted clipboard
    }
    setSharedDaily(true);
    setTimeout(() => setSharedDaily(false), 2500);
  };

  return (
    <div
      className={`relative flex-1 w-full h-full overflow-hidden flex flex-col items-center justify-between ${
        dragActive ? 'touch-none select-none' : ''
      }`}
    >
      <BiomeWorldBackground biome={activeBiome} variant="gameplay" />
      <BiomeSceneOverlay biomeId={activeBiome.id} variant="gameplay" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-20 w-full max-w-[430px] px-3 pt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onExit();
          }}
          className="gold-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center">
          {isDuel ? (
            <div className="parchment-card rounded-2xl px-2.5 py-1 flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between gap-1 text-[10px] font-black">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-emerald-800 shrink-0">Sen</span>
                  <span className="font-display text-sm font-black text-emerald-950 tabular-nums leading-none">
                    {score}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${
                    timeLeft <= 12
                      ? 'bg-rose-600 text-white border-rose-200 animate-pulse'
                      : 'bg-amber-400 text-[#471f04] border-amber-700'
                  }`}
                >
                  <Swords className="w-3 h-3" />
                  {timeLeft}sn
                </span>
                <div className="flex items-center gap-1 min-w-0 justify-end">
                  <span className="text-rose-800 truncate max-w-[54px]" title={opponentName}>
                    {opponentName}
                  </span>
                  <span className="font-display text-sm font-black text-rose-950 tabular-nums shrink-0 leading-none">
                    {opponentScore}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-rose-400 overflow-hidden border border-[#78350f]/50">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${
                      score + opponentScore === 0
                        ? 50
                        : Math.max(10, Math.min(90, Math.round((score / (score + opponentScore)) * 100)))
                    }%`
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="parchment-card rounded-2xl px-3.5 py-1 text-center min-w-[88px]">
                <div className="text-[10px] font-black text-[#7a4518] uppercase">Skor</div>
                <div className="font-display text-2xl font-black text-[#3b1b04] leading-none tabular-nums">
                  {score}
                </div>
              </div>

              {isSprint ? (
                <div
                  className={`parchment-card rounded-2xl px-3 py-1 text-center flex items-center gap-1.5 ${
                    timeLeft <= 15 ? 'ring-2 ring-rose-500 animate-pulse' : ''
                  }`}
                >
                  <Timer className={`w-5 h-5 ${timeLeft <= 15 ? 'text-rose-600' : 'text-amber-600'}`} />
                  <div>
                    <div className="text-[10px] font-black text-[#7a4518] uppercase">Süre</div>
                    <div
                      className={`font-display text-lg font-black leading-none tabular-nums ${
                        timeLeft <= 15 ? 'text-rose-600' : 'text-[#3b1b04]'
                      }`}
                    >
                      {timeLeft}sn
                    </div>
                  </div>
                </div>
              ) : (
                <div className="parchment-card rounded-2xl px-3.5 py-1 text-center flex items-center gap-1.5">
                  <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <div>
                    <div className="text-[10px] font-black text-[#7a4518] uppercase">Rekor</div>
                    <div className="font-display text-lg font-black text-[#3b1b04] leading-none tabular-nums">
                      {bestScore}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={restart}
          className="brown-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          title="Yeniden Başla"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Mascot Tip Banner */}
      <div className="relative z-20 flex items-center gap-2 px-3 mt-1">
        <button
          type="button"
          onClick={() => {
            sfx.pop(4, 2);
            triggerReaction('combo');
          }}
          className="w-12 h-11 shrink-0 active:scale-95 transition-transform focus:outline-none"
          title="Knowza"
        >
          <KnowzaSprite
            pose="flag"
            outfit={progress.equippedOutfit}
            accessory={progress.equippedAccessory}
            mood={endlessMood}
            className="w-full h-full object-contain drop-shadow"
          />
        </button>
        <div className="parchment-subcard rounded-2xl px-3 py-1 text-[11px] font-extrabold text-[#4d2607]">
          {isDuel ? (
            <span className="inline-flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              1v1 Düello • Rakiple aynı bloklar! 60 sn en çok puanı topla!
            </span>
          ) : isDaily ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              Günün Ortak Bulmacası ({dailyDateStr}) • Dünya ile aynı tahta!
            </span>
          ) : isSprint ? (
            `90sn Yıldırım Sprint! Her satır temizliği +4sn • Rekor: ${bestScore}`
          ) : !hasDirectFit && !gameOver ? (
            'Yer kalmadı! Döndür veya Yenile kullan, yoksa tur biter!'
          ) : combo >= 2 ? (
            `Müthiş! ${combo}x Seri! Satırları aynı anda kapatıp skoru katla!`
          ) : (
            'Blokları sürükleyip 8×8 tahtaya diz, satır/sütun doldurarak patlat!'
          )}
        </div>
      </div>

      {/* Live Rank Tier Ladder */}
      <div className="relative z-20 w-full max-w-[400px] px-3 mt-1">
        <div className="bg-black/35 backdrop-blur-sm border border-white/20 rounded-xl px-2.5 py-1 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black border shrink-0 ${rankInfo.current.pillClass}`}>
            <Crown className="w-2.5 h-2.5" />
            {rankInfo.current.name}
          </span>
          <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/15">
            <div
              className="h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${rankInfo.pct}%` }}
            />
          </div>
          <span className="text-[9.5px] font-black text-amber-100 tabular-nums shrink-0">
            {rankInfo.next ? `${rankInfo.next.name} (${rankInfo.next.min})` : 'Maks Rütbe!'}
          </span>
        </div>
      </div>

      {/* 8x8 Board */}
      <div className="relative z-20 w-full max-w-[400px] px-3 flex items-center justify-center my-auto">
        <div
          className={`${activeBiome.boardFrameClass} rounded-[22px] p-2.5 w-full aspect-square relative transition-shadow ${
            boardShaking ? 'animate-board-shake' : ''
          } ${
            feverTurns > 0
              ? 'ring-2 ring-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.8)]'
              : isSprint && timeLeft <= 15
              ? 'ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.65)]'
              : ''
          }`}
        >
          <div
            ref={boardRef}
            style={{ backgroundColor: activeBiome.boardInnerColor }}
            className="w-full h-full rounded-[14px] relative shadow-inner overflow-hidden"
          >
            {/* Slot layer */}
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
                    <div key={`slot_${key}`} className="p-[1.5px]">
                      <div
                        className={`w-full h-full rounded-[8px] transition-colors flex items-center justify-center relative ${
                          isLineHighlight
                            ? 'bg-amber-300/45 ring-2 ring-amber-200'
                            : isInvalidGhost
                            ? 'bg-rose-500/45 ring-2 ring-rose-300'
                            : !cell && isGhost
                            ? 'bg-white/25 ring-2 ring-white/90'
                            : isBonusTile
                            ? 'bg-amber-400/20 ring-1 ring-amber-300/90 shadow-[inset_0_0_8px_rgba(251,191,36,0.45)]'
                            : 'bg-[#381b05]/60'
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

            {/* Animated flat uid-sorted tile layer */}
            <div className="absolute inset-0 p-0.5">
              {grid
                .flatMap((row, r) => row.map((cell, c) => ({ cell, r, c })))
                .filter((t) => t.cell !== null)
                .sort((x, y) => (x.cell!.uid < y.cell!.uid ? -1 : x.cell!.uid > y.cell!.uid ? 1 : 0))
                .map(({ cell, r, c }) => {
                  if (!cell) return null;
                  const key = `${r},${c}`;
                  const isLineHit =
                    dragPreview.lines.rows.includes(r) || dragPreview.lines.cols.includes(c);
                  const isLanded = recentlyPlaced.has(key);
                  return (
                    <div
                      key={cell.uid}
                      className={`absolute p-[1.5px] ${isLanded ? 'animate-cube-land' : ''}`}
                      style={{
                        left: `${(c / BLOCK_GRID_SIZE) * 100}%`,
                        top: `${(r / BLOCK_GRID_SIZE) * 100}%`,
                        width: `${100 / BLOCK_GRID_SIZE}%`,
                        height: `${100 / BLOCK_GRID_SIZE}%`,
                        transition: 'top 0.34s cubic-bezier(0.34, 1.38, 0.64, 1), left 0.2s ease-out',
                        zIndex: isLineHit ? 12 : 5
                      }}
                    >
                      <CubeTile
                        cell={cell}
                        theme={progress.equippedBlockTheme}
                        highlighted={isLineHit}
                      />
                    </div>
                  );
                })}
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
        </div>
      </div>

      {/* Interactive Fever Meter + Tactical Rotate / Reroll Controls + 3-Piece Tray */}
      <div className="relative z-30 w-full max-w-[430px] px-3 pb-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <FeverMeterControl feverPct={feverPct} feverTurns={feverTurns} />

          <button
            type="button"
            disabled={rotateCharges <= 0}
            onClick={handleRotateTray}
            className={`brown-btn rounded-full px-2.5 py-1 flex items-center gap-1 text-[10.5px] font-black shrink-0 disabled:opacity-40 ${
              !hasDirectFit && rotateCharges > 0 ? 'ring-2 ring-yellow-300 animate-pulse' : ''
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
              !hasDirectFit && rerollCharges > 0 ? 'ring-2 ring-emerald-300 animate-pulse' : ''
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Yenile ({rerollCharges})</span>
          </button>
        </div>

        {!hasDirectFit && !gameOver && (
          <div className="bg-rose-600/95 border border-rose-200 rounded-xl px-2.5 py-1 flex items-center justify-between gap-2 text-[10.5px] font-black text-white shadow animate-pop-in">
            <span>Sığacak blok kalmadı! ({canRotateFit ? 'Döndür' : 'Yenile'})</span>
            <button
              type="button"
              onClick={() => {
                setGameOverReason('space');
                setGameOver(true);
                sfx.fail();
              }}
              className="bg-white text-rose-700 px-2 py-0.5 rounded-full text-[9.5px] font-black shrink-0"
            >
              Turu Bitir
            </button>
          </div>
        )}

        {armHoldMode && !heldShape && !gameOver && (
          <div className="bg-amber-500/95 border border-yellow-200 rounded-xl px-2.5 py-1 text-center text-[10.5px] font-black text-[#471f04] shadow animate-pop-in">
            Yedeklemek istediğin parçaya dokun! (Tekrar Yedek’e basarak iptal edebilirsin)
          </div>
        )}

        <div
          onContextMenu={(e) => e.preventDefault()}
          className={`${activeBiome.panelClass} rounded-2xl p-2 grid grid-cols-[1fr_1fr_1fr_64px] gap-1.5 items-center select-none transition-colors`}
        >
          {tray.map((shape, idx) => {
            if (!shape) {
              return <div key={`eb_empty_${idx}`} className="h-[72px] rounded-xl bg-black/25" />;
            }
            const fits = canShapeFitAnywhere(grid, shape);
            const isDragging = drag?.shapeIndex === idx;
            const { rows: sRows, cols: sCols } = getShapeBounds(shape);
            const maxDim = Math.max(sRows, sCols);
            const trayCellPx = maxDim >= 5 ? 8 : maxDim === 4 ? 10 : 13;
            return (
              <div
                key={shape.id}
                onPointerDown={(e) => startDrag(e, idx, shape)}
                className={`h-[72px] rounded-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none relative ${
                  armHoldMode
                    ? 'ring-2 ring-yellow-300 animate-pulse bg-amber-100/80'
                    : shape.specialCell || shape.isGoldBonus
                    ? 'bg-[#66360e] border-2 border-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : activeBiome.traySlotBgClass
                } ${isDragging ? 'opacity-20 scale-90' : 'hover:scale-105'}`}
              >
                <BlockTrayPiece
                  shape={shape}
                  cellPx={trayCellPx}
                  disabled={!fits && !armHoldMode}
                  theme={progress.equippedBlockTheme}
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
            heightClass="h-[72px]"
            slotClass={activeBiome.traySlotBgClass}
            onToggleArm={() => {
              sfx.click();
              setArmHoldMode((v) => !v);
            }}
            onStartDragHeld={(e, shape) => startDrag(e, -1, shape)}
          />
        </div>
      </div>

      {/* Floating Snapped CubeTile Drag Piece */}
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
        />
      )}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="parchment-card rounded-3xl p-6 max-w-xs w-full text-center relative animate-pop-in mt-10">
            <div className="w-32 h-24 mx-auto -mt-16 mb-1 drop-shadow-lg">
              <KnowzaSprite
                pose="peek"
                outfit={progress.equippedOutfit}
                accessory={progress.equippedAccessory}
                mood={gameOverReason === 'time' ? 'celebrate' : 'sad'}
                className="w-full h-full"
              />
            </div>
            <h2 className="font-display text-2xl font-black text-[#471f04] mt-1">
              {isDuel
                ? score > opponentScore
                  ? 'Düelloyu Kazandın!'
                  : score === opponentScore
                  ? 'Berabere!'
                  : 'Kıl Payı Kaçırdın!'
                : gameOverReason === 'time'
                ? 'Süre Doldu!'
                : 'Yer Kalmadı!'}
            </h2>
            <p className="text-sm font-bold text-[#7c4617] mt-1">
              {isDuel
                ? `Sen ${score} – ${opponentScore} ${opponentName}`
                : isSprint
                ? `Harika sprint! Skorun ve ${linesTotal} satır ödüllere dönüştü.`
                : 'Harika oynadın! Skorun ödüllere dönüştü.'}
            </p>

            <div className="parchment-subcard rounded-2xl p-3 my-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] font-black text-amber-800">Skor • {rankInfo.current.name}</div>
                <div className="font-display text-xl font-black text-[#3b1903]">{score}</div>
              </div>
              <div className="border-x border-amber-300 px-1">
                <div className="text-[10px] font-black text-amber-800">Altın</div>
                <div className="font-display text-xl font-black text-amber-600">
                  +
                  {isDuel
                    ? score >= opponentScore
                      ? 250
                      : 60
                    : Math.max(15, Math.floor(score / 25))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-amber-800">Yıldız</div>
                <div className="font-display text-xl font-black text-yellow-600">
                  +
                  {isDuel
                    ? score >= opponentScore
                      ? 25
                      : 5
                    : Math.max(5, Math.floor(score / 80))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {isDaily && (
                <button
                  type="button"
                  onClick={handleShareDailyCard}
                  className="green-btn py-2.5 rounded-2xl font-display text-sm font-black flex items-center justify-center gap-1.5 shadow"
                >
                  {sharedDaily ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4" />}
                  <span>{sharedDaily ? 'Skor Kartı Kopyalandı!' : 'Günün Skorunu Paylaş'}</span>
                </button>
              )}
              <button type="button" onClick={restart} className="gold-btn py-3 rounded-2xl font-display text-lg font-bold">
                Tekrar Oyna
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onExit();
                }}
                className="brown-btn py-2.5 rounded-2xl font-bold text-sm"
              >
                Bilgi Dünyası'na Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
