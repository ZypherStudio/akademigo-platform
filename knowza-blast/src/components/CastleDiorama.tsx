import React from 'react';
import { AccessoryId, OutfitId } from '../types/game';
import { KnowzaSprite } from './KnowzaSprite';

interface CastleDioramaProps {
  stages: Record<string, number>;
  outfit?: OutfitId;
  accessory?: AccessoryId;
  highlightedId?: string | null;
  onSelectLandmark?: (id: string) => void;
}

/** Animated 5-stage Knowza Knowledge Castle SVG diorama showing built vs blueprint landmarks. */
export const CastleDiorama: React.FC<CastleDioramaProps> = ({
  stages,
  outfit = 'classic',
  accessory = 'none',
  highlightedId = null,
  onSelectLandmark
}) => {
  const hasFountain = (stages.fountain || 0) > 0;
  const hasLibrary = (stages.library || 0) > 0;
  const hasTower = (stages.tower || 0) > 0;
  const hasGarden = (stages.garden || 0) > 0;
  const hasThrone = (stages.throne || 0) > 0;
  const builtCount = [hasFountain, hasLibrary, hasTower, hasGarden, hasThrone].filter(Boolean).length;

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-[#a86f34] bg-gradient-to-b from-[#4bb5ff] via-[#89d6ff] to-[#dff5ff] shadow-inner select-none">
      {/* Drifting sunlit sky & clouds */}
      <div className="absolute -top-6 right-5 w-16 h-16 rounded-full bg-amber-200/70 blur-md pointer-events-none" />
      <svg viewBox="0 0 340 176" className="w-full h-full block" aria-label="Bilgi Kalesi Dioraması">
        <defs>
          <linearGradient id="cd_sky_glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60c5ff" />
            <stop offset="65%" stopColor="#a9e2ff" />
            <stop offset="100%" stopColor="#d9f4d7" />
          </linearGradient>
          <linearGradient id="cd_stone" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff4dc" />
            <stop offset="60%" stopColor="#e6c89c" />
            <stop offset="100%" stopColor="#b88b55" />
          </linearGradient>
          <linearGradient id="cd_roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff725c" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="cd_gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff088" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="cd_meadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ad957" />
            <stop offset="100%" stopColor="#2f8530" />
          </linearGradient>
        </defs>

        <rect width="340" height="176" fill="url(#cd_sky_glow)" />

        {/* Soft clouds */}
        <g fill="white" opacity="0.82">
          <ellipse cx="56" cy="30" rx="22" ry="9" />
          <ellipse cx="70" cy="26" rx="14" ry="8" />
          <ellipse cx="272" cy="36" rx="26" ry="10" />
          <ellipse cx="288" cy="31" rx="14" ry="8" />
        </g>

        {/* Emerald Hill Base */}
        <path
          d="M0 132 Q80 108 170 116 Q255 124 340 104 L340 176 L0 176 Z"
          fill="url(#cd_meadow)"
          stroke="#215e22"
          strokeWidth="1.5"
        />
        {/* Cobble Courtyard Path */}
        <path
          d="M142 176 Q156 146 170 134 Q184 146 202 176 Z"
          fill="#e7d4b5"
          stroke="#a17b4d"
          strokeWidth="1.2"
        />

        {/* Core Castle Keep Foundation (Always Visible) */}
        <g>
          <rect
            x="114"
            y="84"
            width="112"
            height="54"
            rx="4"
            fill="url(#cd_stone)"
            stroke="#784b22"
            strokeWidth="1.6"
          />
          {/* Battlements */}
          {[116, 134, 152, 170, 188, 206].map((bx) => (
            <rect
              key={bx}
              x={bx}
              y="77"
              width="12"
              height="8"
              rx="1.5"
              fill="#f3dcba"
              stroke="#784b22"
              strokeWidth="1.2"
            />
          ))}
          {/* Main Wooden Gate */}
          <path
            d="M156 138 L156 112 Q170 98 184 112 L184 138 Z"
            fill="#6b3410"
            stroke="#3d1b04"
            strokeWidth="1.8"
          />
          <line x1="170" y1="105" x2="170" y2="138" stroke="#3d1b04" strokeWidth="1.2" />
          <circle cx="164" cy="124" r="1.8" fill="#fbbf24" />
          <circle cx="176" cy="124" r="1.8" fill="#fbbf24" />
        </g>

        {/* 1. GREAT THRONE HALL & GRAND CROWN SPIRE (throne) */}
        <g
          className={onSelectLandmark ? 'cursor-pointer' : ''}
          onClick={() => onSelectLandmark?.('throne')}
        >
          {hasThrone ? (
            <g>
              <rect x="142" y="46" width="56" height="40" rx="3" fill="url(#cd_stone)" stroke="#784b22" strokeWidth="1.5" />
              <polygon points="138,48 170,16 202,48" fill="url(#cd_roof)" stroke="#7f1d1d" strokeWidth="1.6" />
              {/* Gold Crown Crest */}
              <circle cx="170" cy="64" r="11" fill="url(#cd_gold)" stroke="#78350f" strokeWidth="1.4" />
              <text x="170" y="68" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="900">
                K
              </text>
              {/* Royal Spire Flag waving */}
              <line x1="170" y1="16" x2="170" y2="4" stroke="#fde047" strokeWidth="2.2" />
              <path d="M170 4 L189 9 L170 14 Z" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
              <circle cx="170" cy="3" r="2.6" fill="#fde047" />
            </g>
          ) : (
            <g opacity="0.65">
              <rect
                x="144"
                y="48"
                width="52"
                height="34"
                rx="3"
                fill="rgba(255,248,225,0.28)"
                stroke={highlightedId === 'throne' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <polygon
                points="140,48 170,20 200,48"
                fill="rgba(255,248,225,0.22)"
                stroke={highlightedId === 'throne' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
            </g>
          )}
        </g>

        {/* 2. GREAT WISDOM LIBRARY WING (library - Left Wing) */}
        <g
          className={onSelectLandmark ? 'cursor-pointer' : ''}
          onClick={() => onSelectLandmark?.('library')}
        >
          {hasLibrary ? (
            <g>
              <rect x="46" y="76" width="70" height="60" rx="5" fill="url(#cd_stone)" stroke="#784b22" strokeWidth="1.5" />
              <polygon points="41,77 81,50 121,77" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
              {/* Glowing arched library windows */}
              <path d="M60 120 L60 95 Q67 86 74 95 L74 120 Z" fill="#fef08a" stroke="#92400e" strokeWidth="1.4" />
              <path d="M88 120 L88 95 Q95 86 102 95 L102 120 Z" fill="#fef08a" stroke="#92400e" strokeWidth="1.4" />
              {/* Book Crest */}
              <rect x="74" y="61" width="14" height="10" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              <line x1="81" y1="61" x2="81" y2="71" stroke="#78350f" strokeWidth="1" />
            </g>
          ) : (
            <g opacity="0.65">
              <rect
                x="48"
                y="78"
                width="66"
                height="56"
                rx="4"
                fill="rgba(255,248,225,0.25)"
                stroke={highlightedId === 'library' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <polygon
                points="44,78 81,52 118,78"
                fill="rgba(255,248,225,0.2)"
                stroke={highlightedId === 'library' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
          )}
        </g>

        {/* 3. ROCKET OBSERVATORY TOWER (tower - Right Spire) */}
        <g
          className={onSelectLandmark ? 'cursor-pointer' : ''}
          onClick={() => onSelectLandmark?.('tower')}
        >
          {hasTower ? (
            <g>
              <rect x="224" y="54" width="44" height="84" rx="5" fill="url(#cd_stone)" stroke="#784b22" strokeWidth="1.5" />
              {/* Metallic Observatory Dome + Rocket */}
              <path d="M222 56 Q246 28 270 56 Z" fill="#0ea5e9" stroke="#0369a1" strokeWidth="1.5" />
              <line x1="246" y1="30" x2="246" y2="14" stroke="#fde047" strokeWidth="2.5" />
              <circle cx="246" cy="13" r="4.5" fill="#fb7185" stroke="#fff" strokeWidth="1.2" />
              <circle cx="246" cy="76" r="9" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="249" cy="74" r="3" fill="#38bdf8" />
            </g>
          ) : (
            <g opacity="0.65">
              <rect
                x="226"
                y="56"
                width="40"
                height="80"
                rx="4"
                fill="rgba(255,248,225,0.25)"
                stroke={highlightedId === 'tower' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M224 56 Q246 32 268 56 Z"
                fill="rgba(255,248,225,0.2)"
                stroke={highlightedId === 'tower' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
          )}
        </g>

        {/* 4. STAR FLOWER GARDEN (garden - Right/Left Forecourt Blossoms) */}
        <g
          className={onSelectLandmark ? 'cursor-pointer' : ''}
          onClick={() => onSelectLandmark?.('garden')}
        >
          {hasGarden ? (
            <g>
              {/* Lush hedges & glowing blossoms */}
              <ellipse cx="44" cy="146" rx="30" ry="11" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />
              <ellipse cx="294" cy="144" rx="32" ry="12" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />
              {[
                { x: 26, y: 142, c: '#fb7185' },
                { x: 42, y: 138, c: '#fde047' },
                { x: 58, y: 145, c: '#c084fc' },
                { x: 274, y: 142, c: '#fde047' },
                { x: 294, y: 136, c: '#fb7185' },
                { x: 312, y: 144, c: '#38bdf8' }
              ].map((fl, i) => (
                <g key={i}>
                  <circle cx={fl.x} cy={fl.y} r="4.5" fill={fl.c} stroke="#fff" strokeWidth="1" />
                  <circle cx={fl.x} cy={fl.y} r="1.6" fill="#fff" />
                </g>
              ))}
            </g>
          ) : (
            <g opacity="0.6">
              <ellipse
                cx="44"
                cy="146"
                rx="26"
                ry="9"
                fill="rgba(255,248,225,0.2)"
                stroke={highlightedId === 'garden' ? '#f59e0b' : '#2f5e2e'}
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
              <ellipse
                cx="294"
                cy="144"
                rx="26"
                ry="9"
                fill="rgba(255,248,225,0.2)"
                stroke={highlightedId === 'garden' ? '#f59e0b' : '#2f5e2e'}
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
            </g>
          )}
        </g>

        {/* 5. GOLDEN KNOWLEDGE FOUNTAIN (fountain - Front Courtyard) */}
        <g
          className={onSelectLandmark ? 'cursor-pointer' : ''}
          onClick={() => onSelectLandmark?.('fountain')}
        >
          {hasFountain ? (
            <g>
              {/* Fountain Pool */}
              <ellipse cx="104" cy="156" rx="26" ry="9" fill="#0ea5e9" stroke="#e2e8f0" strokeWidth="2.5" />
              <ellipse cx="104" cy="155" rx="18" ry="5.5" fill="#7dd3fc" />
              {/* Golden Pedestal & Cascading Water Arcs */}
              <rect x="100" y="136" width="8" height="20" rx="2" fill="url(#cd_gold)" stroke="#78350f" strokeWidth="1" />
              <ellipse cx="104" cy="136" rx="12" ry="4" fill="#fde047" stroke="#92400e" strokeWidth="1.2" />
              <path
                d="M104 128 Q90 134 90 153 M104 128 Q118 134 118 153"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="104" cy="125" r="3" fill="#bae6fd" />
            </g>
          ) : (
            <g opacity="0.65">
              <ellipse
                cx="104"
                cy="155"
                rx="24"
                ry="8"
                fill="rgba(255,248,225,0.22)"
                stroke={highlightedId === 'fountain' ? '#f59e0b' : '#5c3310'}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Knowza celebrating at the Castle Courtyard */}
      <div className="absolute bottom-1 right-6 w-14 h-14 pointer-events-none animate-float-slow">
        <KnowzaSprite
          pose="flag"
          outfit={outfit}
          accessory={accessory}
          mood={builtCount === 5 ? 'celebrate' : 'happy'}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Stage Counter Pill */}
      <div className="absolute top-2 left-2 bg-[#3d1e07]/85 border border-[#fbbf24]/70 text-[#fff3d1] text-[10px] font-black px-2 py-0.5 rounded-full shadow">
        Kale Seviyesi: {builtCount}/5
      </div>
    </div>
  );
};
