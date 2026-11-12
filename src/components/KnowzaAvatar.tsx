import React from 'react';
import { KnowzaCostume, AvatarFrameId, CustomBearConfig } from '../types';
import { getFrame } from '../data/framesData';

export interface KnowzaAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: KnowzaCostume;
  frameId?: AvatarFrameId;
  showFrameGlow?: boolean;
  customBear?: CustomBearConfig;
  fallbackImage?: boolean;
}

/** Helper to derive default modular bear configuration from a costume */
export function getBearConfigFromCostume(costume: KnowzaCostume = 'classic', customBear?: CustomBearConfig): CustomBearConfig {
  if (customBear) return customBear;

  switch (costume) {
    case 'king':
      return {
        furColor: 'kraliyet_altini',
        headwear: 'royal_crown',
        eyewear: 'none',
        outfit: 'royal_cape',
        heldItem: 'trophy',
      };
    case 'cyber':
      return {
        furColor: 'siber_neon',
        headwear: 'cyber_visor',
        eyewear: 'neon_visor',
        outfit: 'cyber_suit',
        heldItem: 'wand',
      };
    case 'party':
      return {
        furColor: 'pembe_seker',
        headwear: 'party_hat',
        eyewear: 'star_glasses',
        outfit: 'tuxedo',
        heldItem: 'torch',
      };
    case 'graduate':
      return {
        furColor: 'kar_beyazi',
        headwear: 'graduate_cap',
        eyewear: 'professor',
        outfit: 'graduate_robe',
        heldItem: 'diploma',
      };
    case 'astronaut':
      return {
        furColor: 'kar_beyazi',
        headwear: 'astronaut_helmet',
        eyewear: 'none',
        outfit: 'space_suit',
        heldItem: 'torch',
      };
    case 'classic':
    default:
      return {
        furColor: 'bal_sarisi',
        headwear: 'graduate_cap',
        eyewear: 'none',
        outfit: 'hoodie',
        heldItem: 'book',
      };
  }
}

/**
 * High-Quality Modular 3D Knowza Bear Model SVG
 * Renders dynamic fur colors, headwear, eyewear, outfits, and held accessories!
 */
