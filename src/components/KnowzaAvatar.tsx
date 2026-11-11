import React from 'react';
import { KnowzaCostume, AvatarFrameId } from '../types';
import { getFrame } from '../data/framesData';

export interface KnowzaAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: KnowzaCostume;
  frameId?: AvatarFrameId;
  showFrameGlow?: boolean;
}

/** Returns the outer ring classes based on frame or costume (fallback) */
function getRingStyle(frameId: AvatarFrameId | undefined, costume: KnowzaCostume): string {
  if (frameId && frameId !== 'none') return ''; // frame handles its own border
  const costumeRings: Record<KnowzaCostume, string> = {
    classic: 'ring-2 ring-amber-400/40',
    king: 'ring-2 ring-amber-500',
    cyber: 'ring-2 ring-cyan-400',
    party: 'ring-2 ring-pink-500',
    graduate: 'ring-2 ring-indigo-500',
    astronaut: 'ring-2 ring-purple-500',
  };
  return costumeRings[costume] ?? 'ring-2 ring-amber-400/40';
}

/**
 * Renders a Knowza-branded SVG avatar frame overlay.
 * Each frame type has its own distinct SVG decoration.
 */
const AvatarFrameOverlay: React.FC<{
  frameId: AvatarFrameId;
  size: number; // px
}> = ({ frameId, size }) => {
  if (frameId === 'none') return null;
  const frame = getFrame(frameId);
  const c = frame.glowColor;
  const c2 = frame.glowColor2 ?? c;
  const r = size / 2;
  const strokeW = size < 36 ? 2.5 : size < 56 ? 3.5 : 4.5;

  /* ── Gold Flame ── */
  if (frameId === 'gold_flame') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`gf-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id={`gf-glow-${size}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#gf-${size})`} strokeWidth={strokeW} filter={`url(#gf-glow-${size})`} />
      {/* Flame tips */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const fx = r + (r - strokeW) * Math.cos(rad);
        const fy = r + (r - strokeW) * Math.sin(rad);
        return <circle key={i} cx={fx} cy={fy} r={size < 40 ? 1.5 : 2.5} fill="#fbbf24" filter={`url(#gf-glow-${size})`} />;
      })}
    </svg>
  );

  /* ── Lightning Bolt ── */
  if (frameId === 'lightning_bolt') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`lb-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id={`lb-glow-${size}`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#lb-${size})`} strokeWidth={strokeW} strokeDasharray="6 4" filter={`url(#lb-glow-${size})`} />
      {/* Bolt icon top-right */}
      <text x={r + r * 0.5} y={r - r * 0.45} textAnchor="middle" dominantBaseline="central" fontSize={size < 40 ? 7 : 10} fill="#facc15" filter={`url(#lb-glow-${size})`}>⚡</text>
    </svg>
  );

  /* ── Cyber Neon ── */
  if (frameId === 'cyber_neon') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`cn-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id={`cn-glow-${size}`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#cn-${size})`} strokeWidth={strokeW} strokeDasharray="3 2" filter={`url(#cn-glow-${size})`} />
      {/* Corner squares */}
      {[[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9]].map(([px, py], i) => (
        <rect key={i} x={px * size - 2.5} y={py * size - 2.5} width={5} height={5} fill="#06b6d4" rx="1" filter={`url(#cn-glow-${size})`} />
      ))}
    </svg>
  );

  /* ── Nature Leaf ── */
  if (frameId === 'nature_leaf') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`nl-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#nl-${size})`} strokeWidth={strokeW} />
      {/* Leaf dots */}
      {[45, 135, 225, 315].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const lx = r + (r - strokeW) * Math.cos(rad);
        const ly = r + (r - strokeW) * Math.sin(rad);
        return <circle key={i} cx={lx} cy={ly} r={size < 40 ? 2 : 3} fill="#22c55e" />;
      })}
    </svg>
  );

  /* ── Cherry Blossom ── */
  if (frameId === 'cherry_blossom') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`cb-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
        <filter id={`cb-glow-${size}`}>
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#cb-${size})`} strokeWidth={strokeW} />
      {/* Petal circles */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const bx = r + (r - strokeW * 0.8) * Math.cos(rad);
        const by = r + (r - strokeW * 0.8) * Math.sin(rad);
        return <circle key={i} cx={bx} cy={by} r={size < 40 ? 2 : 3} fill="#f472b6" filter={`url(#cb-glow-${size})`} />;
      })}
    </svg>
  );

  /* ── Royal Crown ── */
  if (frameId === 'royal_crown') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`rc-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id={`rc-glow-${size}`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#rc-${size})`} strokeWidth={strokeW + 1} filter={`url(#rc-glow-${size})`} />
      {/* Crown at top */}
      <text x={r} y={strokeW + (size < 40 ? 7 : 10)} textAnchor="middle" dominantBaseline="central" fontSize={size < 40 ? 8 : 13} fill="#f59e0b" filter={`url(#rc-glow-${size})`}>👑</text>
    </svg>
  );

  /* ── Blood Web ── */
  if (frameId === 'blood_web') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <filter id={`bw-glow-${size}`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke="#dc2626" strokeWidth={strokeW} strokeDasharray="4 3" filter={`url(#bw-glow-${size})`} />
      {/* Web lines from center to edge */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const ex = r + r * 0.7 * Math.cos(rad);
        const ey = r + r * 0.7 * Math.sin(rad);
        return <line key={i} x1={r} y1={r} x2={ex} y2={ey} stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />;
      })}
      <text x={size - strokeW * 2} y={strokeW + 5} textAnchor="middle" dominantBaseline="central" fontSize={size < 40 ? 7 : 11} fill="#dc2626" filter={`url(#bw-glow-${size})`}>🕷️</text>
    </svg>
  );

  /* ── Cosmic Stars ── */
  if (frameId === 'cosmic_stars') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`cs-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id={`cs-glow-${size}`}>
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#cs-${size})`} strokeWidth={strokeW + 1} filter={`url(#cs-glow-${size})`} />
      {/* Star clusters */}
      {[20, 60, 120, 200, 280, 330].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const sx = r + (r - strokeW * 0.7) * Math.cos(rad);
        const sy = r + (r - strokeW * 0.7) * Math.sin(rad);
        return <circle key={i} cx={sx} cy={sy} r={i % 2 === 0 ? (size < 40 ? 1.5 : 2.5) : (size < 40 ? 1 : 1.5)} fill="#c084fc" filter={`url(#cs-glow-${size})`} />;
      })}
    </svg>
  );

  /* ── Dark Wings ── */
  if (frameId === 'dark_wings') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`dw-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id={`dw-glow-${size}`}>
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#dw-${size})`} strokeWidth={strokeW + 2} filter={`url(#dw-glow-${size})`} />
      {/* Rotating dashes */}
      <circle cx={r} cy={r} r={r - strokeW * 2} fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      <text x={r} y={size - strokeW * 1.5} textAnchor="middle" dominantBaseline="central" fontSize={size < 40 ? 8 : 13} fill="#a78bfa" filter={`url(#dw-glow-${size})`}>🦅</text>
    </svg>
  );

  /* ── Dragon Fire ── */
  if (frameId === 'dragon_fire') return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <linearGradient id={`df-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <filter id={`df-glow-${size}`}>
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={`url(#df-${size})`} strokeWidth={strokeW + 2} filter={`url(#df-glow-${size})`} />
      {/* Fire spikes */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const fx = r + (r - strokeW * 0.4) * Math.cos(rad);
        const fy = r + (r - strokeW * 0.4) * Math.sin(rad);
        return <circle key={i} cx={fx} cy={fy} r={size < 40 ? 2 : 3.5} fill="#fbbf24" filter={`url(#df-glow-${size})`} />;
      })}
      <text x={size - strokeW * 2} y={strokeW + 6} textAnchor="middle" dominantBaseline="central" fontSize={size < 40 ? 7 : 12} fill="#fbbf24" filter={`url(#df-glow-${size})`}>🐉</text>
    </svg>
  );

  /* ── Fallback generic glow ring ── */
  return (
    <svg className="absolute inset-0 pointer-events-none" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ zIndex: 10 }}>
      <defs>
        <filter id={`gen-glow-${size}-${frameId}`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r - strokeW / 2} fill="none" stroke={c} strokeWidth={strokeW} filter={`url(#gen-glow-${size}-${frameId})`} />
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
}) => {
  const sizeMap: Record<string, { cls: string; px: number }> = {
    xs:  { cls: 'w-7 h-7',    px: 28  },
    sm:  { cls: 'w-9 h-9',    px: 36  },
    md:  { cls: 'w-12 h-12',  px: 48  },
    lg:  { cls: 'w-16 h-16',  px: 64  },
    xl:  { cls: 'w-20 h-20',  px: 80  },
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

  // Outer glow shadow via inline style when frame active
  const glowStyle =
    hasFrame && showFrameGlow
      ? { filter: `drop-shadow(0 0 6px ${frame.glowColor})` }
      : undefined;

  const ringClass = getRingStyle(frameId, costume);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-full ${ringClass} ${cls} ${animationClass} ${className}`}
      title={hasFrame ? `${frame.badge} ${frame.name}` : `Knowza Maskot`}
      style={glowStyle}
    >
      {/* Base Mascot Image */}
      <img
        src="/assets/knowza_avatar_circle.png"
        alt="Knowza Maskot"
        className="w-full h-full object-contain rounded-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/knowza_profile_avatar.png';
        }}
      />

      {/* SVG Frame Overlay */}
      {hasFrame && <AvatarFrameOverlay frameId={frameId} size={px} />}
    </div>
  );
};

export default KnowzaAvatar;
