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
 * Filter mapping for the 3D Knowza mascot fur colors.
 * Keeps the authentic 3D shading, glossy reflections, and facial depth intact.
 */
function getFurFilter(furColor: CustomBearConfig['furColor']): string {
  switch (furColor) {
    case 'kar_beyazi':
      return 'grayscale(1) brightness(1.22) contrast(1.08)';
    case 'cikolata':
      return 'sepia(0.85) hue-rotate(-25deg) brightness(0.68) contrast(1.22)';
    case 'gece_siyahi':
      return 'brightness(0.38) contrast(1.4) saturate(0.2)';
    case 'pembe_seker':
      return 'hue-rotate(300deg) saturate(1.45) brightness(1.15)';
    case 'siber_neon':
      return 'hue-rotate(165deg) saturate(1.8) brightness(1.12)';
    case 'kraliyet_altini':
      return 'sepia(0.65) saturate(2.3) brightness(1.18) drop-shadow(0 0 6px rgba(251,191,36,0.6))';
    case 'bal_sarisi':
    default:
      return 'none';
  }
}

/**
 * High-End 3D-Styled Vector Accessories & Outfits Overlay
 * Fits with exact precision over the 3D mascot bear face and body!
 */
export const BearAccessoriesLayer: React.FC<{
  config: CustomBearConfig;
  size: number;
}> = ({ config }) => {
  const { headwear, eyewear, outfit, heldItem } = config;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
    >
      <defs>
        {/* Gold Metallic 3D Gradient */}
        <linearGradient id="accGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Ruby Velvet Gradient */}
        <linearGradient id="accRuby" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        {/* Cyber Neon Gradient */}
        <linearGradient id="accCyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* ─── 1. OUTFIT / CHESTWEAR ─── */}
      {outfit === 'royal_cape' && (
        <g>
          {/* Rich Velvet Mantle */}
          <path d="M22 84 C22 68, 78 68, 78 84 C78 98, 22 98, 22 84 Z" fill="url(#accRuby)" />
          {/* Gold Ermine Trim */}
          <path d="M30 76 Q50 86 70 76" stroke="url(#accGold3D)" strokeWidth="3" fill="none" />
          {/* Central Ruby Clasp Brooch */}
          <circle cx="50" cy="80" r="4.5" fill="#EF4444" stroke="url(#accGold3D)" strokeWidth="1.5" />
          <circle cx="50" cy="80" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </g>
      )}

      {outfit === 'cyber_suit' && (
        <g>
          {/* High-tech Carbon Chestplate */}
          <path d="M25 84 C25 70, 75 70, 75 84 C75 98, 25 98, 25 84 Z" fill="#0F172A" />
          <path d="M36 82 L46 74 L54 74 L64 82" stroke="#06B6D4" strokeWidth="2.2" fill="none" />
          <circle cx="50" cy="74" r="3" fill="#22D3EE" />
          <circle cx="50" cy="74" r="1" fill="#FFFFFF" />
        </g>
      )}

      {outfit === 'graduate_robe' && (
        <g>
          {/* Deep Navy Robe */}
          <path d="M24 84 C24 69, 76 69, 76 84 C76 98, 24 98, 24 84 Z" fill="#1E1B4B" />
          {/* Golden Silk Honor Stole */}
          <path d="M32 72 L46 94 L54 94 L68 72" stroke="url(#accGold3D)" strokeWidth="3.5" fill="none" />
        </g>
      )}

      {outfit === 'space_suit' && (
        <g>
          {/* White Pressure Suit Collar */}
          <path d="M24 84 C24 68, 76 68, 76 84 C76 98, 24 98, 24 84 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <rect x="42" y="77" width="16" height="9" rx="2.5" fill="#1E293B" />
          <circle cx="46" cy="81.5" r="1.8" fill="#38BDF8" />
          <circle cx="54" cy="81.5" r="1.8" fill="#22C55E" />
        </g>
      )}

      {outfit === 'tuxedo' && (
        <g>
          {/* Black Satin Lapels & White Shirt */}
          <path d="M25 84 C25 69, 75 69, 75 84 C75 98, 25 98, 25 84 Z" fill="#18181B" />
          <polygon points="40,73 60,73 50,86" fill="#FFFFFF" />
          {/* Crimson Silk Bow Tie */}
          <polygon points="44,74 56,79 44,79" fill="#DC2626" />
          <polygon points="56,74 44,79 56,79" fill="#DC2626" />
          <circle cx="50" cy="76.5" r="2" fill="#991B1B" />
        </g>
      )}

      {/* ─── 2. EYEWEAR ─── */}
      {eyewear === 'sunshades' && (
        <g transform="translate(0, -1)">
          {/* Sleek VIP Sunglasses */}
          <path d="M26 39 L47 39 L44 49 L29 49 Z" fill="#09090B" stroke="#27272A" strokeWidth="1" />
          <path d="M53 39 L74 39 L71 49 L56 49 Z" fill="#09090B" stroke="#27272A" strokeWidth="1" />
          <rect x="46" y="41" width="8" height="2.5" fill="#3F3F46" />
          {/* Specular Glare Lines */}
          <line x1="30" y1="41" x2="36" y2="47" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.85" strokeLinecap="round" />
          <line x1="57" y1="41" x2="63" y2="47" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.85" strokeLinecap="round" />
        </g>
      )}

      {eyewear === 'professor' && (
        <g transform="translate(0, -1)">
          {/* Gold Wire Spectacles */}
          <circle cx="37" cy="44" r="8" fill="none" stroke="url(#accGold3D)" strokeWidth="1.8" />
          <circle cx="63" cy="44" r="8" fill="none" stroke="url(#accGold3D)" strokeWidth="1.8" />
          <path d="M45 43 Q50 39 55 43" fill="none" stroke="url(#accGold3D)" strokeWidth="1.8" />
          {/* Lens Specular Reflection */}
          <path d="M33 40 A6 6 0 0 1 41 40" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
          <path d="M59 40 A6 6 0 0 1 67 40" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
        </g>
      )}

      {eyewear === 'neon_visor' && (
        <g transform="translate(0, -1)">
          {/* Cyberpunk LED Visor */}
          <rect x="24" y="38" width="52" height="11" rx="3" fill="#06B6D4" opacity="0.92" stroke="#22D3EE" strokeWidth="1.2" />
          <rect x="27" y="41" width="46" height="5" rx="1.5" fill="#A5F3FC" />
          <line x1="30" y1="43.5" x2="70" y2="43.5" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      )}

      {eyewear === 'star_glasses' && (
        <g transform="translate(0, -1)">
          {/* Golden Star Sunglasses */}
          <polygon points="36,36 39,43 46,43 40,47 42,54 36,50 30,54 32,47 26,43 33,43" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <polygon points="64,36 67,43 74,43 68,47 70,54 64,50 58,54 60,47 54,43 61,43" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <line x1="45" y1="45" x2="55" y2="45" stroke="#CA8A04" strokeWidth="2" />
        </g>
      )}

      {/* ─── 3. HEADWEAR ─── */}
      {headwear === 'royal_crown' && (
        <g transform="translate(0, -12)">
          {/* 3D Gold Imperial Crown */}
          <polygon
            points="28,26 24,12 38,19 50,7 62,19 76,12 72,26"
            fill="url(#accGold3D)"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          {/* Crown Base Band */}
          <rect x="27" y="24" width="46" height="5" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="0.8" />
          {/* Faceted Gemstones */}
          <circle cx="50" cy="16" r="3" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />
          <circle cx="50" cy="15.5" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="38" cy="20" r="2.2" fill="#10B981" />
          <circle cx="62" cy="20" r="2.2" fill="#3B82F6" />
        </g>
      )}

      {headwear === 'cyber_visor' && (
        <g transform="translate(0, -6)">
          {/* High-tech Headband & Neon Earphones */}
          <path d="M20 32 C20 12, 80 12, 80 32" stroke="url(#accCyan)" strokeWidth="3.5" fill="none" />
          <rect x="15" y="26" width="9" height="14" rx="3.5" fill="#0891B2" stroke="#22D3EE" strokeWidth="1.2" />
          <rect x="76" y="26" width="9" height="14" rx="3.5" fill="#0891B2" stroke="#22D3EE" strokeWidth="1.2" />
          <circle cx="19.5" cy="33" r="1.8" fill="#A5F3FC" />
          <circle cx="80.5" cy="33" r="1.8" fill="#A5F3FC" />
        </g>
      )}

      {headwear === 'party_hat' && (
        <g transform="translate(0, -14)">
          {/* Striped Party Cone */}
          <polygon points="50,4 66,28 34,28" fill="#F43F5E" />
          <path d="M38 22 L62 22" stroke="#FDE047" strokeWidth="3" />
          <path d="M42 14 L58 14" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="50" cy="4" r="3.5" fill="#FDE047" />
        </g>
      )}

      {headwear === 'astronaut_helmet' && (
        <g>
          {/* Glass Visor Dome */}
          <ellipse cx="50" cy="46" rx="38" ry="36" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          <path d="M24 32 A38 38 0 0 1 76 32" stroke="#38BDF8" strokeWidth="2.8" fill="none" opacity="0.85" strokeLinecap="round" />
          <path d="M30 26 A40 40 0 0 1 60 16" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.9" strokeLinecap="round" />
        </g>
      )}

      {headwear === 'wizard_hat' && (
        <g transform="translate(0, -16)">
          {/* Purple Wizard Hat */}
          <polygon points="50,2 70,30 30,30" fill="#7C3AED" />
          <ellipse cx="50" cy="30" rx="24" ry="5" fill="#6D28D9" />
          <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#FDE047" />
        </g>
      )}

      {headwear === 'beanie' && (
        <g transform="translate(0, -10)">
          {/* Red Knit Beanie */}
          <path d="M28 28 C28 14, 72 14, 72 28 Z" fill="#DC2626" />
          <rect x="25" y="26" width="50" height="7" rx="2.5" fill="#F8FAFC" />
          <circle cx="50" cy="12" r="4.5" fill="#F8FAFC" />
        </g>
      )}

      {/* ─── 4. HELD ITEM ─── */}
      {heldItem === 'trophy' && (
        <g transform="translate(64, 62)">
          {/* Gold Championship Trophy */}
          <path d="M3 3 L17 3 L15 12 Q10 17 10 19 L15 21 L5 21 L10 19 Q10 17 5 12 Z" fill="url(#accGold3D)" stroke="#B45309" strokeWidth="1" />
          <circle cx="10" cy="8" r="2.5" fill="#EF4444" />
          <circle cx="10" cy="8" r="0.8" fill="#FFFFFF" />
        </g>
      )}

      {heldItem === 'book' && (
        <g transform="translate(62, 68)">
          {/* Signature Purple "K" Book */}
          <rect x="0" y="0" width="18" height="22" rx="2.5" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.2" />
          <rect x="2" y="2" width="14" height="18" rx="1.5" fill="#6D28D9" />
          <text x="9" y="15" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFB800">
            K
          </text>
        </g>
      )}

      {heldItem === 'diploma' && (
        <g transform="translate(60, 70) rotate(-22)">
          {/* Parchment Diploma */}
          <rect x="0" y="0" width="20" height="7" rx="2" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
          <rect x="8" y="-1.5" width="4" height="10" rx="0.5" fill="#DC2626" />
        </g>
      )}

      {heldItem === 'torch' && (
        <g transform="translate(68, 58)">
          {/* Champion Torch */}
          <polygon points="3,14 10,14 8,26 5,26" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
          <path d="M2 14 Q6 2 11 14 Q8 9 6 14 Z" fill="#F97316" />
          <path d="M4 14 Q7 6 9 14 Z" fill="#FDE047" />
        </g>
      )}

      {heldItem === 'wand' && (
        <g transform="translate(66, 62) rotate(-25)">
          {/* Celestial Wand */}
          <line x1="2" y1="22" x2="2" y2="2" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="2,0 4,5 9,5 5,8 7,13 2,10 -3,13 -1,8 -5,5 0,5" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  );
};

/**
 * Discord Nitro-style Animated Avatar Decoration Overlays
 * Crafted with 100% custom illustrated SVG vector art & CSS animations.
 * ZERO raw Unicode text emojis!
 */
export const AvatarFrameOverlay: React.FC<{
  frameId: AvatarFrameId;
  size: number;
}> = ({ frameId }) => {
  if (frameId === 'none') return null;

  /* ── 1. Hilal Rüyaları (Ay Kurdu) ── */
  if (frameId === 'moon_reverie') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="mrGoldMoon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="mrCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E9D5FF" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <radialGradient id="mrCosmicRing" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="90%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#818CF8" />
            </radialGradient>
          </defs>

          {/* Glowing Cosmic Aura Ring */}
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="url(#mrCosmicRing)"
            strokeWidth="3.5"
            className="animate-pulse-aura"
          />

          {/* Intricately Sculpted Golden Crescent Moon at Top-Left */}
          <g className="animate-bounceSubtle origin-[34px_24px]">
            <path
              d="M36 12 C28 16, 22 24, 23 35 C24 44, 30 50, 40 52 C32 50, 26 44, 24 37 C22 28, 25 17, 34 13 C35 12, 35.5 12, 36 12 Z"
              fill="url(#mrGoldMoon)"
              stroke="#B45309"
              strokeWidth="1.2"
              filter="drop-shadow(0 0 6px rgba(251,191,36,0.85))"
            />
            {/* Crater & Filigree Details */}
            <circle cx="26" cy="30" r="1.6" fill="#D97706" opacity="0.6" />
            <circle cx="28" cy="38" r="1.2" fill="#D97706" opacity="0.6" />
          </g>

          {/* Orbiting Diamond Stars */}
          <g className="animate-celestial-spin origin-[60px_60px]">
            <polygon points="98,34 100,40 106,42 100,44 98,50 96,44 90,42 96,40" fill="#FDE047" />
            <polygon points="18,78 19,82 23,83 19,84 18,88 17,84 13,83 17,82" fill="#E9D5FF" />
            <polygon points="102,76 103,79 106,80 103,81 102,84 101,81 98,80 101,79" fill="#FDE047" />
          </g>

          {/* Drifting Fluffy Night Clouds Hugging the Bottom */}
          <g className="animate-cloud-float origin-[60px_100px]">
            <path
              d="M30 96 C30 88, 42 86, 50 91 C56 84, 70 85, 76 91 C84 87, 94 90, 94 98 C98 100, 98 106, 92 108 C86 110, 28 110, 26 102 C24 97, 28 95, 30 96 Z"
              fill="url(#mrCloudGrad)"
              opacity="0.95"
              filter="drop-shadow(0 2px 6px rgba(139,92,246,0.45))"
            />
          </g>
        </svg>
      </div>
    );
  }

  /* ── 2. Siber Savaşçı & Uçuşan Kalpler (Deadpool Hearts) ── */
  if (frameId === 'deadpool_hearts') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="dhArmorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <filter id="dhNeonPinkGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#F43F5E" />
            </filter>
            <filter id="dhEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFFFFF" />
            </filter>
          </defs>

          {/* Heavy Distressed Combat Frame */}
          <rect
            x="18"
            y="18"
            width="84"
            height="84"
            rx="28"
            fill="none"
            stroke="url(#dhArmorGrad)"
            strokeWidth="4.5"
            filter="drop-shadow(0 0 8px rgba(220,38,38,0.75))"
          />
          {/* Inner Carbon Trim */}
          <rect
            x="22"
            y="22"
            width="76"
            height="76"
            rx="24"
            fill="none"
            stroke="#18181B"
            strokeWidth="2.5"
            strokeDasharray="8 4"
          />

          {/* Metallic Rivet Bolts at 4 Corners */}
          <circle cx="26" cy="26" r="2.2" fill="#71717A" stroke="#27272A" strokeWidth="0.8" />
          <circle cx="94" cy="26" r="2.2" fill="#71717A" stroke="#27272A" strokeWidth="0.8" />
          <circle cx="26" cy="94" r="2.2" fill="#71717A" stroke="#27272A" strokeWidth="0.8" />
          <circle cx="94" cy="94" r="2.2" fill="#71717A" stroke="#27272A" strokeWidth="0.8" />

          {/* Tactical Ninja Visor Eyes at Top with Eye-Blink Animation */}
          <g className="animate-eye-blink origin-[60px_19px]">
            {/* Left Eye */}
            <polygon points="46,16 56,20 54,23 44,20" fill="#FFFFFF" filter="url(#dhEyeGlow)" />
            {/* Right Eye */}
            <polygon points="74,16 64,20 66,23 76,20" fill="#FFFFFF" filter="url(#dhEyeGlow)" />
          </g>

          {/* Bottom Tactical Crest */}
          <g transform="translate(54, 98)">
            <rect x="0" y="0" width="12" height="6" rx="2" fill="#18181B" stroke="#DC2626" strokeWidth="1" />
            <circle cx="6" cy="3" r="1.5" fill="#EF4444" />
          </g>
        </svg>

        {/* Floating Neon Vector Hearts on Left & Right */}
        <div className="absolute left-1 bottom-4 animate-float-hearts">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F43F5E" className="filter drop-shadow-[0_0_6px_#fb7185]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute right-1 bottom-8 animate-float-hearts-delayed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#FB7185" className="filter drop-shadow-[0_0_6px_#f43f5e]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute left-2 top-4 animate-float-hearts">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#FDA4AF" className="filter drop-shadow-[0_0_4px_#f43f5e]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    );
  }

  /* ── 3. Kozmik Kask (01. EOUS Astronot Kaskı) ── */
  if (frameId === 'eous_astronaut') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Outer Space Helmet Dome */}
          <circle cx="60" cy="60" r="42" fill="none" stroke="#F1F5F9" strokeWidth="5.5" filter="drop-shadow(0 0 6px rgba(56,189,248,0.5))" />
          <circle cx="60" cy="60" r="38.5" fill="none" stroke="#334155" strokeWidth="1.8" />

          {/* Dual Rounded Communication Ears on Top */}
          <g>
            {/* Left Ear */}
            <rect x="30" y="6" width="12" height="18" rx="6" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="36" cy="11" r="2.5" fill="#FDE047" className="animate-pulse" />
            {/* Right Ear */}
            <rect x="78" y="6" width="12" height="18" rx="6" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="84" cy="11" r="2.5" fill="#FDE047" className="animate-pulse" />
          </g>

          {/* Glass Visor Specular Reflection Arcs */}
          <path d="M34 44 A34 34 0 0 1 86 44" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.85" strokeLinecap="round" />
          <path d="M38 38 A36 36 0 0 1 66 26" fill="none" stroke="#FFFFFF" strokeWidth="2.2" opacity="0.9" strokeLinecap="round" />

          {/* Safety Orange "01. EOUS" Bottom Collar Band */}
          <rect x="32" y="98" width="56" height="15" rx="5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <text x="60" y="109" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" letterSpacing="0.8">
            01. EOUS
          </text>
        </svg>
      </div>
    );
  }

  /* ── 4. Kraliyet İmparator Tacı (Royal Crown) ── */
  if (frameId === 'royal_crown') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="rcCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Warm Golden Aura Ring */}
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="url(#rcCrownGold)"
            strokeWidth="3.5"
            className="animate-pulse-aura"
            filter="drop-shadow(0 0 8px rgba(245,158,11,0.65))"
          />

          {/* 3D Gold Imperial Crown with Animated Gleam */}
          <g className="animate-crown-gleam origin-[60px_16px]">
            <path
              d="M36 26 L32 12 L46 19 L60 6 L74 19 L88 12 L84 26 Z"
              fill="url(#rcCrownGold)"
              stroke="#B45309"
              strokeWidth="1.4"
              filter="drop-shadow(0 0 6px rgba(251,191,36,0.8))"
            />
            {/* Central Faceted Ruby */}
            <polygon points="60,13 64,18 60,23 56,18" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.6" />
            <circle cx="60" cy="17" r="1" fill="#FFFFFF" opacity="0.8" />
            {/* Emerald & Sapphire Side Jewels */}
            <circle cx="46" cy="19" r="2.8" fill="#10B981" />
            <circle cx="74" cy="19" r="2.8" fill="#3B82F6" />
          </g>

          {/* Golden Laurel Wreath Wrapping Bottom */}
          <path
            d="M26 80 Q34 100 60 102 Q86 100 94 80"
            fill="none"
            stroke="url(#rcCrownGold)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Golden Leaves */}
          <ellipse cx="38" cy="94" rx="4" ry="2" transform="rotate(-30 38 94)" fill="#FBBF24" />
          <ellipse cx="50" cy="101" rx="4" ry="2" fill="#FBBF24" />
          <ellipse cx="60" cy="102" rx="4" ry="2" fill="#FDE047" />
          <ellipse cx="70" cy="101" rx="4" ry="2" fill="#FBBF24" />
          <ellipse cx="82" cy="94" rx="4" ry="2" transform="rotate(30 82 94)" fill="#FBBF24" />
        </svg>
      </div>
    );
  }

  /* ── 5. Ejderha Alevi (Dragon Fire) ── */
  if (frameId === 'dragon_fire') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="dfFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>

          {/* Pulsing Dragon Flame Ring */}
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="url(#dfFireGrad)"
            strokeWidth="4"
            className="animate-dragon-flame origin-[60px_60px]"
          />

          {/* Serpentine Dragon Head & Horns at Top-Right */}
          <g transform="translate(68, 6)">
            <path
              d="M0 20 Q12 6 24 14 Q28 24 18 26 Q12 28 6 22 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="1.2"
            />
            {/* Dragon Horns */}
            <path d="M14 12 Q24 0 30 6" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Golden Slit Dragon Eye */}
            <ellipse cx="14" cy="18" rx="2" ry="3.5" fill="#FDE047" />
            <line x1="14" y1="15" x2="14" y2="21" stroke="#000" strokeWidth="1" />
          </g>

          {/* Surging Flame Ribbons at Bottom */}
          <g className="animate-dragon-flame origin-[60px_100px]">
            <path d="M40 102 Q48 88 54 102 Q60 84 66 102 Q72 88 80 102" fill="none" stroke="url(#dfFireGrad)" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  /* ── 6. Kan Ağı & Siber Örümcek (Blood Web) ── */
  if (frameId === 'blood_web') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Crimson Dotted Web Ring */}
          <circle cx="60" cy="60" r="42" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="5 3" filter="drop-shadow(0 0 6px rgba(220,38,38,0.7))" />

          {/* Web Strands across Top-Right */}
          <line x1="60" y1="18" x2="102" y2="60" stroke="#EF4444" strokeWidth="1.2" opacity="0.8" />
          <path d="M72 22 Q88 36 98 52" fill="none" stroke="#DC2626" strokeWidth="1.2" />
          <path d="M64 30 Q78 44 88 60" fill="none" stroke="#DC2626" strokeWidth="1.2" />

          {/* Mechanical Cyber Spider at Top-Right */}
          <g transform="translate(86, 26)">
            {/* Spider Body */}
            <ellipse cx="6" cy="6" rx="4.5" ry="6" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" />
            <circle cx="6" cy="0" r="3" fill="#991B1B" />
            {/* Glowing Red Eyes */}
            <circle cx="5" cy="-1" r="1" fill="#FF0000" />
            <circle cx="7" cy="-1" r="1" fill="#FF0000" />
            {/* 8 Articulated Robotic Legs */}
            <path d="M2 2 Q-4 -2 -8 2" fill="none" stroke="#EF4444" strokeWidth="1.2" />
            <path d="M2 6 Q-6 6 -9 11" fill="none" stroke="#EF4444" strokeWidth="1.2" />
            <path d="M10 2 Q16 -2 20 2" fill="none" stroke="#EF4444" strokeWidth="1.2" />
            <path d="M10 6 Q18 6 21 11" fill="none" stroke="#EF4444" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    );
  }

  /* ── 7. Karanlık Kanat & Hiçlik (Dark Wings) ── */
  if (frameId === 'dark_wings') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Dark Void Ring */}
          <circle cx="60" cy="60" r="42" fill="none" stroke="#7C3AED" strokeWidth="3.5" filter="drop-shadow(0 0 8px rgba(124,58,237,0.75))" />

          {/* Left Obsidian Wing */}
          <g className="animate-wing-flap origin-[24px_50px]">
            <path d="M24 38 C14 30, 4 38, -4 48 C2 50, 14 46, 22 44" fill="#3B0764" stroke="#581C87" strokeWidth="1" />
            <path d="M24 46 C12 42, -2 50, -8 64 C2 60, 14 56, 24 52" fill="#2E1065" stroke="#4C1D95" strokeWidth="1" />
            <path d="M24 54 C14 56, 2 66, 0 76 C10 70, 18 64, 24 60" fill="#1E1B4B" stroke="#312E81" strokeWidth="1" />
          </g>

          {/* Right Obsidian Wing */}
          <g className="animate-wing-flap origin-[96px_50px]">
            <path d="M96 38 C106 30, 116 38, 124 48 C118 50, 106 46, 98 44" fill="#3B0764" stroke="#581C87" strokeWidth="1" />
            <path d="M96 46 C108 42, 122 50, 128 64 C118 60, 106 56, 96 52" fill="#2E1065" stroke="#4C1D95" strokeWidth="1" />
            <path d="M96 54 C106 56, 118 66, 120 76 C110 70, 102 64, 96 60" fill="#1E1B4B" stroke="#312E81" strokeWidth="1" />
          </g>

          {/* Amethyst Runic Crest at Top */}
          <polygon points="60,8 65,15 60,22 55,15" fill="#C084FC" stroke="#7C3AED" strokeWidth="1" filter="drop-shadow(0 0 6px #C084FC)" />
        </svg>
      </div>
    );
  }

  /* ── 8. Kozmik Galaksi & Uydu (Cosmic Stars) ── */
  if (frameId === 'cosmic_stars') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="csGalaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Tilted 3D Elliptical Galaxy Ring */}
          <ellipse
            cx="60"
            cy="60"
            rx="52"
            ry="24"
            transform="rotate(-26 60 60)"
            fill="none"
            stroke="url(#csGalaxyGrad)"
            strokeWidth="4"
            filter="drop-shadow(0 0 8px rgba(129,140,248,0.75))"
          />

          {/* Orbiting Satellite / Miniature Planet */}
          <g className="animate-orbit-satellite origin-[60px_60px]">
            <circle cx="60" cy="60" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.2" filter="drop-shadow(0 0 5px #38BDF8)" />
            <circle cx="58.5" cy="58.5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Pulsar Diamond Stars */}
          <polygon points="60,6 62,12 68,14 62,16 60,22 58,16 52,14 58,12" fill="#FDE047" />
        </svg>
      </div>
    );
  }

  /* ── 9. Şimşek Fırtınası (Lightning Bolt) ── */
  if (frameId === 'lightning_bolt') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Crackling High-Voltage Electric Bolts */}
          <path
            d="M60 10 L68 34 L54 38 L72 66 L58 70 L74 100 L64 102 L70 112"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="3"
            filter="drop-shadow(0 0 8px #3B82F6)"
            className="animate-lightning-flash"
          />
          <path
            d="M20 54 L34 60 L28 72 L44 80"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="2"
            className="animate-lightning-flash"
          />
          {/* Dual Plasma Capacitor Nodes */}
          <circle cx="60" cy="12" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="60" cy="108" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  /* ── 10. Siber Neon 2077 (Cyber Neon) ── */
  if (frameId === 'cyber_neon') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          {/* Cyber Neon Ring */}
          <circle cx="60" cy="60" r="42" fill="none" stroke="#06B6D4" strokeWidth="3" filter="drop-shadow(0 0 8px rgba(6,182,212,0.8))" />

          {/* Tactical Corner HUD Brackets */}
          <path d="M22 36 L22 22 L36 22" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
          <path d="M98 36 L98 22 L84 22" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
          <path d="M22 84 L22 98 L36 98" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
          <path d="M98 84 L98 98 L84 98" fill="none" stroke="#22D3EE" strokeWidth="2.5" />

          {/* Degree Ticks */}
          <line x1="60" y1="14" x2="60" y2="18" stroke="#06B6D4" strokeWidth="2" />
          <line x1="60" y1="102" x2="60" y2="106" stroke="#06B6D4" strokeWidth="2" />
          <line x1="14" y1="60" x2="18" y2="60" stroke="#06B6D4" strokeWidth="2" />
          <line x1="102" y1="60" x2="106" y2="60" stroke="#06B6D4" strokeWidth="2" />

          {/* High-Tech Status Readout Badge */}
          <rect x="36" y="98" width="48" height="11" rx="2.5" fill="#09090B" stroke="#06B6D4" strokeWidth="1" />
          <text x="60" y="106" textAnchor="middle" fill="#22D3EE" fontSize="6.5" fontWeight="900" letterSpacing="0.8">
            SYS: 2077
          </text>
        </svg>

        {/* Sweeping Laser Scanline */}
        <div className="absolute inset-x-5 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-cyber-scan pointer-events-none" />
      </div>
    );
  }

  /* ── 11. Altın Alev (Gold Flame) ── */
  if (frameId === 'gold_flame') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#F59E0B" strokeWidth="4" className="animate-pulse-aura origin-[60px_60px]" filter="drop-shadow(0 0 8px rgba(245,158,11,0.7))" />
          <path d="M48 16 Q60 6 72 16 Q66 24 60 18 Q54 24 48 16 Z" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  /* ── 12. Doğa Ağı & Sarmalı (Nature Leaf) ── */
  if (frameId === 'nature_leaf') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#22C55E" strokeWidth="3.5" filter="drop-shadow(0 0 6px rgba(34,197,94,0.6))" />
          {/* Ivy Leaves along Rim */}
          <ellipse cx="40" cy="22" rx="5" ry="3" transform="rotate(-30 40 22)" fill="#16A34A" />
          <ellipse cx="80" cy="22" rx="5" ry="3" transform="rotate(30 80 22)" fill="#16A34A" />
          <ellipse cx="98" cy="60" rx="5" ry="3" transform="rotate(80 98 60)" fill="#22C55E" />
          <ellipse cx="40" cy="98" rx="5" ry="3" transform="rotate(30 40 98)" fill="#16A34A" />
        </svg>
      </div>
    );
  }

  /* ── 13. Kiraz Çiçeği (Cherry Blossom) ── */
  if (frameId === 'cherry_blossom') {
    return (
      <div className="absolute -inset-[22%] pointer-events-none z-20 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <circle cx="60" cy="60" r="42" fill="none" stroke="#F472B6" strokeWidth="3" filter="drop-shadow(0 0 8px rgba(244,114,182,0.7))" />

          {/* 5-Petal Sakura Flower at Top-Left */}
          <g transform="translate(32, 22)">
            <circle cx="0" cy="-4" r="3.5" fill="#FBCFE8" />
            <circle cx="4" cy="-1" r="3.5" fill="#FBCFE8" />
            <circle cx="2" cy="4" r="3.5" fill="#FBCFE8" />
            <circle cx="-3" cy="4" r="3.5" fill="#FBCFE8" />
            <circle cx="-4" cy="-1" r="3.5" fill="#FBCFE8" />
            <circle cx="0" cy="0" r="2" fill="#F43F5E" />
          </g>

          {/* 5-Petal Sakura Flower at Bottom-Right */}
          <g transform="translate(88, 88)">
            <circle cx="0" cy="-4" r="3.5" fill="#FBCFE8" />
            <circle cx="4" cy="-1" r="3.5" fill="#FBCFE8" />
            <circle cx="2" cy="4" r="3.5" fill="#FBCFE8" />
            <circle cx="-3" cy="4" r="3.5" fill="#FBCFE8" />
            <circle cx="-4" cy="-1" r="3.5" fill="#FBCFE8" />
            <circle cx="0" cy="0" r="2" fill="#F43F5E" />
          </g>
        </svg>

        {/* Falling Petals Animation */}
        <div className="absolute top-2 right-4 animate-petal-fall">
          <div className="w-2 h-2.5 bg-pink-300 rounded-full rotate-45 opacity-80" />
        </div>
        <div className="absolute top-8 left-4 animate-petal-fall-delayed">
          <div className="w-2 h-2.5 bg-pink-300 rounded-full -rotate-45 opacity-80" />
        </div>
      </div>
    );
  }

  /* ── Fallback SVG border ── */
  const frame = getFrame(frameId);
  return (
    <div className="absolute -inset-[18%] pointer-events-none z-20 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r="42" fill="none" stroke={frame.glowColor} strokeWidth="3.5" />
      </svg>
    </div>
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
  const furFilter = getFurFilter(bearConfig.furColor);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-full ${cls} ${animationClass} ${className}`}
      title={hasFrame ? `${frame.badge} ${frame.name}` : `Knowza Maskot`}
      style={glowStyle}
    >
      {/* 1. Authentic High-Resolution 3D Knowza Mascot Core */}
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 relative shadow-inner">
        <img
          src="/assets/knowza_avatar_circle.png"
          alt="Knowza 3D Maskot"
          className="w-full h-full object-cover rounded-full select-none pointer-events-none transition-all duration-300"
          style={{ filter: furFilter }}
        />

        {/* 2. 3D Styled Modular Accessories (Hat, Glasses, Cape/Robe, Held Item) */}
        <BearAccessoriesLayer config={bearConfig} size={px} />
      </div>

      {/* 3. Discord Nitro-Style Animated Avatar Decoration Overlay (Zero Emojis!) */}
      {hasFrame && <AvatarFrameOverlay frameId={frameId} size={px} />}
    </div>
  );
};

export default KnowzaAvatar;
