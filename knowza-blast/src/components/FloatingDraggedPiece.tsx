import React from 'react';
import { BiomeId, BlockThemeId, CellData, PolyominoShape } from '../types/game';
import { getDragFloatingMetrics, getShapeBounds } from '../utils/blockDrag';
import { CubeTile } from './CubeTile';

interface FloatingDraggedPieceProps {
  boardEl: HTMLElement | null;
  shape: PolyominoShape;
  pointerX: number;
  pointerY: number;
  pointerType: string;
  hoverR: number | null;
  hoverC: number | null;
  canDrop: boolean;
  theme?: BlockThemeId;
  biome?: BiomeId;
}

/**
 * Renders the actively dragged polyomino using the exact board-sized sculpted CubeTile bricks,
 * snapping seamlessly onto the valid grid cells with zero double-vision ghost mismatch.
 */
export const FloatingDraggedPiece: React.FC<FloatingDraggedPieceProps> = ({
  boardEl,
  shape,
  pointerX,
  pointerY,
  pointerType,
  hoverR,
  hoverC,
  canDrop,
  theme = 'classic',
  biome
}) => {
  const { rows, cols } = getShapeBounds(shape);
  const metrics = getDragFloatingMetrics(
    boardEl,
    shape,
    pointerX,
    pointerY,
    pointerType,
    hoverR,
    hoverC,
    canDrop
  );

  const isInvalidHover = hoverR !== null && hoverC !== null && !canDrop;

  return (
    <div
      className={`fixed pointer-events-none z-50 transition-opacity duration-75 ${
        metrics.snapped
          ? 'opacity-95 drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]'
          : isInvalidHover
          ? 'opacity-75 drop-shadow-[0_12px_16px_rgba(244,63,94,0.35)]'
          : 'opacity-95 drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)]'
      }`}
      style={{
        left: metrics.left,
        top: metrics.top,
        width: cols * metrics.cellW,
        height: rows * metrics.cellH
      }}
    >
      {shape.cells.map(([dr, dc], idx) => {
        const spec = shape.specialCell?.index === idx ? shape.specialCell.special : null;
        const cellData: CellData = {
          uid: `drag_${shape.id}_${idx}`,
          color: shape.color,
          special: spec
        };
        return (
          <div
            key={cellData.uid}
            className="absolute p-[1.5px]"
            style={{
              left: dc * metrics.cellW,
              top: dr * metrics.cellH,
              width: metrics.cellW,
              height: metrics.cellH
            }}
          >
            <div className={`w-full h-full ${shape.isGoldBonus ? 'ring-1 ring-[#ffe066] rounded-[10px]' : ''}`}>
              <CubeTile cell={cellData} theme={theme} biome={biome} highlighted={metrics.snapped} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
