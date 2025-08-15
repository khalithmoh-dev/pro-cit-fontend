import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const MiniLogoIcon: React.FC<SVGProps> = ({ width = 50, height = 25, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="25" fill={fill} />
      <text x="25" y="17" fontFamily="Arial, sans-serif" fontSize="12" fill="white" textAnchor="middle">
        ML
      </text>
    </svg>
  );
};

export default MiniLogoIcon;
