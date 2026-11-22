import React from 'react';
import { Flame, Sparkles, Star, Zap } from 'lucide-react';
import { CubeColor, FloatingCallout, InventoryBooster } from '../types/game';
import { BLOCK_GRID_SIZE } from '../utils/puzzleEngine';
import { BoosterIcon } from './BoosterIcon';
import { CUBE_PALETTE } from './CubeTile';

export interface GhostVfx {
  id: string;
  r: number;
  c: number;
  color: CubeColor | null;
}

export interface ShardVfx {
  id: string;
  r: number;
  c: number;
  color: string;
  dx: number;
  dy: number;
  rot: number;
  size: number;
}

export interface BeamVfx {
  id: string;
  r: number;
  c: number;
  dir: 'h' | 'v' | 'both';
}

export interface RingVfx {
  id: string;
  r: number;
  c: number;
}

export interface BoosterActionVfx {
  id: string;
  type: InventoryBooster;
  r: number;
  c: number;
  targets?: [number, number][];
}

interface BoardVfxLayerProps {
  ghosts: GhostVfx[];
  shards: ShardVfx[];
  clearedFlash: { rows: number[]; cols: number[] };
  rocketBeams: BeamVfx[];
  bombRings: RingVfx[];
  callouts: FloatingCallout[];
}

