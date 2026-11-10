import React from 'react';
import { HariboCostume } from '../types';

interface HariboAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: HariboCostume;
}

export const HariboAvatar: React.FC<HariboAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false,
  costume = 'classic'
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const animationClass = 
    animate === 'dance' || costume === 'party' 
      ? 'animate-dance' 
      : animate === 'wiggle'
      ? 'animate-wiggle'
      : animate === true || animate === 'bounce'
      ? 'animate-bounceSubtle'
      : '';

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${sizeMap[size]} ${animationClass} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm overflow-visible">
        {/* Left Ear */}
        <circle cx="28" cy="28" r="14" fill="#d97706" />
        <circle cx="28" cy="28" r="12.5" fill="#facc15" />
        <circle cx="28" cy="28" r="7" fill="#fef08a" />

        {/* Right Ear */}
        <circle cx="72" cy="28" r="14" fill="#d97706" />
        <circle cx="72" cy="28" r="12.5" fill="#facc15" />
        <circle cx="72" cy="28" r="7" fill="#fef08a" />

        {/* Head Outer Shadow / Border */}
        <circle cx="50" cy="54" r="32" fill="#d97706" />
        {/* Head Base (Golden Yellow) */}
        <circle cx="50" cy="53" r="30.5" fill="#facc15" />

        {/* Forehead Gloss Highlight */}
        <ellipse cx="42" cy="38" rx="10" ry="5" fill="#ffffff" opacity="0.45" transform="rotate(-15 42 38)" />

        {/* Rosy Glowing Cheeks */}
        <ellipse cx="27" cy="58" rx="5" ry="3.5" fill="#fb7185" opacity="0.75" />
        <ellipse cx="73" cy="58" rx="5" ry="3.5" fill="#fb7185" opacity="0.75" />

        {/* Creamy Snout / Muzzle */}
        <ellipse cx="50" cy="62" rx="16" ry="12" fill="#fef08a" />

        {/* Black Glossy Nose */}
        <path d="M 45 56 Q 50 59 55 56 Q 50 63 45 56 Z" fill="#18181b" />
        <circle cx="48" cy="57" r="1.2" fill="#ffffff" />

        {/* Cute Smiling Mouth with Pink Tongue */}
        <path d="M 44 63 Q 50 71 56 63" fill="#881337" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 46 66 Q 50 71 54 66" fill="#f43f5e" />

        {/* Sparkly Cartoon Eyes (Hidden if cyber visor is on) */}
        {costume !== 'cyber' && costume !== 'party' && (
          <>
            {/* Left Eye */}
            <circle cx="37" cy="48" r="5.5" fill="#18181b" />
            <circle cx="35" cy="46" r="2.2" fill="#ffffff" />
            <circle cx="39" cy="50" r="1" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="63" cy="48" r="5.5" fill="#18181b" />
            <circle cx="61" cy="46" r="2.2" fill="#ffffff" />
            <circle cx="65" cy="50" r="1" fill="#ffffff" />
          </>
        )}

        {/* ================= SPECIAL COSTUME ACCESSORIES ================= */}

        {/* 1. KING HARIBO (Crown & Jewels) */}
        {costume === 'king' && (
          <g transform="translate(50, 23)">
            <polygon points="-16,4 -17,-10 -9,-3 0,-12 9,-3 17,-10 16,4" fill="#f59e0b" stroke="#b45309" strokeWidth="1.2" />
            {/* Crown Gemstones */}
            <circle cx="0" cy="-2" r="2.2" fill="#ef4444" />
            <circle cx="-9" cy="0" r="1.8" fill="#3b82f6" />
            <circle cx="9" cy="0" r="1.8" fill="#3b82f6" />
            <circle cx="-17" cy="-10" r="1.6" fill="#fef08a" />
            <circle cx="0" cy="-12" r="2" fill="#fef08a" />
            <circle cx="17" cy="-10" r="1.6" fill="#fef08a" />
          </g>
        )}

        {/* 2. CYBERPUNK HARIBO (Glowing Neon Cyan Visor & Headset) */}
        {costume === 'cyber' && (
          <g transform="translate(50, 48)">
            <path d="M -26 -7 L 26 -7 Q 28 4 23 9 L -23 9 Q -28 4 -26 -7 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.2" opacity="0.95" />
            <line x1="-20" y1="1" x2="20" y2="1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="-25" cy="1" r="3" fill="#6366f1" />
            <circle cx="25" cy="1" r="3" fill="#6366f1" />
            {/* Cyber Antenna */}
            <line x1="25" y1="1" x2="33" y2="-10" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="33" cy="-10" r="2.5" fill="#ec4899" />
          </g>
        )}

        {/* 3. PARTY DANCER HARIBO (Disco Star Glasses & Party Cone Hat) */}
        {costume === 'party' && (
          <g transform="translate(50, 48)">
            {/* Star left glass */}
            <polygon points="-12,-7 -9,-1 -2,-1 -7,4 -5,10 -12,6 -19,10 -17,4 -22,-1 -15,-1" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
            {/* Star right glass */}
            <polygon points="12,-7 15,-1 22,-1 17,4 19,10 12,6 5,10 7,4 2,-1 9,-1" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1" />
            <line x1="-5" y1="1" x2="5" y2="1" stroke="#f43f5e" strokeWidth="2" />
            {/* Mini Party Cone Hat */}
            <g transform="translate(-18, -26) rotate(-15)">
              <polygon points="0,0 -8,18 8,18" fill="#f43f5e" stroke="#e11d48" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="3" fill="#fef08a" />
              <line x1="-5" y1="10" x2="5" y2="10" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 4. GRADUATE HARIBO (Mortarboard Cap & Tassel) */}
        {costume === 'graduate' && (
          <g transform="translate(50, 23)">
            <polygon points="0,-12 -24,-2 0,7 24,-2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
            <polygon points="-10,0 10,0 7,7 -7,7" fill="#27272a" />
            <circle cx="0" cy="-2" r="2" fill="#f59e0b" />
            {/* Golden Tassel */}
            <path d="M 0 -2 Q 13 2 16 11" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
            <rect x="14" y="11" width="4" height="6" fill="#f59e0b" rx="1" />
          </g>
        )}

        {/* 5. COSMIC ASTRONAUT HARIBO (Space Helmet & Bubble Reflection) */}
        {costume === 'astronaut' && (
          <g transform="translate(50, 52)">
            <circle cx="0" cy="0" r="37" fill="none" stroke="#0284c7" strokeWidth="2.5" opacity="0.9" />
            <ellipse cx="-13" cy="-14" rx="9" ry="4" fill="#ffffff" opacity="0.55" transform="rotate(-30 -13 -14)" />
            {/* Communication Mic */}
            <path d="M -25 11 Q -21 23 -9 23" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            <circle cx="-9" cy="23" r="2.5" fill="#0284c7" />
          </g>
        )}

        {/* Signature Haribo Red Bowtie */}
        <g transform="translate(50, 83) scale(0.95)">
          {/* Left Wing */}
          <polygon points="-2,0 -14,-7 -13,7" fill={costume === 'cyber' ? '#06b6d4' : '#ef4444'} stroke={costume === 'cyber' ? '#0891b2' : '#b91c1c'} strokeWidth="1" />
          {/* Right Wing */}
          <polygon points="2,0 14,-7 13,7" fill={costume === 'cyber' ? '#06b6d4' : '#ef4444'} stroke={costume === 'cyber' ? '#0891b2' : '#b91c1c'} strokeWidth="1" />
          {/* Center Knot */}
          <circle cx="0" cy="0" r="3.5" fill={costume === 'cyber' ? '#0891b2' : '#dc2626'} />
          <circle cx="-0.8" cy="-0.8" r="1.2" fill={costume === 'cyber' ? '#a5f3fc' : '#fca5a5'} />
        </g>
      </svg>
    </div>
  );
};
