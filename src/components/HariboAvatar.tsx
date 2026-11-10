import React from 'react';

interface HariboAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const HariboAvatar: React.FC<HariboAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`inline-flex items-center justify-center flex-shrink-0 select-none ${sizeMap[size]} ${animate ? 'animate-bounceSubtle' : ''} ${className}`}>
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

        {/* Sparkly Cartoon Eyes */}
        <circle cx="37" cy="48" r="5.5" fill="#18181b" />
        <circle cx="35" cy="46" r="2.2" fill="#ffffff" />
        <circle cx="39" cy="50" r="1" fill="#ffffff" />

        {/* Right Eye */}
        <circle cx="63" cy="48" r="5.5" fill="#18181b" />
        <circle cx="61" cy="46" r="2.2" fill="#ffffff" />
        <circle cx="65" cy="50" r="1" fill="#ffffff" />

        {/* Signature Haribo Red Bowtie */}
        <g transform="translate(50, 83) scale(0.95)">
          {/* Left Wing */}
          <polygon points="-2,0 -14,-7 -13,7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Right Wing */}
          <polygon points="2,0 14,-7 13,7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Center Knot */}
          <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
          <circle cx="-0.8" cy="-0.8" r="1.2" fill="#fca5a5" />
        </g>
      </svg>
    </div>
  );
};
