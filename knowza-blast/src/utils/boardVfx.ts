import { BeamVfx, GhostVfx, RingVfx, ShardVfx } from '../components/BoardVfxLayer';
import { CUBE_PALETTE } from '../components/CubeTile';
import { CubeColor, Grid } from '../types/game';
import { BLOCK_GRID_SIZE } from './puzzleEngine';

export function buildBlastVfx(
  coords: [number, number][],
  sourceGrid: Grid,
  boardPx: number,
  rocketBeamsInput: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [],
  bombRingsInput: [number, number][] = []
): {
  ghosts: GhostVfx[];
  shards: ShardVfx[];
  beams: BeamVfx[];
  rings: RingVfx[];
} {
  const stamp = `${Date.now()}_${Math.random()}`;
  const ghosts: GhostVfx[] = coords.slice(0, 48).map(([r, c], idx) => ({
    id: `g_${stamp}_${idx}`,
    r,
    c,
    color: (sourceGrid[r]?.[c]?.color ?? null) as CubeColor | null
  }));

  const cellPx = boardPx / BLOCK_GRID_SIZE;
  const shards: ShardVfx[] = [];
  coords.slice(0, 32).forEach(([r, c], idx) => {
    const col = sourceGrid[r]?.[c]?.color;
    const hex = col ? CUBE_PALETTE[col].particle : '#fde68a';
    for (let k = 0; k < 3; k++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = cellPx * (0.65 + Math.random() * 1.1);
      shards.push({
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

  const beams: BeamVfx[] = rocketBeamsInput.map((rb, idx) => ({
    id: `rb_${stamp}_${idx}`,
    ...rb
  }));

  const rings: RingVfx[] = bombRingsInput.map(([r, c], idx) => ({
    id: `br_${stamp}_${idx}`,
    r,
    c
  }));

  return { ghosts, shards, beams, rings };
}