export const KnowzaBearModel: React.FC<{
  config: CustomBearConfig;
  size: number;
}> = ({ config, size }) => {
  const { furColor, headwear, eyewear, outfit, heldItem } = config;

  // Fur palettes: [body, light/tummy, shadow, innerEar]
  const furPalette = {
    bal_sarisi:     ['#FFB800', '#FFE699', '#D99000', '#FFA07A'],
    kar_beyazi:     ['#F1F5F9', '#FFFFFF', '#CBD5E1', '#FBCFE8'],
    cikolata:       ['#78350F', '#B45309', '#451A03', '#D97706'],
    gece_siyahi:    ['#262626', '#404040', '#171717', '#525252'],
    pembe_seker:    ['#F472B6', '#FBCFE8', '#DB2777', '#FDA4AF'],
    siber_neon:     ['#06B6D4', '#A5F3FC', '#0891B2', '#38BDF8'],
    kraliyet_altini:['#F59E0B', '#FEF3C7', '#B45309', '#FCD34D'],
  }[furColor] || ['#FFB800', '#FFE699', '#D99000', '#FFA07A'];

  const [bodyColor, lightColor, shadowColor, innerEarColor] = furPalette;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="w-full h-full select-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Soft Background Radial */}
        <radialGradient id={`bg-${size}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF9E6" />
          <stop offset="100%" stopColor="#FFE082" />
        </radialGradient>
        {/* Fur 3D Gradient */}
        <linearGradient id={`fur-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="40%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={shadowColor} />
        </linearGradient>
        {/* Gold Crown Gradient */}
        <linearGradient id={`gold-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Circular Avatar Backdrop */}
      <circle cx="50" cy="50" r="48" fill={`url(#bg-${size})`} />

      {/* ─── EARS ─── */}
      {/* Left Ear */}
      <circle cx="27" cy="28" r="14" fill={`url(#fur-${size})`} />
      <circle cx="27" cy="28" r="8" fill={innerEarColor} opacity="0.85" />
      {/* Right Ear */}
      <circle cx="73" cy="28" r="14" fill={`url(#fur-${size})`} />
      <circle cx="73" cy="28" r="8" fill={innerEarColor} opacity="0.85" />

      {/* ─── BODY & OUTFIT ─── */}
      {/* Base Body */}
      <path
        d="M26 88 C26 65, 74 65, 74 88 C74 95, 26 95, 26 88 Z"
        fill={`url(#fur-${size})`}
      />

      {/* Outfit Layer */}
      {outfit === 'hoodie' && (
        <g>
          <path d="M25 88 C25 68, 75 68, 75 88 Z" fill="#18181B" />
          <path d="M38 72 L50 82 L62 72 L50 67 Z" fill="#27272A" />
          {/* Gold 'K' Logo on Hoodie */}
          <text x="50" y="86" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFB800">
            K
          </text>
        </g>
      )}

      {outfit === 'royal_cape' && (
        <g>
          <path d="M22 88 C22 66, 78 66, 78 88 Z" fill="#991B1B" />
          {/* Gold Trim & Ruby Brooch */}
          <path d="M34 70 C44 76, 56 76, 66 70" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="74" r="3.5" fill="#DC2626" stroke="#FDE047" strokeWidth="1" />
        </g>
      )}

      {outfit === 'cyber_suit' && (
        <g>
          <path d="M24 88 C24 67, 76 67, 76 88 Z" fill="#0F172A" />
          {/* Neon Circuitry */}
          <path d="M35 84 L45 74 L55 74 L65 84" stroke="#06B6D4" strokeWidth="1.8" fill="none" />
          <circle cx="50" cy="74" r="2" fill="#22D3EE" />
        </g>
      )}

      {outfit === 'graduate_robe' && (
        <g>
          <path d="M24 88 C24 67, 76 67, 76 88 Z" fill="#1E1B4B" />
          {/* Gold Ribbon Sash */}
          <path d="M32 70 L48 88 L52 88 L68 70" stroke="#F59E0B" strokeWidth="3" fill="none" />
        </g>
      )}

      {outfit === 'space_suit' && (
        <g>
          <path d="M23 88 C23 66, 77 66, 77 88 Z" fill="#E2E8F0" />
          <rect x="42" y="76" width="16" height="8" rx="2" fill="#334155" />
          <circle cx="46" cy="80" r="1.5" fill="#38BDF8" />
          <circle cx="54" cy="80" r="1.5" fill="#22C55E" />
        </g>
      )}

      {outfit === 'tuxedo' && (
        <g>
          <path d="M24 88 C24 67, 76 67, 76 88 Z" fill="#18181B" />
          {/* White Shirt Collar */}
          <polygon points="42,70 58,70 50,82" fill="#FFFFFF" />
          {/* Red Bow Tie */}
          <polygon points="46,71 54,75 46,75" fill="#EF4444" />
          <polygon points="54,71 46,75 54,75" fill="#EF4444" />
          <circle cx="50" cy="73" r="1.5" fill="#B91C1C" />
        </g>
      )}

      {/* ─── HEAD & FACE ─── */}
      {/* Head Sphere */}
      <circle cx="50" cy="46" r="26" fill={`url(#fur-${size})`} />

      {/* Soft Rosy Blush Cheeks */}
      <ellipse cx="32" cy="51" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.65" />
      <ellipse cx="68" cy="51" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.65" />

      {/* Snout Area */}
      <ellipse cx="50" cy="51" rx="12" ry="9" fill={lightColor} />

      {/* Nose */}
      <path d="M47 46 C48 45, 52 45, 53 46 C54 48, 46 48, 47 46 Z" fill="#262626" />
      {/* Smiling Mouth */}
      <path d="M46 51 Q50 54 54 51" stroke="#262626" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* ─── EYES ─── */}
      {eyewear !== 'sunshades' && eyewear !== 'neon_visor' && (
        <g>
          {/* Left Eye */}
          <ellipse cx="38" cy="42" rx="4" ry="5" fill="#1C1917" />
          <circle cx="37" cy="40" r="1.6" fill="#FFFFFF" />
          <circle cx="40" cy="43.5" r="0.8" fill="#FFFFFF" />

          {/* Right Eye (Playful Wink or Big Eye) */}
          {headwear === 'royal_crown' || config.furColor === 'kraliyet_altini' ? (
            // Big Sparkling Eye
            <g>
              <ellipse cx="62" cy="42" rx="4" ry="5" fill="#1C1917" />
              <circle cx="61" cy="40" r="1.6" fill="#FFFFFF" />
              <circle cx="64" cy="43.5" r="0.8" fill="#FFFFFF" />
            </g>
          ) : (
            // Playful Cute Wink
            <path d="M58 43 Q62 40 66 43" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          )}
        </g>
      )}

      {/* ─── EYEWEAR ─── */}
      {eyewear === 'sunshades' && (
        <g>
          <path d="M30 40 L48 40 L45 47 L33 47 Z" fill="#09090B" />
          <path d="M52 40 L70 40 L67 47 L55 47 Z" fill="#09090B" />
          <rect x="47" y="41" width="6" height="2" fill="#27272A" />
          {/* White Glare Line */}
          <line x1="33" y1="41" x2="38" y2="46" stroke="#FFFFFF" strokeWidth="1" opacity="0.75" />
          <line x1="55" y1="41" x2="60" y2="46" stroke="#FFFFFF" strokeWidth="1" opacity="0.75" />
        </g>
      )}

      {eyewear === 'professor' && (
        <g>
          <circle cx="38" cy="42" r="6" fill="none" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="62" cy="42" r="6" fill="none" stroke="#D97706" strokeWidth="1.5" />
          <path d="M44 42 Q50 39 56 42" fill="none" stroke="#D97706" strokeWidth="1.5" />
        </g>
      )}

      {eyewear === 'neon_visor' && (
        <g>
          <rect x="28" y="38" width="44" height="8" rx="2" fill="#06B6D4" opacity="0.9" />
          <rect x="30" y="40" width="40" height="4" fill="#67E8F9" />
        </g>
      )}

      {eyewear === 'star_glasses' && (
        <g>
          <polygon points="38,36 40,41 45,41 41,44 43,49 38,46 33,49 35,44 31,41 36,41" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
          <polygon points="62,36 64,41 69,41 65,44 67,49 62,46 57,49 59,44 55,41 60,41" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
          <line x1="45" y1="42" x2="55" y2="42" stroke="#CA8A04" strokeWidth="1.5" />
        </g>
      )}

      {/* ─── HEADWEAR ─── */}
      {headwear === 'graduate_cap' && (
        <g transform="translate(0, -4)">
          {/* Diamond Cap */}
          <polygon points="50,12 80,21 50,28 20,21" fill="#18181B" />
          <polygon points="50,15 76,21 50,26 24,21" fill="#27272A" />
          {/* Cap Skull Under-band */}
          <path d="M36 24 C36 29, 64 29, 64 24" fill="#18181B" />
          {/* Gold Button & Tassel */}
          <circle cx="50" cy="20" r="2" fill="#FBBF24" />
          <path d="M50 20 Q64 22 66 31" stroke="#FBBF24" strokeWidth="1.8" fill="none" />
          <circle cx="66" cy="32" r="2" fill="#F59E0B" />
        </g>
      )}

      {headwear === 'royal_crown' && (
        <g transform="translate(0, -6)">
          {/* 3-Point Gold Crown */}
          <polygon
            points="32,24 30,12 42,18 50,8 58,18 70,12 68,24"
            fill={`url(#gold-${size})`}
            stroke="#B45309"
            strokeWidth="1"
          />
          {/* Gemstones */}
          <circle cx="50" cy="15" r="2.5" fill="#EF4444" />
          <circle cx="39" cy="18" r="1.8" fill="#10B981" />
          <circle cx="61" cy="18" r="1.8" fill="#3B82F6" />
        </g>
      )}

      {headwear === 'cyber_visor' && (
        <g>
          {/* High-tech Headband & Neon Earphones */}
          <path d="M22 36 C22 18, 78 18, 78 36" stroke="#06B6D4" strokeWidth="3" fill="none" />
          <rect x="18" y="32" width="8" height="12" rx="3" fill="#0891B2" stroke="#22D3EE" strokeWidth="1" />
          <rect x="74" y="32" width="8" height="12" rx="3" fill="#0891B2" stroke="#22D3EE" strokeWidth="1" />
        </g>
      )}

      {headwear === 'party_hat' && (
        <g transform="translate(0, -6)">
          <polygon points="50,4 62,24 38,24" fill="#F43F5E" />
          <path d="M42 16 L58 16" stroke="#FDE047" strokeWidth="2.5" />
          <circle cx="50" cy="4" r="3" fill="#FDE047" />
        </g>
      )}

      {headwear === 'astronaut_helmet' && (
        <g>
          <ellipse cx="50" cy="46" rx="32" ry="30" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
          {/* Glass Visor Dome Reflection */}
          <path d="M26 34 C36 24, 64 24, 74 34" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.8" />
        </g>
      )}

      {headwear === 'wizard_hat' && (
        <g transform="translate(0, -8)">
          <polygon points="50,2 66,26 34,26" fill="#7C3AED" />
          <ellipse cx="50" cy="26" rx="20" ry="4" fill="#6D28D9" />
          <text x="50" y="18" textAnchor="middle" fontSize="7" fill="#FDE047">★</text>
        </g>
      )}

      {headwear === 'beanie' && (
        <g transform="translate(0, -4)">
          <path d="M30 24 C30 14, 70 14, 70 24 Z" fill="#DC2626" />
          <rect x="28" y="22" width="44" height="6" rx="2" fill="#F8FAFC" />
          <circle cx="50" cy="12" r="3.5" fill="#F8FAFC" />
        </g>
      )}

      {/* ─── HELD ITEM ─── */}
      {heldItem === 'book' && (
        <g transform="translate(56, 68)">
          <rect x="0" y="0" width="16" height="20" rx="2" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1" />
          <rect x="2" y="2" width="12" height="16" rx="1" fill="#6D28D9" />
          <text x="8" y="13" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFB800">
            K
          </text>
        </g>
      )}

      {heldItem === 'trophy' && (
        <g transform="translate(58, 64)">
          <path d="M2 2 L14 2 L12 10 Q8 14 8 16 L12 18 L4 18 L8 16 Q8 14 4 10 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
          <circle cx="8" cy="6" r="2" fill="#EF4444" />
        </g>
      )}

      {heldItem === 'diploma' && (
        <g transform="translate(56, 72) rotate(-20)">
          <rect x="0" y="0" width="18" height="6" rx="2" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.8" />
          <rect x="7" y="-1" width="3" height="8" rx="0.5" fill="#DC2626" />
        </g>
      )}

      {heldItem === 'torch' && (
        <g transform="translate(62, 62)">
          <polygon points="2,12 8,12 6,24 4,24" fill="#B45309" />
          <path d="M1 12 Q5 2 9 12 Q7 7 5 12 Z" fill="#F97316" />
          <path d="M3 12 Q5 6 7 12 Z" fill="#FDE047" />
        </g>
      )}

      {heldItem === 'wand' && (
        <g transform="translate(60, 64) rotate(-25)">
          <line x1="2" y1="20" x2="2" y2="2" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <polygon points="2,0 4,4 8,4 5,6 6,10 2,7 -2,10 -1,6 -4,4 0,4" fill="#FDE047" />
        </g>
      )}

      {/* Cute Little Paws */}
      <circle cx="34" cy="78" r="5" fill={`url(#fur-${size})`} />
      <circle cx="66" cy="78" r="5" fill={`url(#fur-${size})`} />
    </svg>
  );
};

/**
 * Discord Nitro-style Animated Avatar Decoration Overlays
 * Renders rich overflowing animated decor (crowns, moons, hearts, clouds, circuits)
 */
const AvatarFrameOverlay: React.FC<{
  frameId: AvatarFrameId;
  size: number;
}> = ({ frameId, size }) => {
  if (frameId === 'none') return null;
  const frame = getFrame(frameId);
  const r = size / 2;
  const strokeW = size < 36 ? 2.5 : size < 56 ? 3.5 : 4.5;

  /* ── 1. Discord Hilal Rüyaları (Ay Kurdu - Moon Reverie) ── */
  if (frameId === 'moon_reverie') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        {/* Cosmic Glowing Purple Ring */}
        <div
          className="absolute inset-1 rounded-full border-2 border-purple-400/80 shadow-[0_0_12px_rgba(192,132,252,0.6)] animate-pulse-aura"
        />

        {/* Crescent Moon at Top Left */}
        <div className="absolute -top-1.5 -left-1 text-base filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-bounceSubtle">
          🌙
        </div>

        {/* Orbiting Twinkling Stars */}
        <div className="absolute inset-0 animate-celestial-spin pointer-events-none">
          <span className="absolute top-0 right-1 text-[9px] text-amber-300">✦</span>
          <span className="absolute bottom-2 left-0 text-[8px] text-purple-200">★</span>
          <span className="absolute top-6 right-0 text-[7px] text-yellow-200">✨</span>
        </div>

        {/* Fluffy Night Clouds Hugging Bottom */}
        <div className="absolute -bottom-1.5 inset-x-0 flex justify-center items-center gap-0.5 animate-cloud-float">
          <div className="w-4 h-2.5 bg-gradient-to-t from-purple-200/95 to-white/90 rounded-full blur-[0.4px] shadow-xs" />
          <div className="w-6 h-3.5 bg-gradient-to-t from-purple-300/95 via-indigo-100 to-white rounded-full -mx-1 shadow-xs" />
          <div className="w-4 h-2.5 bg-gradient-to-t from-purple-200/95 to-white/90 rounded-full blur-[0.4px] shadow-xs" />
        </div>
      </div>
    );
  }

  /* ── 2. Discord Siber Savaşçı & Uçuşan Kalpler (Deadpool Hearts) ── */
  if (frameId === 'deadpool_hearts') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        {/* Red Armored Border */}
        <div
          className="absolute inset-1 rounded-full border-2 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.7)]"
        />

        {/* Angled Glowing Mask Eyes at Top */}
        <div className="absolute -top-1.5 inset-x-0 flex justify-center items-center gap-2">
          <div className="w-2.5 h-1 bg-white rounded-full rotate-[18deg] shadow-[0_0_6px_#fff]" />
          <div className="w-2.5 h-1 bg-white rounded-full -rotate-[18deg] shadow-[0_0_6px_#fff]" />
        </div>

        {/* Floating Pink Animated Hearts */}
        <span className="absolute -left-1 bottom-1 text-[11px] animate-float-hearts">
          💖
        </span>
        <span className="absolute -right-1 bottom-3 text-[10px] animate-float-hearts-delayed">
          💕
        </span>
        <span className="absolute left-1 top-2 text-[8px] animate-float-hearts">
          ❤️
        </span>
      </div>
    );
  }

  /* ── 3. Discord Eous Astronot Kaskı (Eous Helmet) ── */
  if (frameId === 'eous_astronaut') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        {/* Helmet Rim */}
        <div className="absolute inset-1 rounded-full border-2 border-slate-300/80 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />

        {/* Antenna / Ears at Top */}
        <div className="absolute -top-2 inset-x-0 flex justify-between px-2">
          <div className="w-2 h-3 bg-amber-500 rounded-t-full border border-white" />
          <div className="w-2 h-3 bg-amber-500 rounded-t-full border border-white" />
        </div>

        {/* Orange Base Collar Band '01.' */}
        <div className="absolute -bottom-1.5 bg-orange-600 text-white font-black text-[7px] px-2 py-0.5 rounded-full border border-white/60 shadow-xs">
          01. EOUS
        </div>
      </div>
    );
  }

  /* ── 4. Royal Crown (Gleaming Animated Gold Crown) ── */
  if (frameId === 'royal_crown') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
        {/* 3D Crown with Gleam Animation */}
        <div className="absolute -top-3 text-lg animate-crown-gleam">
          👑
        </div>
        <span className="absolute -bottom-1 text-[9px] text-amber-300">✨</span>
      </div>
    );
  }

  /* ── 5. Gold Flame & Dragon Fire (Rising Animated Flames) ── */
  if (frameId === 'gold_flame' || frameId === 'dragon_fire') {
    const isDragon = frameId === 'dragon_fire';
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div
          className={`absolute inset-1 rounded-full border-2 ${
            isDragon
              ? 'border-orange-500 shadow-[0_0_14px_rgba(234,88,12,0.7)]'
              : 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
          } animate-pulse-aura`}
        />
        <div className="absolute -top-2 text-sm animate-bounceSubtle">
          {isDragon ? '🐉' : '🔥'}
        </div>
        <div className="absolute -bottom-1 -right-1 text-xs">🔥</div>
      </div>
    );
  }

  /* ── 6. Lightning Bolt ── */
  if (frameId === 'lightning_bolt') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-dashed shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse" />
        <div className="absolute -top-1.5 -right-1 text-sm animate-bounceSubtle">
          ⚡
        </div>
      </div>
    );
  }

  /* ── 7. Cyber Neon ── */
  if (frameId === 'cyber_neon') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.8)]" />
        <div className="absolute -top-2 left-1 text-[9px] font-black text-cyan-300 bg-black/70 px-1 rounded">
          LED
        </div>
      </div>
    );
  }

  /* ── 8. Cosmic Stars ── */
  if (frameId === 'cosmic_stars') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.7)]" />
        <div className="absolute inset-0 animate-celestial-spin">
          <span className="absolute top-0 text-[10px] text-purple-300">🌌</span>
          <span className="absolute bottom-0 right-1 text-[8px] text-amber-200">★</span>
        </div>
      </div>
    );
  }

  /* ── 9. Blood Web ── */
  if (frameId === 'blood_web') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-rose-600 border-dotted shadow-[0_0_12px_rgba(225,29,72,0.7)]" />
        <div className="absolute -top-1.5 -right-1 text-sm">🕷️</div>
      </div>
    );
  }

  /* ── 10. Dark Wings ── */
  if (frameId === 'dark_wings') {
    return (
      <div className="absolute -inset-2 pointer-events-none z-20 flex items-center justify-center">
        <div className="absolute inset-1 rounded-full border-2 border-purple-900 shadow-[0_0_12px_rgba(88,28,135,0.8)]" />
        <div className="absolute -bottom-2 text-sm">🦅</div>
      </div>
    );
  }

  /* ── Fallback SVG border ── */
  return (
    <svg className="absolute inset-0 pointer-events-none z-10" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={frame.glowColor} strokeWidth={strokeW} />
    </svg>
  );
};

