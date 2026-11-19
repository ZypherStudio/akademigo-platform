import React from 'react';
import { BlockThemeId, CellData, CubeColor, SpecialType } from '../types/game';
import { BoosterIcon } from './BoosterIcon';

export const CUBE_PALETTE: Record<
  CubeColor,
  {
    bg: string;
    border: string;
    lip: string;
    emboss: string;
    particle: string;
  }
> = {
  blue: {
    bg: 'from-[#4fc4ff] via-[#1c8cf8] to-[#0d58cb]',
    border: 'border-[#0943a3]',
    lip: 'shadow-[inset_0_-4px_0_rgba(6,44,122,0.45),inset_0_2.5px_0_rgba(195,240,255,0.7),0_2px_4px_rgba(0,0,0,0.24)]',
    emboss: 'text-[#052c7a] opacity-25 drop-shadow-[0_1px_0_rgba(190,238,255,0.6)]',
    particle: '#38bdf8'
  },
  yellow: {
    bg: 'from-[#ffed5e] via-[#ffbe10] to-[#e28500]',
    border: 'border-[#b25f00]',
    lip: 'shadow-[inset_0_-4px_0_rgba(166,85,0,0.4),inset_0_2.5px_0_rgba(255,252,210,0.8),0_2px_4px_rgba(0,0,0,0.22)]',
    emboss: 'text-[#8c4700] opacity-25 drop-shadow-[0_1px_0_rgba(255,250,210,0.65)]',
    particle: '#facc15'
  },
  red: {
    bg: 'from-[#ff6969] via-[#f02626] to-[#b50e0e]',
    border: 'border-[#840909]',
    lip: 'shadow-[inset_0_-4px_0_rgba(125,8,8,0.48),inset_0_2.5px_0_rgba(255,198,198,0.7),0_2px_4px_rgba(0,0,0,0.24)]',
    emboss: 'text-[#660404] opacity-25 drop-shadow-[0_1px_0_rgba(255,195,195,0.55)]',
    particle: '#f87171'
  },
  green: {
    bg: 'from-[#6af062] via-[#26c133] to-[#12861c]',
    border: 'border-[#0c5d12]',
    lip: 'shadow-[inset_0_-4px_0_rgba(8,84,15,0.48),inset_0_2.5px_0_rgba(205,255,205,0.68),0_2px_4px_rgba(0,0,0,0.24)]',
    emboss: 'text-[#06420a] opacity-25 drop-shadow-[0_1px_0_rgba(195,255,198,0.55)]',
    particle: '#4ade80'
  },
  purple: {
    bg: 'from-[#dc8cff] via-[#9935f0] to-[#6314ad]',
    border: 'border-[#480a82]',
    lip: 'shadow-[inset_0_-4px_0_rgba(68,9,122,0.48),inset_0_2.5px_0_rgba(238,200,255,0.68),0_2px_4px_rgba(0,0,0,0.24)]',
    emboss: 'text-[#360566] opacity-25 drop-shadow-[0_1px_0_rgba(238,195,255,0.55)]',
    particle: '#c084fc'
  }
};

export const CubeEmblem: React.FC<{ color: CubeColor; className?: string }> = ({ color, className = 'w-6 h-6' }) => {
  if (color === 'yellow') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2.4l2.75 5.58 6.16.9-4.46 4.35 1.05 6.13L12 16.46l-5.5 2.9 1.05-6.13L3.1 8.88l6.15-.9L12 2.4z" />
      </svg>
    );
  }
  if (color === 'red') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 20.6s-7.5-4.7-9.6-9.1C.8 8.2 2.6 4.5 6.3 4.1c2.2-.2 4.3.9 5.7 2.7 1.4-1.8 3.5-2.9 5.7-2.7 3.7.4 5.5 4.1 3.9 7.4-2.1 4.4-9.6 9.1-9.6 9.1z" />
      </svg>
    );
  }
  if (color === 'blue') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 3.8L20.3 18.8a1.2 1.2 0 0 1-1.05 1.78H4.75A1.2 1.2 0 0 1 3.7 18.8L12 3.8z" />
      </svg>
    );
  }
  if (color === 'green') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M15.8 4.2A8.2 8.2 0 1 0 19.8 17.5 6.6 6.6 0 0 1 15.8 4.2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5L20.5 12 12 21.5 3.5 12 12 2.5z" />
    </svg>
  );
};

interface CubeTileProps {
  cell: CellData;
  theme?: BlockThemeId;
  hintSpecial?: SpecialType | null;
  highlighted?: boolean;
  onClick?: () => void;
}

