import React from 'react';
import { KnowzaCostume } from '../types';

export interface KnowzaAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: KnowzaCostume;
}

export const KnowzaAvatar: React.FC<KnowzaAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false,
  costume = 'classic'
}) => {
  const sizeMap = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
    '2xl': 'w-24 h-24 text-xl'
  };

  const animationClass =
    animate === 'dance' || costume === 'party'
      ? 'animate-dance'
      : animate === 'wiggle'
      ? 'animate-wiggle'
      : animate === true || animate === 'bounce'
      ? 'animate-bounceSubtle'
      : '';

  // Costume specific ring styles
  const costumeRings: Record<KnowzaCostume, string> = {
    classic: 'ring-2 ring-amber-400/40 shadow-amber-500/10',
    king: 'ring-3 ring-amber-500 shadow-amber-500/40',
    cyber: 'ring-3 ring-cyan-400 shadow-cyan-500/40',
    party: 'ring-3 ring-pink-500 shadow-pink-500/40',
    graduate: 'ring-3 ring-indigo-500 shadow-indigo-500/40',
    astronaut: 'ring-3 ring-purple-500 shadow-purple-500/40'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-full ${costumeRings[costume] || ''} ${sizeMap[size]} ${animationClass} ${className}`}
      title={`Knowza Maskot (${costume})`}
    >
      {/* Base 3D Yellow Bear Avatar with Graduation Cap */}
      <img
        src="/assets/knowza_avatar_circle.png"
        alt="Knowza Maskot"
        className="w-full h-full object-contain filter drop-shadow-sm rounded-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/knowza_profile_avatar.png';
        }}
      />

      {/* Dynamic Costume Accessories Overlay */}
      {costume === 'king' && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 filter drop-shadow-md pointer-events-none transform -rotate-3"
          style={{ fontSize: '0.8em' }}
          title="Kral Tacı"
        >
          👑
        </span>
      )}

      {costume === 'cyber' && (
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 filter drop-shadow-sm pointer-events-none opacity-90"
          style={{ fontSize: '0.7em' }}
          title="Siberpunk Vizör"
        >
          🕶️
        </span>
      )}

      {costume === 'party' && (
        <>
          <span
            className="absolute -top-1.5 -right-1 filter drop-shadow-xs pointer-events-none transform rotate-12"
            style={{ fontSize: '0.65em' }}
          >
            ⭐
          </span>
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-85"
            style={{ fontSize: '0.65em' }}
          >
            🕶️
          </span>
        </>
      )}

      {costume === 'graduate' && (
        <span
          className="absolute -bottom-1 -right-1 filter drop-shadow-sm pointer-events-none"
          style={{ fontSize: '0.65em' }}
          title="Mezuniyet Diploması"
        >
          📜
        </span>
      )}

      {costume === 'astronaut' && (
        <span
          className="absolute -top-1 -right-1 filter drop-shadow-sm pointer-events-none transform -rotate-12"
          style={{ fontSize: '0.7em' }}
          title="Astronot Kaskı"
        >
          🚀
        </span>
      )}
    </div>
  );
};

export default KnowzaAvatar;
