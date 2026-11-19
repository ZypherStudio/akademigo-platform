import React from 'react';
import { AccessoryId, OutfitId } from '../types/game';
import { assetUrl } from '../utils/assets';

interface KnowzaSpriteProps {
  pose: 'portrait' | 'peek' | 'flag';
  outfit?: OutfitId;
  accessory?: AccessoryId;
  className?: string;
  alt?: string;
}

export const KnowzaSprite: React.FC<KnowzaSpriteProps> = ({
  pose,
  outfit = 'classic',
  accessory = 'none',
  className = 'w-full h-full object-contain',
  alt = 'Knowza'
}) => {
  const src = assetUrl(`assets/outfits/${pose}_${outfit}.png`);

  // Pose-aware positioning for accessories so crown/bandana/visor align cleanly
  const visorPos =
    pose === 'peek'
      ? 'top-[41%] left-[31%] w-[50%] -rotate-[12deg]'
      : pose === 'flag'
      ? 'top-[36%] left-[19%] w-[40%] -rotate-[8deg]'
      : 'top-[36%] left-[21%] w-[54%] -rotate-[10deg]';

  const bandanaPos =
    pose === 'peek'
      ? 'top-[28%] left-[20%] w-[58%] -rotate-[16deg]'
      : pose === 'flag'
      ? 'top-[22%] left-[14%] w-[46%] -rotate-[14deg]'
      : 'top-[21%] left-[18%] w-[56%] -rotate-[12deg]';

  const crownPos =
    pose === 'peek'
      ? '-top-[4%] left-[22%] w-[46%] -rotate-[16deg]'
      : pose === 'flag'
      ? '-top-[6%] left-[15%] w-[38%] -rotate-[14deg]'
      : '-top-[5%] left-[23%] w-[46%] -rotate-[12deg]';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img src={src} alt={alt} className={className} />

      {/* Karate Dojo Red Headband */}
      {accessory === 'bandana' && (
        <svg viewBox="0 0 120 34" className={`absolute pointer-events-none drop-shadow ${bandanaPos}`} fill="none">
          <path d="M8 18 Q60 6 112 18 L110 28 Q60 16 10 28 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.5" />
          <path d="M18 19 Q60 10 102 19" stroke="#fca5a5" strokeWidth="2" opacity="0.65" />
          <circle cx="96" cy="21" r="5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          <path d="M99 22 L117 31 L112 34 L96 24 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
        </svg>
      )}

      {/* Royal Golden Crown */}
      {accessory === 'crown' && (
        <svg viewBox="0 0 100 54" className={`absolute pointer-events-none drop-shadow-md ${crownPos}`} fill="none">
          <path
            d="M12 44 L8 16 L32 30 L50 8 L68 30 L92 16 L88 44 Z"
            fill="url(#crGold)"
            stroke="#78350f"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="crGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <rect x="12" y="40" width="76" height="9" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="50" cy="28" r="5.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
          <circle cx="30" cy="36" r="3.5" fill="#38bdf8" />
          <circle cx="70" cy="36" r="3.5" fill="#38bdf8" />
        </svg>
      )}

      {/* Cyber Neon Visor */}
      {accessory === 'visor' && (
        <svg viewBox="0 0 120 44" className={`absolute pointer-events-none drop-shadow-[0_0_8px_rgba(34,211,238,0.75)] ${visorPos}`} fill="none">
          <path
            d="M8 10 Q60 4 112 10 L106 32 Q80 38 66 26 Q60 22 54 26 Q40 38 14 32 Z"
            fill="rgba(6, 182, 212, 0.52)"
            stroke="#67e8f9"
            strokeWidth="3"
          />
          <path d="M18 15 L44 13 M76 13 L102 15" stroke="#ecfeff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        </svg>
      )}
    </div>
  );
};
