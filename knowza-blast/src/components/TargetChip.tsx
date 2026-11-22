import React from 'react';
import { Check } from 'lucide-react';
import { BiomeId, BlockThemeId, CubeColor, TargetKey } from '../types/game';
import { BiomeTileOverlay, CUBE_PALETTE, CubeEmblem, getBiomeTileFrameClass } from './CubeTile';

interface TargetChipProps {
  targetKey: TargetKey;
  remaining: number;
  size?: 'sm' | 'md';
  theme?: BlockThemeId;
  biome?: BiomeId;
  labelClass?: string;
  pulse?: boolean;
}

export const TargetChip: React.FC<TargetChipProps> = ({
  targetKey,
  remaining,
  size = 'md',
  theme = 'classic',
  biome,
  labelClass = 'text-[#472005]',
  pulse = false
}) => {
  const done = remaining <= 0;
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const biomeFrame = getBiomeTileFrameClass(biome);
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
      ) : targetKey === 'stone' ? (
        <div
          className={`${dim} rounded-[9px] bg-gradient-to-b from-[#78716c] via-[#44403c] to-[#1c1917] border-2 border-[#0c0a09] shadow flex items-center justify-center relative`}
        >
          <svg viewBox="0 0 28 28" className="w-[74%] h-[74%]">
            <polygon points="14,4 23,9 23,19 14,24 5,19 5,9" fill="#292524" stroke="#a8a29e" strokeWidth="1.6" />
            <circle cx="14" cy="14" r="2.5" fill="#d6d3d1" />
          </svg>
        </div>
      ) : targetKey === 'spark' ? (
        <div
          className={`${dim} rounded-[9px] bg-gradient-to-b from-[#22d3ee] via-[#0284c7] to-[#1e1b4b] border-2 border-[#a5f3fc] shadow flex items-center justify-center`}
        >
          <svg viewBox="0 0 28 28" className="w-[74%] h-[74%]">
            <path d="M16 3 L7 15 H13.5 L11.5 25 L21 12.5 H14.5 Z" fill="#fef08a" stroke="#083344" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div
          className={`${dim} ${radius} ${biomeFrame} bg-gradient-to-b ${CUBE_PALETTE[targetKey as CubeColor].bg} border-2 ${CUBE_PALETTE[targetKey as CubeColor].border} ${CUBE_PALETTE[targetKey as CubeColor].lip} cube-gloss flex items-center justify-center relative overflow-hidden`}
        >
          <BiomeTileOverlay biome={biome} />
          <CubeEmblem
            color={targetKey as CubeColor}
            className={`w-[54%] h-[54%] relative z-10 ${CUBE_PALETTE[targetKey as CubeColor].emboss}`}
          />
        </div>
      )}

      {done ? (
        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 stroke-[3.5]" />
        </span>
      ) : (
        <span className={`text-[12px] font-black ${labelClass} leading-none tabular-nums`}>
          {remaining}
        </span>
      )}
    </div>
  );
};
