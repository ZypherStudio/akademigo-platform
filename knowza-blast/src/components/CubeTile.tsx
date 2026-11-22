import React from 'react';
import { BiomeId, BlockThemeId, CellData, CubeColor, SpecialType } from '../types/game';
import { BoosterIcon } from './BoosterIcon';

export const CUBE_PALETTE: Record<
  CubeColor,
  {
    bg: string;
    inner: string;
    border: string;
    lip: string;
    emboss: string;
    particle: string;
  }
> = {
  blue: {
    bg: 'from-[#6ed2ff] via-[#1f93ff] to-[#0a4fc4]',
    inner: 'from-[#3fb4ff] via-[#1b84f3] to-[#1262d6]',
    border: 'border-[#073a96]',
    lip: 'shadow-[inset_0_-4px_0_rgba(5,36,105,0.62),inset_0_2.5px_0_rgba(215,245,255,0.8),0_3px_5px_rgba(0,0,0,0.3)]',
    emboss: 'text-[#052970] opacity-30 drop-shadow-[0_1px_0_rgba(190,238,255,0.7)]',
    particle: '#38bdf8'
  },
  yellow: {
    bg: 'from-[#fff275] via-[#ffbe12] to-[#d97700]',
    inner: 'from-[#ffe44d] via-[#fcb208] to-[#e08200]',
    border: 'border-[#9e5100]',
    lip: 'shadow-[inset_0_-4px_0_rgba(150,70,0,0.58),inset_0_2.5px_0_rgba(255,254,225,0.88),0_3px_5px_rgba(0,0,0,0.28)]',
    emboss: 'text-[#7c3d00] opacity-30 drop-shadow-[0_1px_0_rgba(255,252,215,0.75)]',
    particle: '#facc15'
  },
  red: {
    bg: 'from-[#ff7b7b] via-[#ee2828] to-[#a60b0b]',
    inner: 'from-[#ff5656] via-[#de1d1d] to-[#b80e0e]',
    border: 'border-[#7a0606]',
    lip: 'shadow-[inset_0_-4px_0_rgba(105,6,6,0.62),inset_0_2.5px_0_rgba(255,210,210,0.78),0_3px_5px_rgba(0,0,0,0.3)]',
    emboss: 'text-[#5c0303] opacity-30 drop-shadow-[0_1px_0_rgba(255,200,200,0.65)]',
    particle: '#f87171'
  },
  green: {
    bg: 'from-[#7df572] via-[#27c936] to-[#0f7d18]',
    inner: 'from-[#57e554] via-[#20b52e] to-[#138c1c]',
    border: 'border-[#09540f]',
    lip: 'shadow-[inset_0_-4px_0_rgba(6,74,12,0.6),inset_0_2.5px_0_rgba(215,255,215,0.78),0_3px_5px_rgba(0,0,0,0.3)]',
    emboss: 'text-[#053b09] opacity-30 drop-shadow-[0_1px_0_rgba(205,255,210,0.65)]',
    particle: '#4ade80'
  },
  purple: {
    bg: 'from-[#e69eff] via-[#9e3bf5] to-[#5a10a1]',
    inner: 'from-[#cf73ff] via-[#8b2ce6] to-[#6917b5]',
    border: 'border-[#400875]',
    lip: 'shadow-[inset_0_-4px_0_rgba(58,8,108,0.62),inset_0_2.5px_0_rgba(244,215,255,0.78),0_3px_5px_rgba(0,0,0,0.3)]',
    emboss: 'text-[#31045c] opacity-30 drop-shadow-[0_1px_0_rgba(240,205,255,0.65)]',
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
  biome?: BiomeId;
  hintSpecial?: SpecialType | null;
  highlighted?: boolean;
  onClick?: () => void;
}

export function getBiomeTileFrameClass(biome?: BiomeId): string {
  switch (biome) {
    case 'glacier':
      return 'ring-1 ring-inset ring-cyan-100/85';
    case 'volcano':
      return 'ring-1 ring-inset ring-orange-400/80 shadow-[0_0_6px_rgba(249,115,22,0.35)]';
    case 'crystal_cave':
      return 'ring-1 ring-inset ring-fuchsia-200/85';
    case 'dojo_peak':
      return 'ring-1 ring-inset ring-pink-200/80';
    case 'desert':
      return 'ring-1 ring-inset ring-amber-200/85';
    case 'cyber_city':
      return 'ring-1 ring-inset ring-cyan-300/90 shadow-[0_0_6px_rgba(34,211,238,0.35)]';
    case 'cosmos':
      return 'ring-1 ring-inset ring-indigo-200/85 shadow-[0_0_6px_rgba(167,139,250,0.4)]';
    default:
      return '';
  }
}

export const BiomeTileOverlay: React.FC<{ biome?: BiomeId }> = ({ biome }) => {
  if (!biome || biome === 'forest') return null;

  if (biome === 'glacier') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <polygon points="0,0 18,0 0,18" fill="rgba(224,242,254,0.42)" />
        <path d="M27 7 L31 11 L27 15" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (biome === 'volcano') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <rect x="0" y="31" width="40" height="9" fill="rgba(249,115,22,0.28)" />
        <path d="M5 36 L11 32 L15 36" stroke="#fde047" strokeWidth="1.2" fill="none" opacity="0.65" />
      </svg>
    );
  }
  if (biome === 'crystal_cave') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <circle cx="32" cy="8" r="1.5" fill="#fff" opacity="0.85" />
      </svg>
    );
  }
  if (biome === 'dojo_peak') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <circle cx="8" cy="8" r="2.2" fill="#fbcfe8" opacity="0.7" />
        <circle cx="32" cy="32" r="1.8" fill="#fde047" opacity="0.65" />
      </svg>
    );
  }
  if (biome === 'desert') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <path d="M3 8 H10 M30 32 H37" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <rect x="3" y="3" width="34" height="34" rx="4" fill="none" stroke="rgba(254,240,138,0.28)" strokeWidth="1.2" />
      </svg>
    );
  }
  if (biome === 'cyber_city') {
    return (
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <path d="M2 10 H8 L12 6 M38 30 H32 L28 34" stroke="#67e8f9" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.82" />
        <circle cx="12" cy="6" r="1.5" fill="#ecfeff" opacity="0.9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <circle cx="9" cy="9" r="1.5" fill="#fff" opacity="0.9" />
      <circle cx="31" cy="13" r="1.2" fill="#e0e7ff" opacity="0.8" />
      <circle cx="28" cy="30" r="1.6" fill="#fde047" opacity="0.8" />
    </svg>
  );
};

