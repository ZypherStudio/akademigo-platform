import React from 'react';
import { Check } from 'lucide-react';
import { BlockThemeId, CubeColor, TargetKey } from '../types/game';
import { CUBE_PALETTE, CubeEmblem } from './CubeTile';

interface TargetChipProps {
  targetKey: TargetKey;
  remaining: number;
  size?: 'sm' | 'md';
  theme?: BlockThemeId;
  pulse?: boolean;
}

export const TargetChip: React.FC<TargetChipProps> = ({
  targetKey,
  remaining,
  size = 'md',
  theme = 'classic',
  pulse = false
}) => {
  const done = remaining <= 0;
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const radius =
    theme === 'crystal'
      ? 'rounded-[6px]'
      : theme === 'candy'
      ? 'rounded-[12px]'
      : theme === 'dojo'
      ? 'rounded-[8px] ring-1 ring-[#ffe066]/70'
      : 'rounded-[9px]';

  return (
    <div className={`flex flex-col items-center gap-0.5 transition-transform ${pulse ? 'scale-115' : ''}`}>
      {targetKey === 'crate' ? (
        <div
          className={`${dim} rounded-[9px] bg-gradient-to-br from-[#d99b56] to-[#744012] border-2 border-[#472306] shadow flex items-center justify-center`}
        >
          <div className="w-[70%] h-[70%] border border-[#4f2607] rounded-[3px] relative flex items-center justify-center">
            <div className="w-full h-[2px] bg-[#522708] rotate-45" />
            <div className="w-full h-[2px] bg-[#522708] -rotate-45 absolute" />
          </div>
        </div>
      ) : targetKey === 'ice' ? (
        <div
          className={`${dim} rounded-[9px] bg-gradient-to-br from-cyan-100 via-sky-300 to-blue-500 border-2 border-white shadow flex items-center justify-center`}
        >
          <div className="w-4 h-0.5 bg-white rotate-45" />
          <div className="w-4 h-0.5 bg-white -rotate-45 absolute" />
        </div>
      ) : (
        <div
          className={`${dim} ${radius} bg-gradient-to-b ${CUBE_PALETTE[targetKey as CubeColor].bg} border-2 ${CUBE_PALETTE[targetKey as CubeColor].border} ${CUBE_PALETTE[targetKey as CubeColor].lip} cube-gloss flex items-center justify-center`}
        >
          <CubeEmblem
            color={targetKey as CubeColor}
            className={`w-[54%] h-[54%] ${CUBE_PALETTE[targetKey as CubeColor].emboss}`}
          />
        </div>
      )}

      {done ? (
        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 stroke-[3.5]" />
        </span>
      ) : (
        <span className="text-[12px] font-black text-[#472005] leading-none tabular-nums">
          {remaining}
        </span>
      )}
    </div>
  );
};
