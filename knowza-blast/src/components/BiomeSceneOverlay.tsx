import React from 'react';
import { BiomeId } from '../types/game';

interface BiomeSceneOverlayProps {
  biomeId: BiomeId;
  variant?: 'map' | 'gameplay';
}

const PARTICLE_SEEDS = [
  { left: '8%', delay: '0s', dur: '6.8s', size: 12 },
  { left: '21%', delay: '-1.9s', dur: '7.6s', size: 16 },
  { left: '37%', delay: '-3.4s', dur: '6.2s', size: 11 },
  { left: '54%', delay: '-0.8s', dur: '8.1s', size: 14 },
  { left: '69%', delay: '-4.2s', dur: '6.5s', size: 15 },
  { left: '84%', delay: '-2.6s', dur: '7.3s', size: 12 },
  { left: '93%', delay: '-5.1s', dur: '6.9s', size: 13 }
];

/**
 * Renders animated, biome-specific modeled 3D SVG scenery props and live atmospheric particles
 * on top of each biome's illustrated artwork across both World Map and Gameplay scenes.
 */
export const BiomeSceneOverlay: React.FC<BiomeSceneOverlayProps> = ({
  biomeId,
  variant = 'map'
}) => {
  const particleOpacity = variant === 'gameplay' ? 'opacity-70' : 'opacity-90';

  if (biomeId === 'glacier') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Animated Arctic Aurora Ribbon */}
        <svg
          viewBox="0 0 400 180"
          className="absolute top-0 inset-x-0 w-full h-44 animate-biome-aurora"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="glacierAurora" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="32%" stopColor="#67e8f9" stopOpacity="0.48" />
              <stop offset="65%" stopColor="#a7f3d0" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M-20 45 Q90 15 190 55 T420 35 L420 95 Q290 60 190 95 T-20 85 Z"
            fill="url(#glacierAurora)"
          />
        </svg>

        {/* Falling Faceted 3D Snowflakes */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`snow_${idx}`}
            className="absolute top-0 animate-biome-fall"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" className="drop-shadow-[0_0_4px_rgba(186,230,253,0.9)]">
              <path
                d="M12 2V22M3.3 7L20.7 17M20.7 7L3.3 17"
                stroke="#e0f2fe"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="2.8" fill="#ffffff" />
            </svg>
          </div>
        ))}

        {/* Swaying Frosted Icicle Shards on Side Edges */}
        <svg viewBox="0 0 60 90" className="w-11 h-16 absolute top-24 left-1 animate-biome-sway opacity-80">
          <polygon points="10,4 22,4 16,66" fill="#bae6fd" stroke="#e0f2fe" strokeWidth="1.5" />
          <polygon points="26,4 38,4 32,48" fill="#7dd3fc" stroke="#e0f2fe" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (biomeId === 'volcano') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Molten Horizon Heat Glow */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-orange-600/35 via-red-600/10 to-transparent animate-pulse-soft" />

        {/* Rising Glowing Magma Embers */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`ember_${idx}`}
            className="absolute bottom-2 animate-biome-rise"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size} height={p.size} viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="6" fill="#fb923c" opacity="0.55" />
              <circle cx="10" cy="10" r="3.4" fill="#fef08a" />
            </svg>
          </div>
        ))}

        {/* Floating Sculpted Lava Crystal */}
        <svg viewBox="0 0 60 70" className="w-10 h-12 absolute bottom-28 right-2 animate-biome-sway opacity-90">
          <polygon points="30,4 48,26 40,62 20,62 12,26" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
          <polygon points="30,8 40,26 30,52 20,26" fill="#fb923c" opacity="0.7" />
        </svg>
      </div>
    );
  }

  if (biomeId === 'crystal_cave') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Prismatic Cave Light Rays */}
        <div
          className="absolute -top-10 left-6 w-48 h-96 rotate-[22deg] bg-gradient-to-b from-fuchsia-400/25 via-purple-400/10 to-transparent animate-biome-aurora"
        />
        <div
          className="absolute -top-10 right-4 w-40 h-96 -rotate-[18deg] bg-gradient-to-b from-cyan-300/25 via-indigo-400/10 to-transparent animate-biome-aurora"
        />

        {/* Orbiting & Rising Glowing Crystal Motes */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`crys_${idx}`}
            className="absolute bottom-4 animate-biome-rise"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size + 2} height={p.size + 2} viewBox="0 0 24 24" className="drop-shadow-[0_0_6px_rgba(232,121,249,0.9)]">
              <polygon
                points="12,2 20,12 12,22 4,12"
                fill={idx % 2 === 0 ? '#e879f9' : '#67e8f9'}
                stroke="#ffffff"
                strokeWidth="1.4"
              />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (biomeId === 'dojo_peak') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Swaying Traditional Glowing Temple Lanterns */}
        <svg viewBox="0 0 60 88" className="w-10 h-14 absolute top-28 left-1.5 animate-biome-sway">
          <line x1="30" y1="0" x2="30" y2="18" stroke="#78350f" strokeWidth="2.5" />
          <rect x="20" y="16" width="20" height="5" rx="2" fill="#451a03" />
          <ellipse cx="30" cy="40" rx="16" ry="20" fill="#fb7185" stroke="#9f1239" strokeWidth="2" />
          <ellipse cx="30" cy="40" rx="9" ry="13" fill="#fef08a" opacity="0.7" />
          <rect x="21" y="59" width="18" height="5" rx="2" fill="#451a03" />
          <line x1="30" y1="64" x2="30" y2="78" stroke="#f59e0b" strokeWidth="2" />
        </svg>

        {/* Falling Tumbling 3D Sakura Petals */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`sakura_${idx}`}
            className="absolute top-0 animate-biome-fall"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size + 3} height={p.size + 3} viewBox="0 0 24 24">
              <path
                d="M12 3 C17 6 20 13 15 19 C12 22 9 20 7 15 C5 10 8 5 12 3 Z"
                fill={idx % 2 === 0 ? '#fbcfe8' : '#f9a8d4'}
                stroke="#f472b6"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (biomeId === 'desert') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Warm Radiant Oasis Sunbeams */}
        <div className="absolute -top-12 right-4 w-56 h-[420px] rotate-[-24deg] bg-gradient-to-b from-amber-200/30 via-yellow-300/10 to-transparent animate-biome-aurora" />

        {/* Floating Golden Oasis & Scarab Dust Motes */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`sand_${idx}`}
            className="absolute bottom-6 animate-biome-rise"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size} height={p.size} viewBox="0 0 20 20">
              <polygon points="10,2 14,10 10,18 6,10" fill="#fde047" opacity="0.9" />
              <circle cx="10" cy="10" r="2.2" fill="#ffffff" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (biomeId === 'cyber_city') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Pulsing Cyber Synthwave Horizon */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cyan-500/25 via-fuchsia-500/10 to-transparent animate-pulse-soft" />

        {/* Hovering Holo Security Drone Props */}
        <svg viewBox="0 0 70 50" className="w-14 h-10 absolute top-28 right-2 animate-biome-sway opacity-90">
          <circle cx="35" cy="25" r="14" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.4" />
          <circle cx="35" cy="25" r="6" fill="#67e8f9" />
          <path d="M8 20 H21 M49 20 H62" stroke="#c084fc" strokeWidth="2.4" strokeLinecap="round" />
        </svg>

        {/* Rising Neon Data Light Streaks */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`cyber_${idx}`}
            className="absolute bottom-0 animate-biome-rise"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <div
              className={`w-[2.5px] h-7 rounded-full ${
                idx % 2 === 0
                  ? 'bg-gradient-to-t from-cyan-400 to-white shadow-[0_0_8px_#22d3ee]'
                  : 'bg-gradient-to-t from-fuchsia-400 to-white shadow-[0_0_8px_#e879f9]'
              }`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (biomeId === 'cosmos') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
        {/* Orbiting 3D Modeled Saturn Ringed Planetoid */}
        <svg viewBox="0 0 90 70" className="w-20 h-16 absolute top-24 right-2 animate-biome-sway opacity-95">
          <defs>
            <radialGradient id="cosmosPlanet" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#312e81" />
            </radialGradient>
          </defs>
          <ellipse cx="45" cy="36" rx="36" ry="11" fill="none" stroke="#c4b5fd" strokeWidth="3.5" transform="rotate(-16 45 36)" />
          <circle cx="45" cy="35" r="18" fill="url(#cosmosPlanet)" stroke="#e0e7ff" strokeWidth="1.8" />
          <path d="M12 42 Q45 54 78 28" fill="none" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
        </svg>

        {/* Shooting Meteor Streaks */}
        <div
          className="absolute top-20 right-4 w-24 h-[2.5px] rounded-full bg-gradient-to-l from-white via-cyan-200 to-transparent shadow-[0_0_10px_#fff] animate-biome-meteor"
        />

        {/* Twinkling Rising Nebula Star Dust */}
        {PARTICLE_SEEDS.map((p, idx) => (
          <div
            key={`star_${idx}`}
            className="absolute bottom-6 animate-biome-rise"
            style={{
              left: p.left,
              animationDelay: p.delay,
              ['--dur' as string]: p.dur
            }}
          >
            <svg width={p.size + 2} height={p.size + 2} viewBox="0 0 24 24">
              <path
                d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                fill={idx % 2 === 0 ? '#fde047' : '#a5f3fc'}
              />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  // Default: forest (Yeşil Vadi) — Drifting Clouds & Floating Sunlit Pollen Sparkles
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${particleOpacity}`}>
      <svg viewBox="0 0 120 60" className="w-24 h-12 absolute top-24 left-3 animate-biome-sway opacity-75">
        <ellipse cx="45" cy="34" rx="28" ry="14" fill="#ffffff" opacity="0.85" />
        <ellipse cx="72" cy="36" rx="22" ry="12" fill="#ffffff" opacity="0.85" />
        <ellipse cx="58" cy="24" rx="20" ry="15" fill="#ffffff" opacity="0.95" />
      </svg>
      {PARTICLE_SEEDS.map((p, idx) => (
        <div
          key={`leaf_${idx}`}
          className="absolute top-0 animate-biome-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            ['--dur' as string]: p.dur
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20">
            <path
              d="M10 3 C15 6 16 13 10 17 C4 13 5 6 10 3 Z"
              fill={idx % 2 === 0 ? '#fef08a' : '#86efac'}
              opacity="0.85"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
