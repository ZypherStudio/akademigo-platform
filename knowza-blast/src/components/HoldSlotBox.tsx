import React from 'react';
import { Archive } from 'lucide-react';
import { BiomeId, BlockThemeId, PolyominoShape } from '../types/game';
import { getShapeBounds } from '../utils/blockDrag';
import { BlockTrayPiece } from './BlockTrayPiece';

interface HoldSlotBoxProps {
  heldShape: PolyominoShape | null;
  armHoldMode: boolean;
  isDraggingHeld: boolean;
  canFitHeld: boolean;
  theme?: BlockThemeId;
  biome?: BiomeId;
  heightClass?: string;
  slotClass?: string;
  onToggleArm: () => void;
  onStartDragHeld: (e: React.PointerEvent, shape: PolyominoShape) => void;
}

/** Shared Hold/Park Pocket for saving 1 polyomino piece cleanly across game modes. */
export const HoldSlotBox: React.FC<HoldSlotBoxProps> = ({
  heldShape,
  armHoldMode,
  isDraggingHeld,
  canFitHeld,
  theme = 'classic',
  biome,
  heightClass = 'h-[58px]',
  slotClass = 'bg-black/25 border-white/25 text-amber-100',
  onToggleArm,
  onStartDragHeld
}) => {
  if (heldShape) {
    const { rows, cols } = getShapeBounds(heldShape);
    const maxDim = Math.max(rows, cols);
    const cellPx = maxDim >= 5 ? 7 : maxDim === 4 ? 8 : maxDim === 3 ? 10 : 11;
    return (
      <div
        onPointerDown={(e) => onStartDragHeld(e, heldShape)}
        title="Yedek parçayı tahtaya sürükle"
        className={`${heightClass} rounded-xl border-2 border-amber-400 bg-gradient-to-b from-[#66360e] to-[#3a1c07] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none relative shadow-inner ${
          isDraggingHeld ? 'opacity-20 scale-90' : 'hover:scale-105'
        }`}
      >
        <BlockTrayPiece
          shape={heldShape}
          cellPx={cellPx}
          gapPx={1}
          disabled={!canFitHeld}
          theme={theme}
          biome={biome}
        />
        <span className="absolute bottom-0.5 inset-x-0 text-center text-[7px] font-black tracking-wide text-amber-200 bg-black/50 leading-tight pointer-events-none">
          YEDEK
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleArm}
      title="Parça saklamak için dokun"
      className={`${heightClass} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
        armHoldMode
          ? 'bg-amber-400/25 border-yellow-300 text-yellow-200 ring-2 ring-yellow-300 animate-pulse'
          : `${slotClass} hover:bg-white/10`
      }`}
    >
      <Archive className="w-3.5 h-3.5 opacity-90" />
      <span className="text-[8px] font-black uppercase tracking-tight leading-none">
        {armHoldMode ? 'Seç' : 'Yedek'}
      </span>
    </button>
  );
};
