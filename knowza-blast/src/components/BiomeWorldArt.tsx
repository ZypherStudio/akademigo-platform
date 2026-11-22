import React from 'react';
import { BiomeConfig } from '../data/biomes';
import { BiomeId } from '../types/game';
import { assetUrl } from '../utils/assets';
import { BiomeSceneOverlay } from './BiomeSceneOverlay';

interface BiomeWorldBackgroundProps {
  biome: BiomeConfig;
  variant?: 'map' | 'gameplay';
}

const BiomeVectorWorld: React.FC<{ biomeId: BiomeId }> = ({ biomeId }) => {
  if (biomeId === 'crystal_cave') {
    return (
      <svg
        viewBox="0 0 450 880"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="ccSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#120529" />
            <stop offset="42%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#090314" />
          </linearGradient>
          <radialGradient id="ccGlow" cx="50%" cy="28%" r="55%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#7e22ce" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#140529" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ccCrystal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5d0fe" />
            <stop offset="48%" stopColor="#c026d3" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="ccCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="55%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#164e63" />
          </linearGradient>
          <linearGradient id="ccRock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="65%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#0f0524" />
          </linearGradient>
        </defs>

        <rect width="450" height="880" fill="url(#ccSky)" />
        <rect width="450" height="880" fill="url(#ccGlow)" />

        {/* Vaulted Cavern Stalactites */}
        <path d="M0 0 H450 V88 L395 42 L345 104 L285 38 L225 76 L160 32 L105 98 L45 48 L0 95 Z" fill="#180736" opacity="0.92" />

        {/* Distant Floating Crystal Islets */}
        <g transform="translate(46, 175)" opacity="0.85">
          <polygon points="0,35 38,28 54,48 22,74 4,52" fill="#3b0764" />
          <polygon points="18,32 25,6 34,32" fill="url(#ccCrystal)" />
        </g>
        <g transform="translate(348, 195)" opacity="0.85">
          <polygon points="0,32 48,26 62,48 30,72 6,50" fill="#3b0764" />
          <polygon points="22,28 32,0 42,28" fill="url(#ccCyan)" />
        </g>

        {/* Main Floating Sanctuary Island */}
        <path
          d="M52 360 C55 290 135 258 225 258 C318 258 395 295 398 360 L418 530 C410 640 365 785 280 865 L140 865 C85 780 42 645 34 520 Z"
          fill="url(#ccRock)"
          stroke="#6b21a8"
          strokeWidth="3"
        />

        {/* Luminous Turquoise Cave River Waterfall */}
        <path
          d="M308 380 Q365 408 378 485 L388 730 L345 730 Q338 515 308 420 Z"
          fill="url(#ccCyan)"
          opacity="0.9"
        />

        {/* Crystal Prism Citadel at Peak */}
        <g transform="translate(225, 210)">
          <polygon points="-58,72 -44,6 -24,72" fill="url(#ccCrystal)" stroke="#fae8ff" strokeWidth="1.5" />
          <polygon points="24,72 44,12 58,72" fill="url(#ccCrystal)" stroke="#fae8ff" strokeWidth="1.5" />
          <polygon points="-28,72 0,-34 28,72" fill="url(#ccCyan)" stroke="#ecfeff" strokeWidth="2" />
          <rect x="-46" y="54" width="92" height="36" rx="6" fill="#4c1d95" stroke="#c084fc" strokeWidth="2" />
          <path d="M-12 90 V68 A12 12 0 0 1 12 68 V90 Z" fill="#fef08a" />
        </g>

        {/* Winding Luminous Quartz Road */}
        <path
          d="M225 300 C225 352 135 395 142 470 C150 555 285 615 268 705 C255 775 182 825 190 885"
          fill="none"
          stroke="#c084fc"
          strokeWidth="56"
          strokeLinecap="round"
        />
        <path
          d="M225 300 C225 352 135 395 142 470 C150 555 285 615 268 705 C255 775 182 825 190 885"
          fill="none"
          stroke="#f5d0fe"
          strokeWidth="40"
          strokeLinecap="round"
        />

        {/* Giant Foreground Glowing Amethyst & Cyan Crystals */}
        <g transform="translate(45, 560)">
          <polygon points="0,85 26,8 52,85" fill="url(#ccCrystal)" stroke="#fae8ff" strokeWidth="1.8" />
          <polygon points="34,85 52,30 70,85" fill="url(#ccCyan)" stroke="#ecfeff" strokeWidth="1.5" />
        </g>
        <g transform="translate(335, 595)">
          <polygon points="0,80 28,4 56,80" fill="url(#ccCrystal)" stroke="#fae8ff" strokeWidth="1.8" />
          <polygon points="-22,80 -4,36 16,80" fill="url(#ccCyan)" stroke="#ecfeff" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (biomeId === 'dojo_peak') {
    return (
      <svg
        viewBox="0 0 450 880"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="djSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="45%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id="djGrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="45%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="djCliff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9a5c38" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="djSakura" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="55%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>

        <rect width="450" height="880" fill="url(#djSky)" />

        {/* Stylized Sun & Floating Cloud Banks */}
        <circle cx="340" cy="145" r="54" fill="#fef08a" opacity="0.88" />
        <g fill="#fff1f2" opacity="0.85">
          <ellipse cx="90" cy="160" rx="68" ry="24" />
          <ellipse cx="360" cy="240" rx="75" ry="26" />
          <ellipse cx="75" cy="760" rx="110" ry="38" />
          <ellipse cx="385" cy="785" rx="115" ry="42" />
        </g>

        {/* Cliff & Lush Floating Dojo Mountain */}
        <path d="M55 460 L225 860 L395 460 Z" fill="url(#djCliff)" />
        <path
          d="M36 420 C45 310 135 265 225 265 C315 265 405 310 414 420 L422 570 C400 660 325 760 225 840 C125 760 50 660 28 570 Z"
          fill="url(#djGrass)"
          stroke="#166534"
          strokeWidth="2.5"
        />

        {/* Koi Stream Waterfall */}
        <path d="M312 415 Q352 430 356 500 L358 765 L322 765 Q324 510 300 435 Z" fill="#38bdf8" opacity="0.9" />

        {/* Imperial Tiered Crimson Pagoda Dojo Temple */}
        <g transform="translate(225, 225)">
          <rect x="-46" y="28" width="92" height="36" fill="#fffbeb" stroke="#78350f" strokeWidth="2" />
          <path d="M-64 30 Q0 8 64 30 L52 14 H-52 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.2" />
          <rect x="-32" y="-10" width="64" height="24" fill="#fffbeb" stroke="#78350f" strokeWidth="2" />
          <path d="M-48 -8 Q0 -26 48 -8 L36 -22 H-36 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.2" />
          <path d="M-30 -22 L0 -48 L30 -22 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
          <rect x="-2" y="-64" width="4" height="18" fill="#fbbf24" />
          <circle cx="0" cy="-65" r="4" fill="#fde047" />
          <rect x="-12" y="38" width="24" height="26" rx="2" fill="#451a03" />
        </g>

        {/* Stone Temple Stair Road */}
        <path
          d="M225 290 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="54"
          strokeLinecap="round"
        />
        <path
          d="M225 290 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#f8fafc"
          strokeWidth="38"
          strokeLinecap="round"
        />

        {/* Crimson Torii Arch & Blooming Sakura Blossom Trees */}
        <g transform="translate(88, 495)">
          <rect x="-5" y="15" width="12" height="58" fill="#78350f" rx="4" />
          <circle cx="0" cy="-4" r="36" fill="url(#djSakura)" />
          <circle cx="-22" cy="10" r="26" fill="url(#djSakura)" />
          <circle cx="24" cy="12" r="24" fill="url(#djSakura)" />
        </g>
        <g transform="translate(362, 540)">
          <rect x="-5" y="15" width="12" height="58" fill="#78350f" rx="4" />
          <circle cx="0" cy="-4" r="38" fill="url(#djSakura)" />
          <circle cx="-22" cy="12" r="26" fill="url(#djSakura)" />
          <circle cx="24" cy="10" r="24" fill="url(#djSakura)" />
        </g>
      </svg>
    );
  }

  if (biomeId === 'desert') {
    return (
      <svg
        viewBox="0 0 450 880"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="dsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="48%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="dsSand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="dsPyr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>

        <rect width="450" height="880" fill="url(#dsSky)" />
        <circle cx="110" cy="135" r="56" fill="#fef9c3" opacity="0.92" />

        {/* Distant Floating Sandstone Cliffs */}
        <g fill="#fde68a" opacity="0.82">
          <ellipse cx="350" cy="175" rx="68" ry="22" />
          <ellipse cx="68" cy="790" rx="115" ry="38" />
          <ellipse cx="395" cy="805" rx="110" ry="35" />
        </g>

        {/* Floating Golden Oasis Sandstone Island */}
        <path
          d="M38 410 C42 300 135 262 225 262 C315 262 408 300 412 410 L420 570 C400 690 320 795 225 865 C130 795 50 690 30 570 Z"
          fill="url(#dsSand)"
          stroke="#92400e"
          strokeWidth="3"
        />

        {/* Turquoise Oasis Pool & Waterfall */}
        <ellipse cx="328" cy="435" rx="54" ry="28" fill="#14b8a6" stroke="#99f6e4" strokeWidth="2.5" />
        <path d="M352 440 L358 760 L324 760 L318 450 Z" fill="#2dd4bf" opacity="0.92" />

        {/* Golden Sun Pyramid Citadel */}
        <g transform="translate(225, 222)">
          <polygon points="-76,68 0,-42 76,68" fill="url(#dsPyr)" stroke="#92400e" strokeWidth="2.4" />
          <polygon points="0,-42 76,68 0,68" fill="#ca8a04" opacity="0.45" />
          <polygon points="-14,-21 0,-42 14,-21" fill="#fef08a" />
          <rect x="-14" y="34" width="28" height="34" rx="14" fill="#115e59" stroke="#fde047" strokeWidth="2.2" />
        </g>

        {/* Winding Sandstone Brick Road */}
        <path
          d="M225 290 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#92400e"
          strokeWidth="56"
          strokeLinecap="round"
        />
        <path
          d="M225 290 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="40"
          strokeLinecap="round"
        />

        {/* Stylized Emerald Palm Trees */}
        <g transform="translate(80, 480)">
          <path d="M0 78 Q8 38 -4 10" stroke="#78350f" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M-4 10 C-38 2 -48 22 -14 26 M-4 10 C-24 -22 8 -28 8 4 M-4 10 C28 -8 42 18 12 24" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
        </g>
        <g transform="translate(360, 560)">
          <path d="M0 78 Q-8 38 4 10" stroke="#78350f" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M4 10 C-32 0 -42 20 -10 24 M4 10 C-18 -20 14 -24 12 4 M4 10 C34 -6 46 20 14 26" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (biomeId === 'cyber_city') {
    return (
      <svg
        viewBox="0 0 450 880"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="cySky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="48%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id="cyDeck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="cyNeon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        <rect width="450" height="880" fill="url(#cySky)" />

        {/* Synth Horizon Sun & Cyber Grid Floor Glow */}
        <circle cx="225" cy="185" r="78" fill="#06b6d4" opacity="0.22" />
        <circle cx="225" cy="185" r="54" fill="url(#cyNeon)" opacity="0.35" />

        {/* Distant Floating Holo Spires */}
        <g opacity="0.78">
          <rect x="34" y="180" width="38" height="125" rx="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
          <rect x="44" y="195" width="18" height="75" fill="#06b6d4" opacity="0.45" />
          <rect x="374" y="195" width="42" height="130" rx="6" fill="#0f172a" stroke="#e879f9" strokeWidth="2" />
          <rect x="386" y="210" width="18" height="80" fill="#e879f9" opacity="0.45" />
        </g>

        {/* Main Floating Cyber Sky-Metropolis Deck */}
        <path
          d="M38 405 C42 295 135 262 225 262 C315 262 408 295 412 405 L425 570 C405 690 320 795 225 865 C130 795 45 690 25 570 Z"
          fill="url(#cyDeck)"
          stroke="#22d3ee"
          strokeWidth="3"
        />

        {/* Neon Summit Citadel Tower */}
        <g transform="translate(225, 215)">
          <rect x="-52" y="28" width="104" height="44" rx="8" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.4" />
          <rect x="-30" y="-18" width="60" height="52" rx="6" fill="#1e293b" stroke="#e879f9" strokeWidth="2.2" />
          <polygon points="-18,-18 0,-56 18,-18" fill="url(#cyNeon)" />
          <circle cx="0" cy="-2" r="12" fill="#67e8f9" />
          <rect x="-12" y="42" width="24" height="30" rx="12" fill="#22d3ee" />
        </g>

        {/* Illuminated Cyan Neon Skyway Bridge */}
        <path
          d="M225 292 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="56"
          strokeLinecap="round"
        />
        <path
          d="M225 292 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
          fill="none"
          stroke="#0f172a"
          strokeWidth="42"
          strokeLinecap="round"
        />

        {/* Plasma Waterfalls & Holographic Tree Pylons */}
        <path d="M332 425 L344 745 L318 745 L306 425 Z" fill="#22d3ee" opacity="0.72" />
        <g transform="translate(76, 515)">
          <rect x="-4" y="20" width="8" height="52" fill="#334155" />
          <circle cx="0" cy="8" r="24" fill="#06b6d4" opacity="0.55" stroke="#67e8f9" strokeWidth="2" />
        </g>
        <g transform="translate(366, 565)">
          <rect x="-4" y="20" width="8" height="52" fill="#334155" />
          <circle cx="0" cy="8" r="24" fill="#c026d3" opacity="0.55" stroke="#f0abfc" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // cosmos (Yıldız Kozmosu)
  return (
    <svg
      viewBox="0 0 450 880"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    >
      <defs>
        <linearGradient id="cmSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#040212" />
          <stop offset="45%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#09051f" />
        </linearGradient>
        <radialGradient id="cmNebula" cx="52%" cy="34%" r="60%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#040212" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cmIsland" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="55%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#090624" />
        </linearGradient>
      </defs>

      <rect width="450" height="880" fill="url(#cmSky)" />
      <rect width="450" height="880" fill="url(#cmNebula)" />

      {/* Distant Twin Planets */}
      <g transform="translate(68, 175)">
        <circle cx="0" cy="0" r="24" fill="#f472b6" opacity="0.88" />
        <ellipse cx="0" cy="0" rx="38" ry="10" fill="none" stroke="#fbcfe8" strokeWidth="2.8" transform="rotate(-18)" />
      </g>

      {/* Main Astral Observatory Island */}
      <path
        d="M42 405 C48 295 135 262 225 262 C315 262 402 295 408 405 L418 575 C395 695 318 795 225 865 C132 795 55 695 32 575 Z"
        fill="url(#cmIsland)"
        stroke="#818cf8"
        strokeWidth="2.8"
      />

      {/* Starlight Observatory Castle + Armillary Ring Halo */}
      <g transform="translate(225, 215)">
        <circle cx="0" cy="18" r="56" fill="none" stroke="#fde047" strokeWidth="2" opacity="0.7" />
        <rect x="-46" y="28" width="92" height="40" rx="8" fill="#312e81" stroke="#a5b4fc" strokeWidth="2.2" />
        <path d="M-26 28 A26 26 0 0 1 26 28 Z" fill="#6366f1" stroke="#fde047" strokeWidth="2" />
        <polygon points="-8,-14 0,-42 8,-14" fill="#fde047" />
        <rect x="-11" y="42" width="22" height="26" rx="11" fill="#fef08a" />
      </g>

      {/* Stardust Milky-Way Cascade & Bridge */}
      <path d="M328 430 L340 755 L314 755 L302 430 Z" fill="#a78bfa" opacity="0.75" />
      <path
        d="M225 292 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
        fill="none"
        stroke="#818cf8"
        strokeWidth="56"
        strokeLinecap="round"
      />
      <path
        d="M225 292 C225 348 135 395 142 475 C150 562 285 612 268 708 C255 782 182 825 190 885"
        fill="none"
        stroke="#fef08a"
        strokeWidth="34"
        strokeLinecap="round"
        opacity="0.82"
      />
    </svg>
  );
};

/**
 * Renders the biome's distinct world illustration (photorealistic 3D island artwork OR animated
 * multi-layer 3D vector world) layered with live atmospheric animations & props.
 */
export const BiomeWorldBackground: React.FC<BiomeWorldBackgroundProps> = ({
  biome,
  variant = 'map'
}) => {
  const bgImg = variant === 'gameplay' ? biome.playBgImage : biome.mapBgImage;
  const tint = variant === 'gameplay' ? biome.skyGradient : biome.mapOverlayGradient;

  return (
    <>
      {bgImg ? (
        <img
          src={assetUrl(bgImg)}
          alt={biome.name}
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
        />
      ) : (
        <BiomeVectorWorld biomeId={biome.id} />
      )}
      <div className={`absolute inset-0 bg-gradient-to-b ${tint} transition-colors duration-500 pointer-events-none`} />
      <BiomeSceneOverlay biomeId={biome.id} variant={variant} />
    </>
  );
};
