import React from 'react';
import { HariboCostume } from '../types';

interface HariboAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: HariboCostume;
}

export const HariboAvatar: React.FC<HariboAvatarProps> = ({
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
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFE29A] to-[#FFB800] p-0.5 shadow-sm border border-amber-300/60 ${sizeMap[size]} ${animationClass} ${className}`}
    >
      <img
        src="/assets/knowza_icon.png"
        alt="Knowza Maskot"
        className="w-full h-full object-cover rounded-[14px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/knowza_profile_avatar.png';
        }}
      />
    </div>
  );
};
