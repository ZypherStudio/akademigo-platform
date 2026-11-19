import { Grid, PolyominoShape } from '../types/game';
import { BLOCK_GRID_SIZE, canPlaceShape } from './puzzleEngine';

/** Vertical lift (px) for touch drags so the player's finger never covers the dropping block. */
export const TOUCH_LIFT_PX = 58;

/** Computes row/column bounding extent of a polyomino shape. */
export function getShapeBounds(shape: PolyominoShape): { rows: number; cols: number } {
  let maxR = 0;
  let maxC = 0;
  for (const [r, c] of shape.cells) {
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }
  return { rows: maxR + 1, cols: maxC + 1 };
}

/** Measures the live pixel size of one board cell so the dragged piece matches the 8x8 grid 1:1. */
export function getBoardCellPx(boardEl: HTMLElement | null): number {
  const width = boardEl?.getBoundingClientRect().width ?? 330;
  return Math.max(26, Math.round((width - 6) / BLOCK_GRID_SIZE - 2));
}

/** Computes target top-left board cell and drop validity aligned 1:1 with the rendered drag offset. */
export function computeBlockDropCell(
  boardEl: HTMLElement | null,
  grid: Grid,
  clientX: number,
  clientY: number,
  pointerType: string,
  shape: PolyominoShape
): { hoverR: number | null; hoverC: number | null; canDrop: boolean } {
  if (!boardEl) return { hoverR: null, hoverC: null, canDrop: false };
  const rect = boardEl.getBoundingClientRect();
  const cellW = rect.width / BLOCK_GRID_SIZE;
  const cellH = rect.height / BLOCK_GRID_SIZE;
  const { rows, cols } = getShapeBounds(shape);

  const liftY = pointerType === 'touch' ? TOUCH_LIFT_PX : 0;
  const adjX = clientX - (cols * cellW) / 2 + cellW / 2;
  const adjY = clientY - liftY - (rows * cellH) / 2 + cellH / 2;

  const c = Math.round((adjX - rect.left) / cellW - 0.5);
  const r = Math.round((adjY - rect.top) / cellH - 0.5);

  if (r < -1 || r >= BLOCK_GRID_SIZE + 1 || c < -1 || c >= BLOCK_GRID_SIZE + 1) {
    return { hoverR: null, hoverC: null, canDrop: false };
  }
  return { hoverR: r, hoverC: c, canDrop: canPlaceShape(grid, shape, r, c) };
}
