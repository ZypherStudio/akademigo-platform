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
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const animationClass =
    animate === 'dance' || costume === 'party'
      ? 'animate-dance'
      : animate === 'wiggle'
      ? 'animate-wiggle'
      : animate === true || animate === 'bounce'
      ? 'animate-bounceSubtle'
      : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${sizeMap[size]} ${animationClass} ${className}`}
      title="Knowza 3D Maskot"
    >
      <img
        src="/assets/knowza_avatar_circle.png"
        alt="Knowza Maskot"
        className="w-full h-full object-contain filter drop-shadow-sm"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/knowza_profile_avatar.png';
        }}
      />
    </div>
  );
};

export default KnowzaAvatar;
