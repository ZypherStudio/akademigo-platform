import React, { useId } from 'react';
import { AccessoryId, KnowzaMood, OutfitId } from '../types/game';

interface KnowzaSpriteProps {
  pose: 'portrait' | 'peek' | 'flag';
  outfit?: OutfitId;
  accessory?: AccessoryId;
  mood?: KnowzaMood;
  className?: string;
  alt?: string;
}

const OUTFIT_COLORS: Record<
  OutfitId,
  { mainTop: string; mainBot: string; pants: string; trim: string; stroke: string; kColor: string; isKarate?: boolean }
> = {
  classic: {
    mainTop: '#453531',
    mainBot: '#1b1210',
    pants: '#29201d',
    trim: '#69534c',
    stroke: '#120b09',
    kColor: '#ffd447'
  },
  crimson: {
    mainTop: '#f43f5e',
    mainBot: '#991b1b',
    pants: '#4c0519',
    trim: '#fda4af',
    stroke: '#5e0b15',
    kColor: '#fef08a'
  },
  karate: {
    mainTop: '#ffffff',
    mainBot: '#dce6f3',
    pants: '#e2e8f0',
    trim: '#1e293b',
    stroke: '#334155',
    kColor: '#dc2626',
    isKarate: true
  },
  royal: {
    mainTop: '#a855f7',
    mainBot: '#4c1d95',
    pants: '#3b0764',
    trim: '#fde047',
    stroke: '#2e1065',
    kColor: '#fef08a'
  },
  emerald: {
    mainTop: '#22c55e',
    mainBot: '#14532d',
    pants: '#064e3b',
    trim: '#bef264',
    stroke: '#052e16',
    kColor: '#fef9c3'
  },
  cyber: {
    mainTop: '#0284c7',
    mainBot: '#1e1b4b',
    pants: '#0f172a',
    trim: '#22d3ee',
    stroke: '#082f49',
    kColor: '#67e8f9'
  }
};

