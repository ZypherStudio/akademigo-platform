import React, { useId } from 'react';
import { CustomBearConfig } from '../types';

interface KnowzaBearModelProps {
  config: CustomBearConfig;
  size?: number;
  className?: string;
}

interface FurPalette {
  light: string;
  mid: string;
  dark: string;
  muzzleLight: string;
  muzzleDark: string;
  earInner: string;
}

const FUR_PALETTES: Record<string, FurPalette> = {
  bal_sarisi: {
    light: '#fde047',
    mid: '#f59e0b',
    dark: '#b45309',
    muzzleLight: '#fef3c7',
    muzzleDark: '#fde68a',
    earInner: '#fb923c',
  },
  kraliyet_altini: {
    light: '#fef08a',
    mid: '#eab308',
    dark: '#a16207',
    muzzleLight: '#fefce8',
    muzzleDark: '#fef08a',
    earInner: '#f59e0b',
  },
  kar_beyazi: {
    light: '#ffffff',
    mid: '#e2e8f0',
    dark: '#94a3b8',
    muzzleLight: '#ffffff',
    muzzleDark: '#f1f5f9',
    earInner: '#fbcfe8',
  },
  cikolata: {
    light: '#d97706',
    mid: '#92400e',
    dark: '#451a03',
    muzzleLight: '#fde68a',
    muzzleDark: '#f59e0b',
    earInner: '#b45309',
  },
  gece_siyahi: {
    light: '#64748b',
    mid: '#334155',
    dark: '#0f172a',
    muzzleLight: '#cbd5e1',
    muzzleDark: '#94a3b8',
    earInner: '#475569',
  },
  pembe_seker: {
    light: '#fbcfe8',
    mid: '#f472b6',
    dark: '#be185d',
    muzzleLight: '#fdf2f8',
    muzzleDark: '#fbcfe8',
    earInner: '#fda4af',
  },
  siber_neon: {
    light: '#67e8f9',
    mid: '#06b6d4',
    dark: '#0e7490',
    muzzleLight: '#ecfeff',
    muzzleDark: '#cffafe',
    earInner: '#22d3ee',
  },
  obsidian_raven: {
    light: '#a78bfa',
    mid: '#5b21b6',
    dark: '#1e1b4b',
    muzzleLight: '#ddd6fe',
    muzzleDark: '#c4b5fd',
    earInner: '#7c3aed',
  },
  moonlight_wolf: {
    light: '#f8fafc',
    mid: '#cbd5e1',
    dark: '#64748b',
    muzzleLight: '#ffffff',
    muzzleDark: '#e2e8f0',
    earInner: '#c4b5fd',
  },
  crimson_hero: {
    light: '#fb7185',
    mid: '#e11d48',
    dark: '#881337',
    muzzleLight: '#ffe4e6',
    muzzleDark: '#fecdd3',
    earInner: '#f43f5e',
  },
};