export const CubeTile: React.FC<CubeTileProps> = ({
  cell,
  theme = 'classic',
  biome,
  hintSpecial,
  highlighted,
  onClick
}) => {
  const Tag = onClick ? 'button' : 'div';
  const biomeFrame = getBiomeTileFrameClass(biome);

  if (cell.obstacle === 'crate') {
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[10px] bg-gradient-to-b from-[#d89347] via-[#a96320] to-[#6b390c] border-2 border-[#421f04] shadow-[inset_0_2px_0_rgba(255,228,176,0.55),inset_0_-4px_0_rgba(40,16,0,0.6),0_3px_5px_rgba(0,0,0,0.3)] relative flex items-center justify-center transition-transform active:scale-90 overflow-hidden ${
          highlighted ? 'ring-2 ring-amber-200 brightness-115 scale-[1.05]' : ''
        }`}
      >
        {/* Horizontal wood plank seams */}
        <div className="absolute inset-x-0 top-1/3 h-[1px] bg-[#522706]/55" />
        <div className="absolute inset-x-0 bottom-1/3 h-[1px] bg-[#522706]/55" />
        <div className="w-[74%] h-[74%] rounded-[5px] border-2 border-[#542908] bg-gradient-to-br from-[#be7832] to-[#874c16] shadow-inner relative flex items-center justify-center">
          <div className="w-[115%] h-[3.5px] bg-[#5c2e09] rotate-45 rounded-full shadow" />
          <div className="w-[115%] h-[3.5px] bg-[#5c2e09] -rotate-45 rounded-full absolute shadow" />
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#fff2b2] to-[#d99126] border border-[#5e2f08] absolute top-0.5 left-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#fff2b2] to-[#d99126] border border-[#5e2f08] absolute top-0.5 right-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#fff2b2] to-[#d99126] border border-[#5e2f08] absolute bottom-0.5 left-0.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-[#fff2b2] to-[#d99126] border border-[#5e2f08] absolute bottom-0.5 right-0.5" />
        </div>
      </Tag>
    );
  }

  if (cell.obstacle === 'stone') {
    const isCracked = (cell.obstacleHp ?? 2) <= 1;
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[10px] ${
          isCracked
            ? 'bg-gradient-to-b from-[#a8a29e] via-[#57534e] to-[#292524] border-2 border-[#ea580c]'
            : 'bg-gradient-to-b from-[#78716c] via-[#44403c] to-[#1c1917] border-2 border-[#0c0a09]'
        } shadow-[inset_0_2px_0_rgba(255,255,255,0.32),inset_0_-4px_0_rgba(0,0,0,0.65),0_3px_6px_rgba(0,0,0,0.4)] relative flex items-center justify-center transition-transform active:scale-90 overflow-hidden ${
          highlighted ? 'ring-2 ring-orange-300 brightness-115 scale-[1.05]' : ''
        }`}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full pointer-events-none">
          <rect x="5" y="5" width="30" height="30" rx="5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          {isCracked ? (
            <>
              <path
                d="M11 6 L18 16 L13 24 L23 34 M29 9 L21 19 L27 28"
                stroke="#fb923c"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 6 L18 16 L13 24 L23 34"
                stroke="#fef08a"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <polygon points="20,9 30,15 30,26 20,32 10,26 10,15" fill="#292524" stroke="#a8a29e" strokeWidth="1.8" />
              <circle cx="20" cy="20.5" r="3.2" fill="#d6d3d1" />
            </>
          )}
        </svg>
        <span
          className={`absolute bottom-0.5 right-0.5 px-1 rounded text-[8px] font-black leading-tight border ${
            isCracked
              ? 'bg-orange-500 text-white border-amber-200'
              : 'bg-stone-900/90 text-stone-200 border-stone-500'
          }`}
        >
          {isCracked ? '1' : '2'}
        </span>
      </Tag>
    );
  }

  if (cell.obstacle === 'spark') {
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[10px] bg-gradient-to-b from-[#22d3ee] via-[#0284c7] to-[#1e1b4b] border-2 border-[#a5f3fc] shadow-[inset_0_2px_0_rgba(236,254,255,0.75),0_0_10px_rgba(34,211,238,0.55)] relative flex items-center justify-center transition-transform active:scale-90 overflow-hidden animate-pulse-soft ${
          highlighted ? 'ring-2 ring-white scale-[1.06]' : ''
        }`}
      >
        <svg viewBox="0 0 36 36" className="w-[82%] h-[82%] drop-shadow">
          <path d="M20 4 L9 20 H17 L15 32 L27 16 H19 Z" fill="#fef08a" stroke="#083344" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </Tag>
    );
  }

  if (cell.obstacle === 'ember') {
    const countdown = cell.emberMovesLeft ?? 4;
    const urgent = countdown <= 1;
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[10px] bg-gradient-to-b from-[#ff7b3b] via-[#b91c1c] to-[#450a0a] border-2 ${
          urgent ? 'border-yellow-300 animate-pulse ring-2 ring-amber-300' : 'border-[#fb923c]'
        } shadow-[inset_0_2px_0_rgba(255,237,213,0.55),0_0_10px_rgba(249,115,22,0.55)] relative flex items-center justify-center transition-transform active:scale-90 overflow-hidden ${
          highlighted ? 'ring-2 ring-white scale-[1.06]' : ''
        }`}
      >
        <svg viewBox="0 0 36 36" className="w-[78%] h-[78%] drop-shadow">
          <path
            d="M18 4 C23 11 28 15 27 23 A9 9 0 0 1 9 23 C8 16 14 12 15 7 C16 10 18 11 18 4 Z"
            fill="#fde047"
            stroke="#7c2d12"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M18 16 C21 20 22 24 18 28 C14 24 15 20 18 16 Z" fill="#f97316" />
        </svg>
        <span
          className={`absolute top-0.5 right-0.5 min-w-[14px] px-1 rounded-full text-[9px] font-black text-center leading-tight border ${
            urgent
              ? 'bg-red-600 text-white border-yellow-200'
              : 'bg-black/80 text-amber-200 border-orange-400/70'
          }`}
        >
          {countdown}
        </span>
      </Tag>
    );
  }

  if (cell.obstacle === 'prism') {
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[10px] bg-gradient-to-br from-[#67e8f9] via-[#c084fc] to-[#2563eb] border-2 border-[#f0abfc] shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_0_10px_rgba(192,132,252,0.6)] relative flex items-center justify-center transition-transform active:scale-90 overflow-hidden ${
          highlighted ? 'ring-2 ring-white scale-[1.06]' : ''
        }`}
      >
        <svg viewBox="0 0 36 36" className="w-[82%] h-[82%] drop-shadow">
          <polygon points="18,4 30,15 18,32 6,15" fill="rgba(255,255,255,0.28)" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" />
          <polygon points="18,4 23,15 18,32 13,15" fill="rgba(255,255,255,0.35)" />
          <line x1="6" y1="15" x2="30" y2="15" stroke="#fff" strokeWidth="1.4" opacity="0.85" />
        </svg>
      </Tag>
    );
  }

  if (cell.obstacle === 'boss') {
    const cornerRadius =
      cell.bossCorner === 'tl'
        ? 'rounded-tl-[12px]'
        : cell.bossCorner === 'tr'
        ? 'rounded-tr-[12px]'
        : cell.bossCorner === 'bl'
        ? 'rounded-bl-[12px]'
        : 'rounded-br-[12px]';
    const cracked = (cell.obstacleHp ?? 4) <= Math.ceil((cell.bossMaxHp ?? 4) / 2);
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full ${cornerRadius} ${
          cracked
            ? 'bg-gradient-to-br from-[#f59e0b] via-[#b45309] to-[#451a03] border-[#fde047]'
            : 'bg-gradient-to-br from-[#7e22ce] via-[#4c1d95] to-[#1e1b4b] border-[#fbbf24]'
        } border relative flex items-center justify-center shadow-[inset_0_2px_0_rgba(255,255,255,0.35)] overflow-hidden ${
          highlighted ? 'brightness-125 ring-2 ring-yellow-300' : ''
        }`}
      >
        <div className="w-[70%] h-[70%] rounded border border-amber-300/35 bg-black/15" />
      </Tag>
    );
  }

  if (cell.special) {
    const specialKind =
      cell.special === 'disco' ? 'disco' : cell.special === 'bomb' ? 'bomb' : 'rocket';
    const bgClass =
      cell.special === 'disco'
        ? 'from-[#632da8] via-[#341761] to-[#1a0936] border-[#c084fc]'
        : cell.special === 'bomb'
        ? 'from-[#64748b] via-[#1e293b] to-[#090d16] border-[#fbbf24]'
        : 'from-[#fef08a] via-[#f59e0b] to-[#9a3412] border-[#78350f]';

    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full h-full rounded-[11px] bg-gradient-to-b ${bgClass} border-2 shadow-[inset_0_2.5px_0_rgba(255,255,255,0.6),inset_0_-3px_0_rgba(0,0,0,0.45),0_4px_8px_rgba(0,0,0,0.42)] flex items-center justify-center relative transition-transform active:scale-90 animate-pulse-soft overflow-hidden ${
          highlighted ? 'ring-2 ring-white scale-[1.06]' : ''
        }`}
      >
        <div className="w-[82%] h-[82%] rounded-[7px] bg-black/15 border border-white/25 flex items-center justify-center">
          <BoosterIcon type={specialKind} className="w-[88%] h-[88%] drop-shadow" />
        </div>
        {cell.special === 'rocket_v' && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 absolute bottom-0.5 right-0.5 text-white drop-shadow">
            <path d="M6 1L9 4H7V8H9L6 11L3 8H5V4H3L6 1Z" fill="currentColor" />
          </svg>
        )}
        {cell.special === 'rocket_h' && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 absolute bottom-0.5 right-0.5 text-white drop-shadow">
            <path d="M1 6L4 3V5H8V3L11 6L8 9V7H4V9L1 6Z" fill="currentColor" />
          </svg>
        )}
      </Tag>
    );
  }

  const color = cell.color || 'blue';
  const pal = CUBE_PALETTE[color];

  const outerRadius =
    theme === 'candy' ? 'rounded-[14px]' : theme === 'crystal' ? 'rounded-[8px]' : 'rounded-[10px]';
  const innerRadius =
    theme === 'candy' ? 'rounded-[10px]' : theme === 'crystal' ? 'rounded-[5px]' : 'rounded-[6px]';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full h-full ${outerRadius} ${
        theme === 'dojo'
          ? 'bg-gradient-to-b from-[#4d2409] to-[#260f02] border-2 border-[#fbbf24] p-[3px] shadow-[inset_0_1px_0_rgba(255,245,190,0.7),0_3px_5px_rgba(0,0,0,0.38)]'
          : `bg-gradient-to-b ${pal.bg} border-2 ${pal.border} ${pal.lip} p-[3px]`
      } ${biomeFrame} flex items-center justify-center relative transition-all duration-100 active:scale-90 overflow-hidden ${
        highlighted ? 'ring-2 ring-[#fff7a8] brightness-125 scale-[1.06]' : ''
      }`}
    >
      {/* Sculpted Inner Pocket / Gem Core */}
      <div
        className={`w-full h-full ${innerRadius} bg-gradient-to-b ${pal.inner} relative flex items-center justify-center overflow-hidden ${
          theme === 'dojo'
            ? 'border border-[#ffe27a]/65 shadow-[inset_0_2px_3px_rgba(255,255,255,0.45)]'
            : 'border-t border-white/45 border-b border-black/25 shadow-[inset_0_1px_3px_rgba(255,255,255,0.35)]'
        }`}
      >
        <BiomeTileOverlay biome={biome} />
        {biome && biome !== 'forest' && (
          <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none animate-tile-shimmer" />
        )}
        {/* Top Specular Gloss Arc */}
        {theme === 'candy' ? (
          <>
            <span className="absolute top-1 left-1.5 right-1.5 h-[36%] rounded-full bg-gradient-to-b from-white/70 to-white/5 pointer-events-none" />
            <span className="absolute top-1.5 left-2 w-2 h-1 rounded-full bg-white/95 -rotate-12 pointer-events-none" />
          </>
        ) : theme === 'crystal' ? (
          <svg
            viewBox="0 0 40 40"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 40,0 31,9 9,9" fill="rgba(255,255,255,0.42)" />
            <polygon points="0,0 9,9 9,31 0,40" fill="rgba(255,255,255,0.22)" />
            <polygon points="40,0 40,40 31,31 31,9" fill="rgba(0,0,0,0.16)" />
            <polygon points="9,31 31,31 40,40 0,40" fill="rgba(0,0,0,0.28)" />
            <rect
              x="9"
              y="9"
              width="22"
              height="22"
              rx="2"
              fill="none"
              stroke="rgba(255,255,255,0.52)"
              strokeWidth="1.2"
            />
            <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.9)" />
          </svg>
        ) : (
          <span className="absolute top-0.5 left-1 right-1 h-[34%] rounded-full bg-gradient-to-b from-white/55 to-transparent pointer-events-none" />
        )}

        {/* Dojo Etched Corner Gold Rivets */}
        {theme === 'dojo' && (
          <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M2 9V2H9M31 2H38V9M2 31V38H9M31 38H38V31" stroke="#fde047" strokeWidth="2.2" fill="none" />
          </svg>
        )}

        {/* Centered Sculpted Emblem OR Hint Special */}
        {hintSpecial && !cell.obstacle ? (
          <div className="relative z-10 w-[78%] h-[78%] rounded-md bg-white/30 border border-white/70 flex items-center justify-center shadow-inner animate-pulse">
            <BoosterIcon
              type={hintSpecial === 'disco' ? 'disco' : hintSpecial === 'bomb' ? 'bomb' : 'rocket'}
              className="w-[86%] h-[86%] drop-shadow"
            />
          </div>
        ) : (
          <CubeEmblem color={color} className={`w-[58%] h-[58%] relative z-10 ${pal.emboss}`} />
        )}
      </div>

      {/* Multi-faceted Frozen Crystal Ice Overlay */}
      {cell.obstacle === 'ice' && (
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="8"
            fill="rgba(186,230,253,0.48)"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="2.5"
          />
          <polygon points="2,2 22,2 2,22" fill="rgba(255,255,255,0.36)" />
          <path d="M8 9L17 17L13 24M29 10L22 19L28 29" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </Tag>
  );
};
