import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const LogoIcon: React.FC<SVGProps> = ({ width = 160, height = 50, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="50" fill={fill} />
      <text x="80" y="30" fontFamily="Arial, sans-serif" fontSize="20" fill="white" textAnchor="middle">
        AI ML Apps
      </text>
    </svg>
  );
};

export default LogoIcon;