export const KnowzaBearModel: React.FC<KnowzaBearModelProps> = ({
  config,
  size = 64,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const pal = FUR_PALETTES[config.furColor] || FUR_PALETTES.bal_sarisi;
  const earFill = `url(#${uid}-furGrad)`;
  const isCyber =
    config.eyewear === 'neon_visor' ||
    config.headwear === 'cyber_visor' ||
    config.outfit === 'cyber_suit';

  return (
    <svg
      viewBox="14 10 92 94"
      width={size}
      height={size}
      className={`overflow-visible select-none pointer-events-none ${className}`}
    >
      <defs>
        {/* 3D Fur Radial Shading */}
        <radialGradient id={`${uid}-furGrad`} cx="36%" cy="28%" r="72%">
          <stop offset="0%" stopColor={pal.light} />
          <stop offset="52%" stopColor={pal.mid} />
          <stop offset="100%" stopColor={pal.dark} />
        </radialGradient>

        <radialGradient id={`${uid}-muzzleGrad`} cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor={pal.muzzleLight} />
          <stop offset="100%" stopColor={pal.muzzleDark} />
        </radialGradient>

        <radialGradient id={`${uid}-pandaDark`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        <radialGradient id={`${uid}-cheekGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>

        {/* Hoodie / Outfits */}
        <linearGradient id={`${uid}-hoodieGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isCyber ? '#1e293b' : '#27272a'} />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>

        <linearGradient id={`${uid}-royalGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>

        <linearGradient id={`${uid}-goldGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id={`${uid}-visorGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.82" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id={`${uid}-domeGlass`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
          <stop offset="40%" stopColor="#bae6fd" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.28" />
        </linearGradient>

        <filter id={`${uid}-softShadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Subtle Ground Ambient Shadow */}
      <ellipse cx="60" cy="112" rx="28" ry="5" fill="#000000" opacity="0.22" />

      {/* === 1. TORSO & OUTFIT === */}
      <g className="animate-knowza-breathe" style={{ transformOrigin: '60px 95px' }}>
        {config.outfit === 'royal_cape' ? (
          <g filter={`url(#${uid}-softShadow)`}>
            <path d="M26 112 C28 84, 42 78, 60 78 C78 78, 92 84, 94 112 Z" fill={`url(#${uid}-royalGrad)`} />
            {/* Ermine white collar */}
            <path d="M35 83 Q60 95 85 83 Q82 76 60 76 Q38 76 35 83 Z" fill="#f8fafc" />
            <circle cx="46" cy="83" r="1.4" fill="#1e293b" />
            <circle cx="60" cy="85" r="1.4" fill="#1e293b" />
            <circle cx="74" cy="83" r="1.4" fill="#1e293b" />
            {/* Golden K Clasp */}
            <circle cx="60" cy="94" r="7" fill={`url(#${uid}-goldGrad)`} stroke="#78350f" strokeWidth="1" />
            <text x="60" y="97.5" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#451a03">K</text>
          </g>
        ) : config.outfit === 'space_suit' ? (
          <g filter={`url(#${uid}-softShadow)`}>
            <path d="M28 112 C30 85, 42 78, 60 78 C78 78, 90 85, 92 112 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M38 82 Q60 90 82 82" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
            <rect x="52" y="93" width="16" height="10" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="60" y="101" textAnchor="middle" fontSize="7" fontWeight="900" fill="#38bdf8">K-01</text>
          </g>
        ) : (
          <g filter={`url(#${uid}-softShadow)`}>
            {/* Default Cozy Knowza Hoodie / Cyber Jacket */}
            <path
              d="M29 112 C31 85, 43 78, 60 78 C77 78, 89 85, 91 112 Z"
              fill={`url(#${uid}-hoodieGrad)`}
            />
            {/* Hoodie Collar Folds */}
            <path d="M39 81 Q60 91 81 81" fill="none" stroke={isCyber ? '#22d3ee' : '#3f3f46'} strokeWidth="2.5" strokeLinecap="round" />
            {/* Drawstrings */}
            <path d="M51 85 L50 96" stroke={isCyber ? '#22d3ee' : '#facc15'} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M69 85 L70 96" stroke={isCyber ? '#22d3ee' : '#facc15'} strokeWidth="1.8" strokeLinecap="round" />
            {/* Cyber neon circuit lines */}
            {isCyber && (
              <>
                <path d="M37 94 L45 100 L45 110" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M83 94 L75 100 L75 110" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
            {/* Golden K Emblem */}
            <text
              x="60"
              y="104"
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill={isCyber ? '#22d3ee' : `url(#${uid}-goldGrad)`}
            >
              K
            </text>
          </g>
        )}

        {/* Left Waving / Thumbs-Up Paw */}
        <g className="animate-wiggle" style={{ transformOrigin: '28px 92px' }}>
          <ellipse cx="26" cy="92" rx="8.5" ry="7.5" fill={`url(#${uid}-furGrad)`} filter={`url(#${uid}-softShadow)`} />
          <ellipse cx="24" cy="86" rx="3.2" ry="4.5" fill={`url(#${uid}-furGrad)`} transform="rotate(-12 24 86)" />
        </g>

        {/* Right Paw + Held Item */}
        <g>
          {config.heldItem === 'book' && (
            <g transform="translate(76, 84) rotate(8)" filter={`url(#${uid}-softShadow)`}>
              <rect x="0" y="0" width="18" height="22" rx="3" fill="#6d28d9" stroke="#a78bfa" strokeWidth="1" />
              <rect x="2" y="2" width="3" height="18" rx="1" fill="#4c1d95" />
              <text x="11" y="14.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fde047">K</text>
            </g>
          )}
          {(config.heldItem === 'trophy' || config.heldItem === 'wand') && (
            <g transform="translate(86, 68)" filter={`url(#${uid}-softShadow)`}>
              <rect x="4" y="8" width="3.5" height="34" rx="1.75" fill={`url(#${uid}-goldGrad)`} />
              <circle cx="5.75" cy="6" r="5.5" fill={config.heldItem === 'wand' ? '#22d3ee' : `url(#${uid}-goldGrad)`} />
              <circle cx="5.75" cy="6" r="2.6" fill={config.heldItem === 'wand' ? '#e0f2fe' : '#ef4444'} />
            </g>
          )}
          {config.heldItem === 'diploma' && (
            <g transform="translate(78, 86) rotate(-18)" filter={`url(#${uid}-softShadow)`}>
              <rect x="0" y="0" width="18" height="7" rx="3.5" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
              <rect x="7" y="-1" width="4" height="9" rx="1" fill="#ef4444" />
            </g>
          )}
          {config.heldItem === 'torch' && (
            <g transform="translate(84, 72)" filter={`url(#${uid}-softShadow)`}>
              <rect x="4" y="14" width="4" height="22" rx="2" fill="#475569" />
              <path d="M6 2 Q12 9 6 15 Q0 9 6 2 Z" fill="#f97316" />
              <path d="M6 6 Q9 10 6 14 Q3 10 6 6 Z" fill="#fde047" />
            </g>
          )}
          <ellipse cx="89" cy="95" rx="8" ry="7" fill={`url(#${uid}-furGrad)`} filter={`url(#${uid}-softShadow)`} />
        </g>
      </g>

      {/* === 2. HEAD, EARS & LIVING FACE === */}
      <g className="animate-knowza-breathe" style={{ transformOrigin: '60px 58px' }}>
        {/* Left & Right Ears */}
        <g className="animate-wiggle" style={{ transformOrigin: '34px 30px' }}>
          <circle cx="33" cy="29" r="12.5" fill={earFill} filter={`url(#${uid}-softShadow)`} />
          <circle cx="33" cy="29.5" r="7" fill={pal.earInner} opacity="0.88" />
        </g>
        <g className="animate-wiggle" style={{ transformOrigin: '86px 30px' }}>
          <circle cx="87" cy="29" r="12.5" fill={earFill} filter={`url(#${uid}-softShadow)`} />
          <circle cx="87" cy="29.5" r="7" fill={pal.earInner} opacity="0.88" />
        </g>

        {/* Main 3D Chibi Bear Head */}
        <ellipse cx="60" cy="54" rx="33" ry="29.5" fill={`url(#${uid}-furGrad)`} filter={`url(#${uid}-softShadow)`} />

        {/* Subtle Top-Head Rim Highlight */}
        <ellipse cx="54" cy="34" rx="16" ry="6" fill="#ffffff" opacity="0.18" />

        {/* Rosy Blushing Cheeks */}
        <ellipse cx="36" cy="59" rx="6.5" ry="4" fill={`url(#${uid}-cheekGlow)`} />
        <ellipse cx="84" cy="59" rx="6.5" ry="4" fill={`url(#${uid}-cheekGlow)`} />

        {/* Expressive Eyebrows */}
        <path d="M39 39 Q45 36 50 39" fill="none" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M70 39 Q75 36 81 39" fill="none" stroke="#451a03" strokeWidth="2.4" strokeLinecap="round" />

        {/* Glossy 3D Pixar Eyes with Real Blinking */}
        <g className="animate-eye-blink" style={{ transformOrigin: '46px 50px' }}>
          <circle cx="46" cy="50" r="7.2" fill="#18120e" />
          <path d="M41 53 A6 6 0 0 0 51 53" fill="#92400e" opacity="0.55" />
          <circle cx="43.5" cy="47.2" r="2.6" fill="#ffffff" />
          <circle cx="48.5" cy="52.2" r="1.1" fill="#ffffff" opacity="0.85" />
        </g>

        <g className="animate-eye-blink" style={{ transformOrigin: '74px 50px' }}>
          <circle cx="74" cy="50" r="7.2" fill="#18120e" />
          <path d="M69 53 A6 6 0 0 0 79 53" fill="#92400e" opacity="0.55" />
          <circle cx="71.5" cy="47.2" r="2.6" fill="#ffffff" />
          <circle cx="76.5" cy="52.2" r="1.1" fill="#ffffff" opacity="0.85" />
        </g>

        {/* Cream 3D Muzzle */}
        <ellipse cx="60" cy="61" rx="13.5" ry="10.2" fill={`url(#${uid}-muzzleGrad)`} />

        {/* 3D Button Nose */}
        <ellipse cx="60" cy="56.8" rx="4.4" ry="3.1" fill="#1c1917" />
        <ellipse cx="58.7" cy="55.7" rx="1.4" ry="0.8" fill="#ffffff" opacity="0.65" />

        {/* Happy Smile + Cute Tongue */}
        <path d="M54 62 Q57 65.5 60 62.5 Q63 65.5 66 62" fill="none" stroke="#292524" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M57.5 64.5 Q60 69 62.5 64.5 Z" fill="#fb7185" />

        {/* === 3. EYEWEAR LAYER === */}
        {config.eyewear === 'neon_visor' && (
          <g filter={`url(#${uid}-softShadow)`}>
            <path
              d="M32 45 L55 45 L60 49 L65 45 L88 45 L86 57 L64 57 L60 54 L56 57 L34 57 Z"
              fill={`url(#${uid}-visorGrad)`}
              stroke="#67e8f9"
              strokeWidth="1.6"
            />
            <line x1="36" y1="49" x2="52" y2="49" stroke="#e0f2fe" strokeWidth="1" opacity="0.8" />
            <line x1="68" y1="49" x2="84" y2="49" stroke="#e0f2fe" strokeWidth="1" opacity="0.8" />
          </g>
        )}

        {config.eyewear === 'professor' && (
          <g filter={`url(#${uid}-softShadow)`}>
            <circle cx="46" cy="50" r="9.2" fill="#ffffff" fillOpacity="0.12" stroke={`url(#${uid}-goldGrad)`} strokeWidth="2.1" />
            <circle cx="74" cy="50" r="9.2" fill="#ffffff" fillOpacity="0.12" stroke={`url(#${uid}-goldGrad)`} strokeWidth="2.1" />
            <path d="M55.2 49.5 Q60 47 64.8 49.5" fill="none" stroke={`url(#${uid}-goldGrad)`} strokeWidth="2" />
          </g>
        )}

        {config.eyewear === 'star_glasses' && (
          <g filter={`url(#${uid}-softShadow)`}>
            <polygon
              points="46,40 49,46 56,47 51,52 52,58 46,55 40,58 41,52 36,47 43,46"
              fill="#ec4899"
              fillOpacity="0.72"
              stroke="#fde047"
              strokeWidth="1.5"
            />
            <polygon
              points="74,40 77,46 84,47 79,52 80,58 74,55 68,58 69,52 64,47 71,46"
              fill="#ec4899"
              fillOpacity="0.72"
              stroke="#fde047"
              strokeWidth="1.5"
            />
            <line x1="55" y1="48" x2="65" y2="48" stroke="#fde047" strokeWidth="2" />
          </g>
        )}

        {/* === 4. HEADWEAR LAYER === */}
        {config.headwear === 'graduate_cap' && (
          <g transform="translate(0, -2) rotate(-5 60 26)" filter={`url(#${uid}-softShadow)`}>
            <path d="M44 27 L44 33 Q60 38 76 33 L76 27 Z" fill="#1e293b" />
            <polygon points="60,13 92,23 60,32 28,23" fill="#334155" stroke="#0f172a" strokeWidth="1" />
            <circle cx="60" cy="22.5" r="2.2" fill="#facc15" />
            <path d="M60 22.5 L83 27 L83 39" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <circle cx="83" cy="40" r="2.6" fill="#f59e0b" />
          </g>
        )}

        {config.headwear === 'royal_crown' && (
          <g transform="translate(0, -3)" filter={`url(#${uid}-softShadow)`}>
            <path
              d="M42 29 L40 15 L51 22 L60 11 L69 22 L80 15 L78 29 Z"
              fill={`url(#${uid}-goldGrad)`}
              stroke="#92400e"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="60" cy="22" r="2.6" fill="#ef4444" />
            <circle cx="49" cy="24" r="1.8" fill="#38bdf8" />
            <circle cx="71" cy="24" r="1.8" fill="#10b981" />
          </g>
        )}

        {config.headwear === 'party_hat' && (
          <g transform="translate(0, -3) rotate(8 60 25)" filter={`url(#${uid}-softShadow)`}>
            <polygon points="60,6 45,30 75,30" fill="#ec4899" stroke="#f472b6" strokeWidth="1" />
            <line x1="53" y1="18" x2="70" y2="22" stroke="#fde047" strokeWidth="2.5" />
            <line x1="49" y1="24" x2="73" y2="27" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="60" cy="6" r="4.2" fill="#fef08a" />
          </g>
        )}

        {config.headwear === 'wizard_hat' && (
          <g transform="translate(0, -3) rotate(-6 60 26)" filter={`url(#${uid}-softShadow)`}>
            <ellipse cx="60" cy="30" rx="26" ry="5.5" fill="#312e81" stroke="#818cf8" strokeWidth="1.2" />
            <path d="M43 29 L58 6 L77 29 Z" fill="#4338ca" stroke="#a5b4fc" strokeWidth="1" />
            <path d="M45 26 Q60 29 75 26" fill="none" stroke="#fde047" strokeWidth="2.4" />
            <circle cx="58" cy="16" r="2" fill="#fef08a" />
            <circle cx="65" cy="21" r="1.4" fill="#e0e7ff" />
          </g>
        )}

        {config.headwear === 'cyber_visor' && (
          <g filter={`url(#${uid}-softShadow)`}>
            <path d="M27 46 C27 19, 93 19, 93 46" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <path d="M30 43 C30 22, 90 22, 90 43" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="21" y="40" width="9" height="19" rx="4.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.8" />
            <rect x="90" y="40" width="9" height="19" rx="4.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.8" />
          </g>
        )}

        {config.headwear === 'astronaut_helmet' && (
          <g>
            <circle cx="60" cy="52" r="40" fill={`url(#${uid}-domeGlass)`} stroke="#e2e8f0" strokeWidth="2.6" />
            <path d="M34 32 A26 26 0 0 1 56 18" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" opacity="0.68" />
          </g>
        )}
      </g>
    </svg>
  );
};

export default KnowzaBearModel;
