import React from 'react';
import { HariboAvatar } from './HariboAvatar';
import { KnowzaCostume } from '../types';

interface KnowzaAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean | 'bounce' | 'dance' | 'wiggle';
  costume?: KnowzaCostume;
}

export const KnowzaAvatar: React.FC<KnowzaAvatarProps> = (props) => {
  return <HariboAvatar {...props} />;
};

export default KnowzaAvatar;