export const CubeTile: React.FC<CubeTileProps> = ({
  cell,
  theme = 'classic',
  hintSpecial,
  highlighted,
  onClick
}) => {
  if (cell.obstacle === 'crate') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-full rounded-[11px] bg-gradient-to-br from-[#d99b56] via-[#ad6b29] to-[#744012] border-2 border-[#472306] shadow-[inset_0_2px_0_rgba(255,226,178,0.5),inset_0_-4px_0_rgba(45,20,0,0.55),0_3px_5px_rgba(0,0,0,0.28)] relative flex items-center justify-center transition-transform active:scale-90 ${
          highlighted ? 'ring-2 ring-amber-200 brightness-110 scale-[1.04]' : ''
        }`}
      >
        <div className="w-[74%] h-[74%] rounded-[5px] border-2 border-[#592e0b] bg-[#bd7934]/65 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[3px] bg-[#66360e] rotate-45 rounded" />
            <div className="w-full h-[3px] bg-[#66360e] -rotate-45 rounded absolute" />
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffe19c] absolute top-0.5 left-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffe19c] absolute top-0.5 right-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffe19c] absolute bottom-0.5 left-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffe19c] absolute bottom-0.5 right-0.5" />
        </div>
      </button>
    );
  }

  if (cell.special) {
    const specialKind =
      cell.special === 'disco' ? 'disco' : cell.special === 'bomb' ? 'bomb' : 'rocket';
    const bgClass =
      cell.special === 'disco'
        ? 'from-[#4c2480] via-[#2a1548] to-[#1a0b30] border-[#a855f7]'
        : cell.special === 'bomb'
        ? 'from-[#475569] via-[#1e293b] to-[#0f172a] border-[#020617]'
        : 'from-[#fde68a] via-[#f59e0b] to-[#b45309] border-[#78350f]';

    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-full rounded-[11px] bg-gradient-to-b ${bgClass} border-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_4px_8px_rgba(0,0,0,0.42)] flex items-center justify-center relative transition-transform active:scale-90 animate-pulse-soft`}
      >
        <BoosterIcon type={specialKind} className="w-[84%] h-[84%] drop-shadow" />
        {cell.special === 'rocket_v' && (
          <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-white bg-black/50 px-1 rounded">↕</span>
        )}
        {cell.special === 'rocket_h' && (
          <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-white bg-black/50 px-1 rounded">↔</span>
        )}
      </button>
    );
  }

  const color = cell.color || 'blue';
  const pal = CUBE_PALETTE[color];

  // Theme-specific styling variants for cubes
  const themeClass =
    theme === 'crystal'
      ? 'rounded-[7px] ring-1 ring-inset ring-white/45'
      : theme === 'candy'
      ? 'rounded-[15px] saturate-125 brightness-105'
      : theme === 'dojo'
      ? 'rounded-[9px] ring-2 ring-inset ring-[#ffe066]/60'
      : 'rounded-[11px]';

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full h-full ${themeClass} bg-gradient-to-b ${pal.bg} border-2 ${pal.border} ${pal.lip} cube-gloss flex items-center justify-center relative transition-all duration-100 active:scale-90 overflow-hidden ${
        highlighted ? 'ring-2 ring-white brightness-115 scale-[1.04]' : ''
      }`}
    >
      {/* Crystal Facet Bevel Overlay */}
      {theme === 'crystal' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.16) 100%)',
            clipPath: 'polygon(0 0, 100% 0, 82% 82%, 18% 82%)'
          }}
        />
      )}

      {/* Candy Pill Bubble Highlight */}
      {theme === 'candy' && (
        <span className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full bg-white/75 -rotate-12 pointer-events-none" />
      )}

      {/* Dojo Gold Corner Frame */}
      {theme === 'dojo' && (
        <div className="absolute inset-[3px] rounded-[6px] border border-[#ffd859]/55 pointer-events-none" />
      )}

      {/* Centered Emblem OR Clean In-Cube Power-Up Preview Badge (no clipped corner eyes!) */}
      {hintSpecial && !cell.obstacle ? (
        <div className="relative z-10 w-[70%] h-[70%] rounded-lg bg-white/25 backdrop-blur-[1px] border border-white/55 flex items-center justify-center shadow-inner animate-pulse">
          <BoosterIcon
            type={hintSpecial === 'disco' ? 'disco' : hintSpecial === 'bomb' ? 'bomb' : 'rocket'}
            className="w-[82%] h-[82%] drop-shadow"
          />
        </div>
      ) : (
        <CubeEmblem color={color} className={`w-[54%] h-[54%] ${pal.emboss}`} />
      )}

      {cell.obstacle === 'ice' && (
        <div className="absolute inset-0 rounded-[9px] bg-gradient-to-br from-cyan-100/75 via-sky-200/45 to-blue-400/65 border-2 border-white/90 shadow-[inset_0_0_8px_rgba(255,255,255,0.9)] pointer-events-none flex items-center justify-center">
          <div className="w-[75%] h-[2px] bg-white/85 rotate-45 rounded-full" />
          <div className="w-[55%] h-[2px] bg-white/75 -rotate-45 rounded-full absolute" />
        </div>
      )}
    </Tag>
  );
};