/** Shared explosive board VFX overlay for 8x8 Block Blast screens (ghosts, shards, laser beams, shock rings, callouts). */
export const BoardVfxLayer: React.FC<BoardVfxLayerProps> = ({
  ghosts,
  shards,
  clearedFlash,
  rocketBeams,
  bombRings,
  callouts
}) => {
  return (
    <>
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

      {clearedFlash.rows.map((rr) => (
        <div
          key={`beam_r_${rr}`}
          className="absolute left-0 right-0 h-[12.5%] pointer-events-none bg-gradient-to-r from-transparent via-white/95 to-transparent animate-beam-flash"
          style={{ top: `${(rr / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
        />
      ))}
      {clearedFlash.cols.map((cc) => (
        <div
          key={`beam_c_${cc}`}
          className="absolute top-0 bottom-0 w-[12.5%] pointer-events-none bg-gradient-to-b from-transparent via-white/95 to-transparent animate-beam-flash"
          style={{ left: `${(cc / BLOCK_GRID_SIZE) * 100}%`, zIndex: 30 }}
        />
      ))}

      {rocketBeams.map((rb) => (
        <React.Fragment key={rb.id}>
          {(rb.dir === 'h' || rb.dir === 'both') && (
            <>
              <div
                className="absolute left-0 right-0 h-[12.5%] pointer-events-none bg-gradient-to-r from-amber-300 via-white to-amber-300 shadow-[0_0_16px_#fbbf24] animate-rocket-h"
                style={{ top: `${(rb.r / BLOCK_GRID_SIZE) * 100}%`, zIndex: 32 }}
              />
              <div
                className="absolute w-10 h-10 pointer-events-none animate-rocket-fly-r"
                style={{
                  left: `${((rb.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${((rb.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  zIndex: 38
                }}
              >
                <BoosterIcon type="rocket" className="w-full h-full drop-shadow-[0_0_8px_#fbbf24]" />
              </div>
              <div
                className="absolute w-10 h-10 pointer-events-none animate-rocket-fly-l"
                style={{
                  left: `${((rb.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${((rb.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  zIndex: 38
                }}
              >
                <BoosterIcon type="rocket" className="w-full h-full drop-shadow-[0_0_8px_#fbbf24]" />
              </div>
            </>
          )}
          {(rb.dir === 'v' || rb.dir === 'both') && (
            <>
              <div
                className="absolute top-0 bottom-0 w-[12.5%] pointer-events-none bg-gradient-to-b from-amber-300 via-white to-amber-300 shadow-[0_0_16px_#fbbf24] animate-rocket-v"
                style={{ left: `${(rb.c / BLOCK_GRID_SIZE) * 100}%`, zIndex: 32 }}
              />
              <div
                className="absolute w-10 h-10 pointer-events-none animate-rocket-fly-u"
                style={{
                  left: `${((rb.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${((rb.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  zIndex: 38
                }}
              >
                <BoosterIcon type="rocket" className="w-full h-full drop-shadow-[0_0_8px_#fbbf24]" />
              </div>
              <div
                className="absolute w-10 h-10 pointer-events-none animate-rocket-fly-d"
                style={{
                  left: `${((rb.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  top: `${((rb.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
                  zIndex: 38
                }}
              >
                <BoosterIcon type="rocket" className="w-full h-full drop-shadow-[0_0_8px_#fbbf24]" />
              </div>
            </>
          )}
        </React.Fragment>
      ))}

      {bombRings.map((ring) => (
        <div
          key={ring.id}
          className="absolute w-[34%] h-[34%] rounded-full border-4 border-amber-300 bg-orange-400/30 shadow-[0_0_24px_rgba(251,146,60,0.85)] pointer-events-none animate-shock-ring"
          style={{
            left: `${((ring.c + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
            top: `${((ring.r + 0.5) / BLOCK_GRID_SIZE) * 100}%`,
            zIndex: 34
          }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-40">
        {callouts.map((co) => (
          <div key={co.id} className="animate-combo-float text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3b1a04]/75 border border-amber-300/70 shadow-lg mb-0.5">
              {co.variant === 'fever' ? (
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
              ) : co.variant === 'cross' ? (
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0" />
              ) : co.variant === 'chain' ? (
                <Sparkles className="w-4 h-4 text-cyan-300 fill-cyan-300 shrink-0" />
              ) : (
                <Star className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              )}
              <span
                className={`font-display text-xl sm:text-2xl font-black tracking-wide text-stroke-brown ${co.colorClass}`}
              >
                {co.text}
              </span>
            </div>
            {co.subtext && (
              <div className="text-xs font-black text-white bg-[#4d2407]/90 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-300 shadow">
                {co.subtext}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

/**
 * Unclipped 8x8 overlay rendering the physical 3D booster action models (swinging Hammer,
 * priming Bomb, launching Cross-Rockets, and spinning Rainbow Disco Ball with laser rays).
 */
export const BoosterActionLayer: React.FC<{ actions: BoosterActionVfx[] }> = ({ actions }) => {
  if (actions.length === 0) return null;

  const rainbowColors = ['#22d3ee', '#f472b6', '#fde047', '#4ade80', '#c084fc'];

  return (
    <div className="absolute inset-2 pointer-events-none z-40 overflow-visible">
      {actions.map((act) => {
        const cxPct = ((act.c + 0.5) / BLOCK_GRID_SIZE) * 100;
        const cyPct = ((act.r + 0.5) / BLOCK_GRID_SIZE) * 100;

        if (act.type === 'hammer') {
          return (
            <React.Fragment key={act.id}>
              <div
                className="absolute w-16 h-16 rounded-full pointer-events-none animate-impact-starburst"
                style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
              >
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <polygon
                    points="40,4 49,25 72,18 55,37 76,50 53,53 60,76 40,59 20,76 27,53 4,50 25,37 8,18 31,25"
                    fill="#fde047"
                    stroke="#ea580c"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <div
                className="absolute w-[74px] h-[74px] animate-hammer-smash drop-shadow-[0_10px_16px_rgba(0,0,0,0.6)]"
                style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
              >
                <BoosterIcon type="hammer" className="w-full h-full" />
              </div>
            </React.Fragment>
          );
        }

        if (act.type === 'bomb') {
          return (
            <React.Fragment key={act.id}>
              <div
                className="absolute w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.8)_0%,rgba(239,68,68,0.35)_55%,transparent_75%)] animate-impact-starburst"
                style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
              />
              <div
                className="absolute w-[62px] h-[62px] animate-bomb-fuse drop-shadow-[0_10px_18px_rgba(249,115,22,0.85)]"
                style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
              >
                <BoosterIcon type="bomb" className="w-full h-full" />
              </div>
            </React.Fragment>
          );
        }

        if (act.type === 'rocket') {
          return (
            <div
              key={act.id}
              className="absolute w-16 h-16 animate-impact-starburst"
              style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
            >
              <BoosterIcon type="rocket" className="w-full h-full drop-shadow-[0_0_14px_#fde047]" />
            </div>
          );
        }

        // Disco Ball + multi-target rainbow laser beams
        return (
          <React.Fragment key={act.id}>
            {act.targets && act.targets.length > 0 && (
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full overflow-visible"
              >
                {act.targets.map(([tr, tc], idx) => {
                  const tx = ((tc + 0.5) / BLOCK_GRID_SIZE) * 100;
                  const ty = ((tr + 0.5) / BLOCK_GRID_SIZE) * 100;
                  const stroke = rainbowColors[idx % rainbowColors.length];
                  return (
                    <g key={`${act.id}_ray_${tr}_${tc}`}>
                      <line
                        x1={cxPct}
                        y1={cyPct}
                        x2={tx}
                        y2={ty}
                        stroke={stroke}
                        strokeLinecap="round"
                        className="animate-laser-zap"
                      />
                      <circle cx={tx} cy={ty} r="3.4" fill={stroke} className="animate-laser-zap" />
                    </g>
                  );
                })}
              </svg>
            )}
            <div
              className="absolute w-[66px] h-[66px] animate-disco-zap drop-shadow-[0_0_20px_rgba(192,132,252,0.95)]"
              style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
            >
              <BoosterIcon type="disco" className="w-full h-full" />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