export const KnowzaAvatar: React.FC<KnowzaAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false,
  costume = 'classic',
  frameId = 'none',
  showFrameGlow = true,
  customBear,
  fallbackImage = false,
}) => {
  const sizeMap: Record<string, { cls: string; px: number }> = {
    xs:    { cls: 'w-7 h-7',    px: 28  },
    sm:    { cls: 'w-9 h-9',    px: 36  },
    md:    { cls: 'w-12 h-12',  px: 48  },
    lg:    { cls: 'w-16 h-16',  px: 64  },
    xl:    { cls: 'w-20 h-20',  px: 80  },
    '2xl': { cls: 'w-24 h-24', px: 96 },
  };

  const { cls, px } = sizeMap[size] ?? sizeMap['md'];

  const animationClass =
    animate === 'dance' || costume === 'party'
      ? 'animate-dance'
      : animate === 'wiggle'
      ? 'animate-wiggle'
      : animate === true || animate === 'bounce'
      ? 'animate-bounceSubtle'
      : '';

  const frame = getFrame(frameId);
  const hasFrame = frameId !== 'none';

  const glowStyle =
    hasFrame && showFrameGlow
      ? { filter: `drop-shadow(0 0 6px ${frame.glowColor})` }
      : undefined;

  const bearConfig = getBearConfigFromCostume(costume, customBear);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-full ${cls} ${animationClass} ${className}`}
      title={hasFrame ? `${frame.badge} ${frame.name}` : `Knowza Maskot`}
      style={glowStyle}
    >
      {/* Dynamic Modular Bear Model */}
      {!fallbackImage ? (
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-amber-50">
          <KnowzaBearModel config={bearConfig} size={px} />
        </div>
      ) : (
        <img
          src="/assets/knowza_avatar_circle.png"
          alt="Knowza Maskot"
          className="w-full h-full object-contain rounded-full"
        />
      )}

      {/* Discord Nitro-Style Animated Avatar Decoration Overlay */}
      {hasFrame && <AvatarFrameOverlay frameId={frameId} size={px} />}
    </div>
  );
};

export default KnowzaAvatar;
