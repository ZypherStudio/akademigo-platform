import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { CubeColor, FloatingCallout, Grid, PlayerProgress, PolyominoShape } from '../types/game';
import {
  BLOCK_GRID_SIZE,
  canShapeFitAnywhere,
  createEmptyGrid,
  executeTapBlast,
  findAllClusters,
  findCluster,
  generateBlockTray,
  getClusterHintMap,
  placeShapeAndClearLines,
  previewLineClears
} from '../utils/puzzleEngine';
import { assetUrl } from '../utils/assets';
import { TOUCH_LIFT_PX, computeBlockDropCell, getBoardCellPx, getShapeBounds } from '../utils/blockDrag';
import { triggerHaptic } from '../utils/haptics';
import { sfx } from '../utils/sound';
import { BlockTrayPiece } from './BlockTrayPiece';
import { CUBE_PALETTE, CubeTile } from './CubeTile';
import { KnowzaSprite } from './KnowzaSprite';

interface EndlessBlockScreenProps {
  progress: PlayerProgress;
  onExit: () => void;
  onGameOverScore: (score: number, linesCleared: number) => void;
}

const ENDLESS_COLORS: CubeColor[] = ['blue', 'yellow', 'red', 'green', 'purple'];

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
  onExit,
  onGameOverScore
}) => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(BLOCK_GRID_SIZE));
  const [tray, setTray] = useState<(PolyominoShape | null)[]>(() => generateBlockTray(ENDLESS_COLORS));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [linesTotal, setLinesTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<Set<string>>(new Set());
  const [callouts, setCallouts] = useState<FloatingCallout[]>([]);
  const [ghosts, setGhosts] = useState<{ id: string; r: number; c: number; color: CubeColor | null }[]>([]);
  const [shards, setShards] = useState<
    { id: string; r: number; c: number; color: string; dx: number; dy: number; rot: number; size: number }[]
  >([]);
  const [clearedFlash, setClearedFlash] = useState<{ rows: number[]; cols: number[] }>({ rows: [], cols: [] });
  const [boardShaking, setBoardShaking] = useState(false);
  const [recentlyPlaced, setRecentlyPlaced] = useState<Set<string>>(new Set());

  const boardRef = useRef<HTMLDivElement | null>(null);

  const hintMap = useMemo(() => getClusterHintMap(grid), [grid]);

  const pushCallout = (text: string, subtext?: string) => {
    const id = `eb_${Date.now()}_${Math.random()}`;
    setCallouts((prev) => [...prev.slice(-2), { id, text, subtext, colorClass: 'text-[#ffe659]' }]);
    setTimeout(() => setCallouts((prev) => prev.filter((c) => c.id !== id)), 1050);
  };

  const spawnVfx = (coords: [number, number][], sourceGrid: Grid) => {
    const stamp = `${Date.now()}_${Math.random()}`;
    const ghostList = coords.slice(0, 48).map(([r, c], idx) => ({
      id: `eg_${stamp}_${idx}`,
      r,
      c,
      color: (sourceGrid[r]?.[c]?.color ?? null) as CubeColor | null
    }));

    const boardPx = boardRef.current?.getBoundingClientRect().width ?? 340;
    const cellPx = boardPx / BLOCK_GRID_SIZE;
    const shardList: typeof shards = [];
    coords.slice(0, 28).forEach(([r, c], idx) => {
      const col = sourceGrid[r]?.[c]?.color;
      const hex = col ? CUBE_PALETTE[col].particle : '#fde68a';
      for (let k = 0; k < 3; k++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = cellPx * (0.65 + Math.random() * 1.1);
        shardList.push({
          id: `es_${stamp}_${idx}_${k}`,
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

    setGhosts((prev) => [...prev.slice(-50), ...ghostList]);
    setShards((prev) => [...prev.slice(-100), ...shardList]);
    setTimeout(() => {
      const gids = new Set(ghostList.map((g) => g.id));
      setGhosts((prev) => prev.filter((g) => !gids.has(g.id)));
    }, 300);
    setTimeout(() => {
      const sids = new Set(shardList.map((x) => x.id));
      setShards((prev) => prev.filter((x) => !sids.has(x.id)));
    }, 560);
  };

  // Detect game over only if neither any tray piece fits NOR any 3+ Toon Blast cluster / special exists
  useEffect(() => {
    if (gameOver) return;
    const activeShapes = tray.filter((s): s is PolyominoShape => s !== null);
    const anyPieceFits = activeShapes.some((s) => canShapeFitAnywhere(grid, s));
    const anyToonCluster = findAllClusters(grid).some((cl) => cl.length >= 3);
    const anySpecial = grid.some((row) => row.some((c) => Boolean(c?.special)));
    if (activeShapes.length > 0 && !anyPieceFits && !anyToonCluster && !anySpecial) {
      setGameOver(true);
      sfx.fail();
      onGameOverScore(score, linesTotal);
    }
  }, [grid, tray, gameOver, score, linesTotal, onGameOverScore]);

  // Tap 3+ matching cubes or specials in Blok & Patlat hybrid mode!
  const handleCellTap = (r: number, c: number) => {
    if (gameOver) return;
    const cell = grid[r]?.[c];
    if (!cell) return;
    if (!cell.special) {
      const cluster = findCluster(grid, r, c);
      if (cluster.length < 3) return;
    }
    const outcome = executeTapBlast(grid, r, c);
    if (!outcome) return;

    spawnVfx(outcome.blastedCoords, grid);
    const pts = outcome.cubesPopped * 18;
    setScore((s) => s + pts);
    setGrid(outcome.grid);

    if (outcome.soundType === 'disco') {
      sfx.disco();
      setBoardShaking(true);
      setTimeout(() => setBoardShaking(false), 300);
    } else if (outcome.soundType === 'bomb') {
      sfx.bomb();
      setBoardShaking(true);
      setTimeout(() => setBoardShaking(false), 300);
    } else if (outcome.soundType === 'rocket') {
      sfx.rocket();
    } else {
      sfx.pop(outcome.cubesPopped, 2);
    }
    pushCallout(outcome.comboLabel || 'KÜP PATLAMASI!', `+${pts}`);
  };

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
            const nextCombo = combo + 1;
            const bonus = res.linesCleared * 100 * nextCombo;
            setCombo(nextCombo);
            setLinesTotal((l) => l + res.linesCleared);
            setScore((s) => s + basePts + bonus);
            sfx.lineClear(res.linesCleared);
            triggerHaptic(progress.hapticsEnabled, [18, 24, 30]);
            setBoardShaking(true);
            setTimeout(() => setBoardShaking(false), 300);
            setClearedFlash({ rows: res.clearedRows, cols: res.clearedCols });
            setTimeout(() => setClearedFlash({ rows: [], cols: [] }), 340);
            spawnVfx(res.blastedCoords, grid);
            pushCallout(
              res.linesCleared > 1 ? `${res.linesCleared}x SATIR!` : 'BLOK TEMİZLİĞİ!',
              nextCombo > 1 ? `${nextCombo}x Seri! +${bonus}` : `+${bonus}`
            );
          } else {
            setCombo(0);
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
            const nextTray = prevTray.map((it, idx) => (idx === drag.shapeIndex ? null : it));
            if (nextTray.every((it) => it === null)) {
              return generateBlockTray(ENDLESS_COLORS);
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
  }, [drag, grid, combo]);

  const startDrag = (e: React.PointerEvent, idx: number, shape: PolyominoShape) => {
    if (gameOver) return;
    e.preventDefault();
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
    if (!drag || !drag.canDrop || drag.hoverR === null || drag.hoverC === null) {
      return { cells: new Set<string>(), lines: { rows: [] as number[], cols: [] as number[] } };
    }
    return {
      cells: new Set(drag.shape.cells.map(([dr, dc]) => `${drag.hoverR! + dr},${drag.hoverC! + dc}`)),
      lines: previewLineClears(grid, drag.shape, drag.hoverR, drag.hoverC)
    };
  }, [drag, grid]);

  const restart = () => {
    sfx.click();
    setGrid(createEmptyGrid(BLOCK_GRID_SIZE));
    setTray(generateBlockTray(ENDLESS_COLORS));
    setScore(0);
    setCombo(0);
    setLinesTotal(0);
    setGameOver(false);
  };

  const bestScore = Math.max(progress.highBlockScore, score);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col items-center justify-between">
      <img
        src={assetUrl('assets/bg_gameplay.jpg')}
        alt="Blok ve Patlat"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-transparent to-[#2e1606]/50 pointer-events-none" />

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
          <div className="parchment-card rounded-2xl px-4 py-1 text-center min-w-[100px]">
            <div className="text-[10px] font-black text-[#7a4518] uppercase">Skor</div>
            <div className="font-display text-2xl font-black text-[#3b1b04] leading-none tabular-nums">
              {score}
            </div>
          </div>
          <div className="parchment-card rounded-2xl px-3.5 py-1 text-center flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
            <div>
              <div className="text-[10px] font-black text-[#7a4518] uppercase">Rekor</div>
              <div className="font-display text-lg font-black text-[#3b1b04] leading-none tabular-nums">
                {bestScore}
              </div>
            </div>
          </div>
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
        <div className="w-12 h-11 shrink-0">
          <KnowzaSprite
            pose="flag"
            outfit={progress.equippedOutfit}
            accessory={progress.equippedAccessory}
            className="w-full h-full object-contain drop-shadow"
          />
        </div>
        <div className="parchment-subcard rounded-2xl px-3 py-1 text-[11px] font-extrabold text-[#4d2607]">
          {combo >= 2
            ? `Müthiş! ${combo}x Seri! 3+ aynı renge dokunarak da patlatabilirsin!`
            : 'Blokları sürükleyip sıra temizle, ya da 3+ aynı renge dokunup patlat!'}
        </div>
      </div>

      {/* 8x8 Board */}
      <div className="relative z-20 w-full max-w-[410px] px-3 flex items-center justify-center my-auto">
        <div
          className={`wood-board-frame rounded-[22px] p-2.5 w-full aspect-square relative ${
            boardShaking ? 'animate-board-shake' : ''
          }`}
        >
          <div
            ref={boardRef}
            className="w-full h-full rounded-[14px] bg-[#552d0d]/95 relative shadow-inner overflow-hidden"
          >
            {/* Slot layer */}
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
                    <div key={`slot_${key}`} className="p-[1.5px]">
                      <div
                        className={`w-full h-full rounded-[8px] transition-colors ${
                          isLineHighlight ? 'bg-amber-300/45 ring-2 ring-amber-200' : 'bg-[#381b05]/60'
                        }`}
                      >
                        {!cell && isGhost && drag ? (
                          <div
                            className={`w-full h-full rounded-[8px] bg-gradient-to-b ${
                              CUBE_PALETTE[drag.shape.color].bg
                            } opacity-65 border-2 border-white/90 animate-pulse`}
                          />
                        ) : null}
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
                      onPointerEnter={() => {
                        if (cell.obstacle || cell.special) {
                          setHoveredCluster(new Set());
                          return;
                        }
                        const cl = findCluster(grid, r, c);
                        setHoveredCluster(
                          cl.length >= 3 ? new Set(cl.map(([cr, cc]) => `${cr},${cc}`)) : new Set()
                        );
                      }}
                      onPointerLeave={() => setHoveredCluster(new Set())}
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
                        hintSpecial={hintMap[key]}
                        highlighted={hoveredCluster.has(key) || isLineHit}
                        onClick={() => handleCellTap(r, c)}
                      />
                    </div>
                  );
                })}
            </div>

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
                  className={`w-full h-full rounded-[10px] cube-gloss border-2 border-white/85 ${
                    g.color ? `bg-gradient-to-b ${CUBE_PALETTE[g.color].bg}` : 'bg-amber-400'
                  }`}
                />
              </div>
            ))}

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
                  boxShadow: `0 0 6px ${s.color}`,
                  ['--dx' as string]: `${s.dx}px`,
                  ['--dy' as string]: `${s.dy}px`,
                  ['--rot' as string]: `${s.rot}deg`,
                  zIndex: 25
                }}
              />
            ))}

            {clearedFlash.rows.map((rr) => (
              <div
                key={`ebeam_r_${rr}`}
                className="absolute left-0 right-0 h-[12.5%] pointer-events-none bg-gradient-to-r from-transparent via-white/95 to-transparent animate-beam-flash"
                style={{ top: `${(rr / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
              />
            ))}
            {clearedFlash.cols.map((cc) => (
              <div
                key={`ebeam_c_${cc}`}
                className="absolute top-0 bottom-0 w-[12.5%] pointer-events-none bg-gradient-to-b from-transparent via-white/95 to-transparent animate-beam-flash"
                style={{ left: `${(cc / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
              />
            ))}

            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-40">
              {callouts.map((co) => (
                <div key={co.id} className="animate-combo-float text-center">
                  <div className="font-display text-2xl sm:text-3xl font-black text-[#ffe659] text-stroke-brown">
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
      </div>

      {/* 3-Piece Tray */}
      <div className="relative z-30 w-full max-w-[430px] px-3 pb-4">
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="wood-panel rounded-2xl p-2.5 grid grid-cols-3 gap-2 items-center select-none"
        >
          {tray.map((shape, idx) => {
            if (!shape) {
              return <div key={`eb_empty_${idx}`} className="h-20 rounded-xl bg-[#2f1605]/45" />;
            }
            const fits = canShapeFitAnywhere(grid, shape);
            const isDragging = drag?.shapeIndex === idx;
            const { rows: sRows, cols: sCols } = getShapeBounds(shape);
            const maxDim = Math.max(sRows, sCols);
            const trayCellPx = maxDim >= 5 ? 10 : maxDim === 4 ? 12 : 15;
            return (
              <div
                key={shape.id}
                onPointerDown={(e) => startDrag(e, idx, shape)}
                className={`h-20 rounded-xl bg-[#3a1c07]/75 border border-[#8e5222] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none ${
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
      </div>

      {/* Floating Drag Piece */}
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

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="parchment-card rounded-3xl p-6 max-w-xs w-full text-center relative animate-pop-in mt-10">
            <img
              src={assetUrl('assets/mascot_sad_clean.png')}
              alt="Knowza"
              className="w-28 h-28 object-contain mx-auto -mt-20 drop-shadow-lg"
            />
            <h2 className="font-display text-2xl font-black text-[#471f04] mt-1">
              Yer Kalmadı!
            </h2>
            <p className="text-sm font-bold text-[#7c4617] mt-1">
              Harika oynadın! Skorun ödüllere dönüştü.
            </p>

            <div className="parchment-subcard rounded-2xl p-3 my-4 flex justify-around">
              <div>
                <div className="text-[11px] font-black text-amber-800">Skor</div>
                <div className="font-display text-2xl font-black text-[#3b1903]">{score}</div>
              </div>
              <div className="w-[1px] bg-amber-300" />
              <div>
                <div className="text-[11px] font-black text-amber-800">Kazanılan Altın</div>
                <div className="font-display text-2xl font-black text-amber-600">
                  +{Math.max(15, Math.floor(score / 25))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
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
