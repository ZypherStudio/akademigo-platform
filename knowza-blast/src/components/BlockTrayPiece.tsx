import React from 'react';
import { BlockThemeId, PolyominoShape } from '../types/game';
import { getShapeBounds } from '../utils/blockDrag';
import { CUBE_PALETTE, CubeEmblem } from './CubeTile';

export { getShapeBounds };

interface BlockTrayPieceProps {
  shape: PolyominoShape;
  cellPx?: number;
  disabled?: boolean;
  theme?: BlockThemeId;
  gapPx?: number;
}

export const BlockTrayPiece: React.FC<BlockTrayPieceProps> = ({
  shape,
  cellPx = 15,
  disabled = false,
  theme = 'classic',
  gapPx = 2
}) => {
  const { rows, cols } = getShapeBounds(shape);
  const pal = CUBE_PALETTE[shape.color];
  const cellSet = new Set(shape.cells.map(([r, c]) => `${r},${c}`));
  const radius =
    theme === 'crystal' ? 'rounded-[3px]' : theme === 'candy' ? 'rounded-[7px]' : 'rounded-[4px]';

  return (
    <div
      className={`grid transition-opacity ${disabled ? 'opacity-35' : 'opacity-100'}`}
      style={{
        gap: `${gapPx}px`,
        gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellPx}px)`
      }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const filled = cellSet.has(`${r},${c}`);
          if (!filled) {
            return <div key={`${r}-${c}`} style={{ width: cellPx, height: cellPx }} />;
          }
          return (
            <div
              key={`${r}-${c}`}
              style={{ width: cellPx, height: cellPx }}
              className={`${radius} bg-gradient-to-b ${pal.bg} border ${pal.border} ${
                theme === 'dojo' ? 'ring-1 ring-[#ffe066]/70' : ''
              } cube-gloss shadow-sm flex items-center justify-center`}
            >
              <CubeEmblem color={shape.color} className={`w-[58%] h-[58%] ${pal.emboss}`} />
            </div>
          );
        })
      )}
    </div>
  );
};
