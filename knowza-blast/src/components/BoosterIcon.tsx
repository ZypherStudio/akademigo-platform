import React from 'react';
import { InventoryBooster } from '../types/game';

interface BoosterIconProps {
  type: InventoryBooster;
  className?: string;
}

export const BoosterIcon: React.FC<BoosterIconProps> = ({ type, className = 'w-10 h-10' }) => {
  if (type === 'hammer') {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <defs>
          <linearGradient id="hmBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ec5ff" />
            <stop offset="50%" stopColor="#267cf4" />
            <stop offset="100%" stopColor="#1445a8" />
          </linearGradient>
          <linearGradient id="hmRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff756b" />
            <stop offset="100%" stopColor="#c81e1e" />
          </linearGradient>
          <linearGradient id="hmWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe082" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <g transform="rotate(-35 32 32)">
          <rect x="27" y="24" width="10" height="33" rx="5" fill="url(#hmWood)" stroke="#6e3508" strokeWidth="2.2" />
          <rect x="29" y="27" width="3" height="26" rx="1.5" fill="rgba(255,255,255,0.45)" />
          <rect x="13" y="10" width="38" height="18" rx="6" fill="url(#hmBlue)" stroke="#163578" strokeWidth="2.2" />
          <rect x="9" y="12" width="8" height="14" rx="3.5" fill="url(#hmRed)" stroke="#7f1d1d" strokeWidth="2" />
          <rect x="47" y="12" width="8" height="14" rx="3.5" fill="url(#hmRed)" stroke="#7f1d1d" strokeWidth="2" />
          <ellipse cx="32" cy="14" rx="13" ry="3" fill="rgba(255,255,255,0.5)" />
        </g>
      </svg>
    );
  }

  if (type === 'rocket') {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <defs>
          <linearGradient id="rkWhite" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="rkTip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#c81e1e" />
          </linearGradient>
          <linearGradient id="rkFin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <g transform="rotate(42 32 32)">
          <path d="M26 48 L32 61 L38 48 Z" fill="#fde047" stroke="#ea580c" strokeWidth="1.5" />
          <path d="M29 48 L32 56 L35 48 Z" fill="#fff7ae" />
          <path d="M21 34 L11 46 L23 44 Z" fill="url(#rkFin)" stroke="#1e3a8a" strokeWidth="2" />
          <path d="M43 34 L53 46 L41 44 Z" fill="url(#rkFin)" stroke="#1e3a8a" strokeWidth="2" />
          <path d="M32 6 C41 14 43 26 42 46 L22 46 C21 26 23 14 32 6 Z" fill="url(#rkWhite)" stroke="#475569" strokeWidth="2.2" />
          <path d="M32 6 C37 11 39 16 40 20 L24 20 C25 16 27 11 32 6 Z" fill="url(#rkTip)" stroke="#7f1d1d" strokeWidth="1.8" />
          <circle cx="32" cy="29" r="6.5" fill="#38bdf8" stroke="#1e40af" strokeWidth="2.4" />
          <circle cx="30" cy="27" r="2.2" fill="white" opacity="0.9" />
        </g>
      </svg>
    );
  }

  if (type === 'bomb') {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <defs>
          <radialGradient id="bmBody" cx="35%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="45%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>
        <path d="M38 18 C42 10 49 10 52 14" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M53 6 L55 11.5 L61 11 L56.5 15 L59.5 20 L54 17.5 L49.5 20.5 L51 15 L46.5 11.5 L52 11.5 Z" fill="#fde047" stroke="#ea580c" strokeWidth="1" />
        <rect x="25" y="14" width="13" height="7" rx="2.5" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
        <circle cx="30" cy="37" r="20" fill="url(#bmBody)" stroke="#0f172a" strokeWidth="2.4" />
        <ellipse cx="22" cy="28" rx="6.5" ry="3.5" transform="rotate(-30 22 28)" fill="rgba(255,255,255,0.45)" />
        <circle cx="30" cy="37" r="7.5" fill="#fbbf24" opacity="0.95" />
        <path d="M30 31.5 L31.7 35.1 L35.6 35.7 L32.8 38.4 L33.5 42.2 L30 40.4 L26.5 42.2 L27.2 38.4 L24.4 35.7 L28.3 35.1 Z" fill="#92400e" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <defs>
        <linearGradient id="dcBall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="75%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" fill="url(#dcBall)" stroke="#5b21b6" strokeWidth="2.4" />
      <path d="M11 32 H53 M15 21 H49 M15 43 H49 M32 10 V54 M21 13 Q26 32 21 51 M43 13 Q38 32 43 51" stroke="rgba(255,255,255,0.52)" strokeWidth="1.8" />
      <ellipse cx="23" cy="21" rx="7.5" ry="4" transform="rotate(-25 23 21)" fill="rgba(255,255,255,0.72)" />
      <circle cx="44" cy="40" r="3" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
};
