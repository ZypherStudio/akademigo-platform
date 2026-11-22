import React from 'react';
import { BiomeId, BlockThemeId, PolyominoShape, SpecialType } from '../types/game';
import { getShapeBounds } from '../utils/blockDrag';
import { BoosterIcon } from './BoosterIcon';
import { BiomeTileOverlay, CUBE_PALETTE, CubeEmblem, getBiomeTileFrameClass } from './CubeTile';

export { getShapeBounds };

interface BlockTrayPieceProps {
  shape: PolyominoShape;
  cellPx?: number;
  disabled?: boolean;
  theme?: BlockThemeId;
  biome?: BiomeId;
  gapPx?: number;
}

export const BlockTrayPiece: React.FC<BlockTrayPieceProps> = ({
  shape,
  cellPx = 15,
  disabled = false,
  theme = 'classic',
  biome,
  gapPx = 2
}) => {
  const { rows, cols } = getShapeBounds(shape);
  const pal = CUBE_PALETTE[shape.color];
  const biomeFrame = getBiomeTileFrameClass(biome);
  const cellIndexMap = new Map<string, number>();
  shape.cells.forEach(([r, c], idx) => cellIndexMap.set(`${r},${c}`, idx));
  const radius =
    theme === 'crystal' ? 'rounded-[3px]' : theme === 'candy' ? 'rounded-[7px]' : 'rounded-[4px]';

  const getSpecialAt = (idx: number): SpecialType | null =>
    shape.specialCell && shape.specialCell.index === idx ? shape.specialCell.special : null;

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
          const cellIdx = cellIndexMap.get(`${r},${c}`);
          if (cellIdx === undefined) {
            return <div key={`${r}-${c}`} style={{ width: cellPx, height: cellPx }} />;
          }
          const spec = getSpecialAt(cellIdx);
          if (spec) {
            const boosterKind = spec === 'disco' ? 'disco' : spec === 'bomb' ? 'bomb' : 'rocket';
            const specBg =
              spec === 'disco'
                ? 'from-[#5b21b6] to-[#2e1065] border-[#c084fc]'
                : spec === 'bomb'
                ? 'from-[#475569] to-[#0f172a] border-[#fbbf24]'
                : 'from-[#fde68a] to-[#d97706] border-[#78350f]';
            return (
              <div
                key={`${r}-${c}`}
                style={{ width: cellPx, height: cellPx }}
                className={`${radius} bg-gradient-to-b ${specBg} border shadow-md flex items-center justify-center ring-1 ring-amber-200`}
              >
                <BoosterIcon type={boosterKind} className="w-[82%] h-[82%] drop-shadow" />
              </div>
            );
          }

          return (
            <div
              key={`${r}-${c}`}
              style={{ width: cellPx, height: cellPx }}
              className={`${radius} ${
                theme === 'dojo'
                  ? 'bg-gradient-to-b from-[#4d2409] to-[#260f02] border border-[#fbbf24] p-[1.5px]'
                  : `bg-gradient-to-b ${pal.bg} border ${pal.border} shadow-[inset_0_-2px_0_rgba(0,0,0,0.35),inset_0_1.5px_0_rgba(255,255,255,0.65)] p-[1.5px]`
              } ${biomeFrame} ${shape.isGoldBonus ? 'ring-1 ring-[#ffe066]' : ''} flex items-center justify-center relative overflow-hidden`}
            >
              <div
                className={`w-full h-full rounded-[2px] bg-gradient-to-b ${pal.inner} flex items-center justify-center relative overflow-hidden`}
              >
                <BiomeTileOverlay biome={biome} />
                {theme === 'crystal' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 55%)'
                    }}
                  />
                )}
                <CubeEmblem color={shape.color} className={`w-[60%] h-[60%] ${pal.emboss}`} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