/** Live rigged, expression-reactive 3D-shaded Knowza Bear character model. */
export const KnowzaSprite: React.FC<KnowzaSpriteProps> = ({
  pose,
  outfit = 'classic',
  accessory = 'none',
  mood = 'idle',
  className = 'w-full h-full object-contain',
  alt = 'Knowza'
}) => {
  const uid = useId().replace(/:/g, '');
  const pal = OUTFIT_COLORS[outfit] || OUTFIT_COLORS.classic;

  const isPortrait = pose === 'portrait';
  const isFlag = pose === 'flag';
  const isCheering = mood === 'combo' || mood === 'celebrate' || mood === 'fever';
  const isHappy = mood === 'happy' || isCheering;
  const isWorried = mood === 'worried';
  const isSad = mood === 'sad';

  const bodyMotionClass =
    mood === 'worried'
      ? 'animate-bear-worried'
      : isCheering || mood === 'happy'
      ? 'animate-bear-cheer'
      : 'animate-bear-breathe';

  const viewBox = isPortrait ? '0 0 120 120' : isFlag ? '0 0 164 162' : '0 0 156 128';
  const headShiftY = isPortrait ? 3 : isFlag ? 8 : 6;
  const headShiftX = isPortrait ? 0 : isFlag ? -6 : 0;

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={alt}
      className={`${className} overflow-visible select-none`}
    >
      <defs>
        <radialGradient id={`${uid}_fur`} cx="42%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fff3b8" />
          <stop offset="42%" stopColor="#ffbc28" />
          <stop offset="86%" stopColor="#e67e07" />
          <stop offset="100%" stopColor="#a84e00" />
        </radialGradient>
        <radialGradient id={`${uid}_muzzle`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="70%" stopColor="#fde09a" />
          <stop offset="100%" stopColor="#ebb254" />
        </radialGradient>
        <radialGradient id={`${uid}_ear`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffa861" />
          <stop offset="100%" stopColor="#c75914" />
        </radialGradient>
        <linearGradient id={`${uid}_outfit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.mainTop} />
          <stop offset="100%" stopColor={pal.mainBot} />
        </linearGradient>
        <linearGradient id={`${uid}_crown`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${uid}_sweat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <radialGradient id={`${uid}_feverHalo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}_drop`} x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3a1903" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Hero / Fever Energy Aura */}
      {(mood === 'fever' || mood === 'combo' || mood === 'celebrate') && (
        <circle
          cx={isPortrait ? 60 : isFlag ? 70 : 78}
          cy={isPortrait ? 58 : 64}
          r={isPortrait ? 56 : 62}
          fill={`url(#${uid}_feverHalo)`}
        />
      )}

      {/* Main Animated Bear Rig */}
      <g className={bodyMotionClass}>
        {/* Shoulders & Tailored Outfit (Pose-Adaptive) */}
        {isPortrait ? (
          <g transform="translate(0, 2)" filter={`url(#${uid}_drop)`}>
            <path
              d="M20 116 C23 89 38 80 60 80 C82 80 97 89 100 116 Q60 120 20 116 Z"
              fill={`url(#${uid}_outfit)`}
              stroke={pal.stroke}
              strokeWidth="2.8"
            />
            <ellipse cx="60" cy="83" rx="18" ry="4.5" fill="#000000" opacity="0.22" />
            {pal.isKarate ? (
              <>
                <path d="M41 85 L60 106 L79 85" fill="none" stroke="#1e293b" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M44 86 L60 103 L76 86" fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="33" y="105" width="54" height="7" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" />
                <circle cx="60" cy="108.5" r="4.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.4" />
              </>
            ) : (
              <>
                <path d="M39 84 Q60 95 81 84" fill="none" stroke={pal.trim} strokeWidth="3.2" strokeLinecap="round" />
                <text
                  x="60"
                  y="108"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="900"
                  fill={pal.kColor}
                  stroke={pal.stroke}
                  strokeWidth="0.7"
                >
                  K
                </text>
              </>
            )}
          </g>
        ) : (
          <g transform={`translate(${headShiftX}, 0)`} filter={`url(#${uid}_drop)`}>
            {/* Full-body ground contact shadow, legs & padded bear feet when standing in flag pose */}
            {isFlag && (
              <g>
                <ellipse cx="83" cy="150" rx="46" ry="7.5" fill="#170902" opacity="0.34" />
                {/* Left Leg + Pant Cuff */}
                <path
                  d="M50 112 L47 132 Q59 136 70 132 L71 114 Z"
                  fill={pal.pants}
                  stroke={pal.stroke}
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                {/* Right Leg + Pant Cuff */}
                <path
                  d="M85 114 L86 132 Q97 136 109 132 L106 112 Z"
                  fill={pal.pants}
                  stroke={pal.stroke}
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                {/* Left & Right 3D Padded Bear Feet */}
                <g transform="translate(57, 141)">
                  <ellipse cx="0" cy="0" rx="14" ry="8.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.4" />
                  <ellipse cx="0" cy="2" rx="8" ry="4.5" fill="#fde09a" opacity="0.85" />
                  <circle cx="-6" cy="-2.5" r="2.1" fill="#fde09a" opacity="0.8" />
                  <circle cx="0" cy="-3.5" r="2.2" fill="#fde09a" opacity="0.8" />
                  <circle cx="6" cy="-2.5" r="2.1" fill="#fde09a" opacity="0.8" />
                </g>
                <g transform="translate(99, 141)">
                  <ellipse cx="0" cy="0" rx="14" ry="8.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.4" />
                  <ellipse cx="0" cy="2" rx="8" ry="4.5" fill="#fde09a" opacity="0.85" />
                  <circle cx="-6" cy="-2.5" r="2.1" fill="#fde09a" opacity="0.8" />
                  <circle cx="0" cy="-3.5" r="2.2" fill="#fde09a" opacity="0.8" />
                  <circle cx="6" cy="-2.5" r="2.1" fill="#fde09a" opacity="0.8" />
                </g>
              </g>
            )}

            {/* Left & Right Tailored Sleeves behind Torso in Flag Pose */}
            {isFlag && (
              <>
                <path
                  d="M44 86 C31 92 26 102 33 111 C38 116 45 111 49 102 Z"
                  fill={`url(#${uid}_outfit)`}
                  stroke={pal.stroke}
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M111 86 C122 90 126 98 119 105 C115 109 109 105 106 98 Z"
                  fill={`url(#${uid}_outfit)`}
                  stroke={pal.stroke}
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Rounded Plush Body Torso */}
            <path
              d={
                isFlag
                  ? 'M38 116 C37 88 53 79 78 79 C103 79 119 88 118 116 Q78 125 38 116 Z'
                  : 'M36 120 C36 90 52 80 78 80 C104 80 120 90 120 120 Z'
              }
              fill={`url(#${uid}_outfit)`}
              stroke={pal.stroke}
              strokeWidth="3"
            />
            {/* Ambient Under-Chin Shadow for 3D Depth */}
            <ellipse cx="78" cy="83.5" rx="22" ry="5.5" fill="#000000" opacity="0.24" />

            {pal.isKarate ? (
              <>
                {/* Karate Dojo Crossed Lapels + Crimson Obi Belt */}
                <path d="M56 82 L78 108 L100 82" fill="none" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M58 82 L78 105 L98 82" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                <rect x="42" y="105" width="72" height="8.5" rx="4" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
                <path d="M74 113 L68 124 L75 124 L79 113 M82 113 L88 124 L81 124 L78 113" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="78" cy="109.5" r="5.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.8" />
                <text x="96" y="99" fontSize="11" fontWeight="900" fill="#dc2626">
                  K
                </text>
              </>
            ) : (
              <>
                {/* Hoodie Collar & Bold Golden K Crest */}
                <path d="M52 82 Q78 96 104 82" fill="none" stroke={pal.trim} strokeWidth="4" strokeLinecap="round" />
                <path d="M68 92 L68 100 M88 92 L88 100" stroke={pal.trim} strokeWidth="2.5" strokeLinecap="round" />
                <text
                  x="78"
                  y="112"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="900"
                  fill={pal.kColor}
                  stroke={pal.stroke}
                  strokeWidth="0.9"
                >
                  K
                </text>
              </>
            )}

            {/* Flag Pose: Planted K-World Pennant Banner on Right Side */}
            {isFlag && (
              <g transform="translate(117, 20)">
                <rect x="0" y="6" width="4.8" height="122" rx="2.4" fill="#8b4e1a" stroke="#472206" strokeWidth="1.6" />
                <circle cx="2.4" cy="5" r="4.8" fill="#ffd23f" stroke="#78350f" strokeWidth="1.5" />
                <path
                  d="M4.8 11 L41 20 L33 32 L40 43 L4.8 47 Z"
                  fill="#9333ea"
                  stroke="#4c1d95"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <text x="19" y="34.5" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fde047">
                  K
                </text>
              </g>
            )}

            {/* Reactive Paws */}
            {isCheering ? (
              <>
                {/* Both paws raised cheering */}
                <g transform="translate(34, 80) rotate(-25)">
                  <ellipse cx="0" cy="0" rx="11" ry="13" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                  <circle cx="-3" cy="-2" r="3" fill="#ffdf94" opacity="0.7" />
                </g>
                <g transform="translate(122, 80) rotate(25)">
                  <ellipse cx="0" cy="0" rx="11" ry="13" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                  <circle cx="3" cy="-2" r="3" fill="#ffdf94" opacity="0.7" />
                </g>
              </>
            ) : (
              <>
                {/* Left Paw gripping frame / friendly wave in flag pose */}
                {isFlag ? (
                  <g transform="translate(33, 108) rotate(-14)">
                    <ellipse cx="0" cy="0" rx="10.5" ry="9.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                    <ellipse cx="-2" cy="-1.5" rx="4.5" ry="3.2" fill="#ffe79e" opacity="0.75" />
                  </g>
                ) : (
                  <ellipse cx="48" cy="117" rx="11.5" ry="8.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                )}
                {/* Right Paw: Thumbs-up in happy/idle, clutch in worried/sad, gripping flag in flag */}
                {isWorried || isSad ? (
                  <ellipse cx="108" cy="117" rx="11.5" ry="8.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                ) : isFlag ? (
                  <g transform="translate(118, 99)">
                    <ellipse cx="0" cy="0" rx="10" ry="9" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                    <ellipse cx="-2" cy="-2" rx="4" ry="2.5" fill="#ffe79e" opacity="0.75" />
                  </g>
                ) : (
                  <g transform="translate(120, 88) rotate(8)">
                    <ellipse cx="0" cy="4" rx="10.5" ry="11" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.2" />
                    <path
                      d="M-3 -5 C-5 -16 4 -17 4 -6 Z"
                      fill={`url(#${uid}_fur)`}
                      stroke="#8f4600"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </>
            )}
          </g>
        )}

        {/* Bear Head Group */}
        <g
          transform={`translate(${isPortrait ? 60 : 78 + headShiftX}, ${isPortrait ? 52 + headShiftY : 52 + headShiftY}) scale(${
            isPortrait ? 0.88 : isFlag ? 0.84 : 0.86
          })`}
          filter={`url(#${uid}_drop)`}
        >
          {/* Left & Right Rounded Ears */}
          <g transform={isSad ? 'rotate(-10 -31 -22)' : ''}>
            <circle cx="-32" cy="-24" r="14.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.6" />
            <circle cx="-31" cy="-23" r="8" fill={`url(#${uid}_ear)`} />
            <path d="M-40 -31 Q-34 -37 -26 -34" fill="none" stroke="#fff4c4" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
          </g>
          <g transform={isSad ? 'rotate(10 31 -22)' : ''}>
            <circle cx="32" cy="-24" r="14.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.6" />
            <circle cx="31" cy="-23" r="8" fill={`url(#${uid}_ear)`} />
            <path d="M26 -34 Q34 -37 40 -31" fill="none" stroke="#fff4c4" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
          </g>

          {/* Main 3D Bear Head */}
          <ellipse cx="0" cy="2" rx="41" ry="36.5" fill={`url(#${uid}_fur)`} stroke="#8f4600" strokeWidth="2.8" />
          {/* Soft Forehead Specular Highlight */}
          <ellipse cx="-10" cy="-19" rx="17" ry="8" fill="#fff7c2" opacity="0.48" />

          {/* Rosy Warm Cheeks */}
          <ellipse cx="-24" cy="12" rx="7.5" ry="4.5" fill="#ff6b57" opacity={isHappy ? 0.54 : 0.34} />
          <ellipse cx="24" cy="12" rx="7.5" ry="4.5" fill="#ff6b57" opacity={isHappy ? 0.54 : 0.34} />

          {/* Cream Muzzle */}
          <ellipse cx="0" cy="14" rx="20" ry="15" fill={`url(#${uid}_muzzle)`} stroke="#d48824" strokeWidth="1.5" />
          <line x1="0" y1="11.5" x2="0" y2="16.5" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

          {/* Expressive Eyes based on live `mood` */}
          {mood === 'combo' || mood === 'celebrate' ? (
            <>
              {/* Starry Golden Sparkle Eyes */}
              {[-15, 15].map((ex) => (
                <g key={ex} transform={`translate(${ex}, -2)`}>
                  <circle cx="0" cy="0" r="8.6" fill="#592506" />
                  <circle cx="0" cy="0" r="7.4" fill="#210c02" />
                  <path
                    d="M0 -6.5 L1.8 -1.8 L6.5 0 L1.8 1.8 L0 6.5 L-1.8 1.8 L-6.5 0 L-1.8 -1.8 Z"
                    fill="#ffe548"
                  />
                  <circle cx="-2.5" cy="-2.5" r="1.8" fill="#ffffff" />
                </g>
              ))}
            </>
          ) : (
            <>
              {/* Left Eye */}
              <g transform={`translate(-15, ${mood === 'drag' ? 0 : -2})`}>
                <g className="animate-bear-blink">
                  <ellipse cx="0" cy="0" rx="7.3" ry={isWorried ? 8.3 : 7.8} fill="#592506" />
                  <ellipse cx="0" cy="0.3" rx="5.7" ry={isWorried ? 6.6 : 6.2} fill="#1c0901" />
                  <path d="M-3.5 3.6 Q0 5.6 3.5 3.6" fill="none" stroke="#9a4a12" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
                  <circle cx="-2.2" cy="-2.6" r="2.6" fill="#ffffff" />
                  <circle cx="2.1" cy="2.3" r="1.15" fill="#ffffff" opacity="0.88" />
                  {isSad && <ellipse cx="0" cy="4.8" rx="3.2" ry="1.4" fill="#7dd3fc" opacity="0.9" />}
                </g>
              </g>

              {/* Right Eye (Cheerful Wink in happy mood!) */}
              {mood === 'happy' ? (
                <path
                  d="M8 -1 Q15 -9 22 -1"
                  fill="none"
                  stroke="#3b1803"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
              ) : (
                <g transform={`translate(15, ${mood === 'drag' ? 0 : -2})`}>
                  <g className="animate-bear-blink">
                    <ellipse cx="0" cy="0" rx="7.3" ry={isWorried ? 8.3 : 7.8} fill="#592506" />
                    <ellipse cx="0" cy="0.3" rx="5.7" ry={isWorried ? 6.6 : 6.2} fill="#1c0901" />
                    <path d="M-3.5 3.6 Q0 5.6 3.5 3.6" fill="none" stroke="#9a4a12" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
                    <circle cx="-2.2" cy="-2.6" r="2.6" fill="#ffffff" />
                    <circle cx="2.1" cy="2.3" r="1.15" fill="#ffffff" opacity="0.88" />
                    {isSad && <ellipse cx="0" cy="4.8" rx="3.2" ry="1.4" fill="#7dd3fc" opacity="0.9" />}
                  </g>
                </g>
              )}
            </>
          )}

          {/* Expressive Eyebrows */}
          {isWorried || isSad ? (
            <>
              <path d="M-22 -11 L-10 -15" stroke="#692e00" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M10 -15 L22 -11" stroke="#692e00" strokeWidth="2.8" strokeLinecap="round" />
            </>
          ) : mood === 'fever' ? (
            <>
              <path d="M-22 -14 L-9 -10" stroke="#692e00" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M9 -10 L22 -14" stroke="#692e00" strokeWidth="3.2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M-22 -13 Q-15 -17 -9 -13" fill="none" stroke="#7c3602" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M9 -13 Q15 -17 22 -13" fill="none" stroke="#7c3602" strokeWidth="2.4" strokeLinecap="round" />
            </>
          )}

          {/* Sweat Drop Bead when Board is Crowded (worried) */}
          {isWorried && (
            <path
              d="M29 -17 C33 -10 34 -4 29 -4 C24 -4 25 -10 29 -17 Z"
              fill={`url(#${uid}_sweat)`}
              stroke="#0369a1"
              strokeWidth="1.2"
            />
          )}

          {/* Cute 3D Bear Nose */}
          <ellipse cx="0" cy="7.5" rx="6.2" ry="4.4" fill="#2e1304" />
          <ellipse cx="-1.8" cy="6.2" rx="2.1" ry="1.1" fill="#ffffff" opacity="0.65" />

          {/* Expressive Mouth */}
          {isSad ? (
            <path d="M-7 21 Q0 15 7 21" fill="none" stroke="#471d05" strokeWidth="2.6" strokeLinecap="round" />
          ) : isWorried ? (
            <path
              d="M-8 19 Q-4 16 0 19 Q4 22 8 19"
              fill="none"
              stroke="#471d05"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          ) : isHappy ? (
            <g>
              <path
                d="M-10 15 Q0 18 10 15 Q9 26 0 26 Q-9 26 -10 15 Z"
                fill="#7a1c1c"
                stroke="#471d05"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <ellipse cx="0" cy="22.8" rx="5.5" ry="2.6" fill="#fb7185" />
            </g>
          ) : (
            <path
              d="M-7.5 16 Q-3.8 20 0 16 Q3.8 20 7.5 16"
              fill="none"
              stroke="#471d05"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          )}

          {/* Tailored Head Accessories Seated Properly on Bear Head */}
          {accessory === 'none' && (
            <g transform="translate(0, -32) rotate(-6)">
              {/* Graduation Mortarboard Cap */}
              <path d="M-22 6 L-20 -6 L20 -6 L22 6 Q0 12 -22 6 Z" fill="#291d19" stroke="#110b09" strokeWidth="2" />
              <polygon points="0,-19 36,-7 0,5 -36,-7" fill="#3a2923" stroke="#110b09" strokeWidth="2.2" strokeLinejoin="round" />
              <circle cx="0" cy="-7" r="2.8" fill="#fbbf24" />
              <path d="M0 -7 Q18 -3 22 10" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="22.5" cy="13" rx="2.5" ry="4" fill="#f59e0b" />
            </g>
          )}

          {accessory === 'bandana' && (
            <g>
              {/* Fluttering Bandana Tails behind Left Ear */}
              <g transform="translate(-37, -18)">
                <g className="animate-bandana-flutter">
                  <path d="M2 0 L-18 -7 L-14 2 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" />
                  <path d="M2 3 L-15 11 L-9 15 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.6" />
                </g>
              </g>
              {/* Snug Warrior Forehead Headband */}
              <path
                d="M-36 -19 Q0 -29 36 -19 L34 -11 Q0 -21 -34 -11 Z"
                fill="#dc2626"
                stroke="#7f1d1d"
                strokeWidth="2.2"
              />
              <path d="M-30 -17 Q0 -25 30 -17" fill="none" stroke="#fca5a5" strokeWidth="1.6" opacity="0.6" />
              {/* Center Dojo Crest Plate */}
              <rect x="-8" y="-24.5" width="16" height="10" rx="3" fill="#fff7ed" stroke="#991b1b" strokeWidth="1.6" />
              <text x="0" y="-17" textAnchor="middle" fontSize="8" fontWeight="900" fill="#b91c1c">
                K
              </text>
            </g>
          )}

          {accessory === 'crown' && (
            <g transform="translate(0, -34)">
              <path
                d="M-21 10 L-24 -10 L-10 0 L0 -15 L10 0 L24 -10 L21 10 Z"
                fill={`url(#${uid}_crown)`}
                stroke="#78350f"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <rect x="-21" y="7" width="42" height="6" rx="3" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
              <circle cx="0" cy="-2" r="3.4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="-12" cy="3" r="2.2" fill="#38bdf8" />
              <circle cx="12" cy="3" r="2.2" fill="#38bdf8" />
            </g>
          )}

          {accessory === 'visor' && (
            <g transform="translate(0, -2)">
              <path
                d="M-34 -9 Q0 -14 34 -9 L30 7 Q15 11 4 4 Q0 1 -4 4 Q-15 11 -30 7 Z"
                fill="rgba(6, 182, 212, 0.42)"
                stroke="#67e8f9"
                strokeWidth="2.6"
              />
              <path d="M-25 -5 L-11 -6 M11 -6 L25 -5" stroke="#ecfeff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
            </g>
          )}
        </g>

        {/* Celebration Sparkles around Head on Combo / Celebrate */}
        {(mood === 'combo' || mood === 'celebrate') && (
          <g fill="#ffe84d" stroke="#b45309" strokeWidth="0.9">
            <path d="M20 20 L23 26 L29 29 L23 32 L20 38 L17 32 L11 29 L17 26 Z" />
            <path d="M132 18 L134 23 L139 25 L134 27 L132 32 L130 27 L125 25 L130 23 Z" />
          </g>
        )}
      </g>
    </svg>
  );
};
