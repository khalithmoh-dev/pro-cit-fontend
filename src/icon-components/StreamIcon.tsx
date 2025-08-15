import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const StreamIcon: React.FC<SVGProps> = ({ width = 18, height = 18, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={fill}
        d="M9 0a9 9 0 100 18 9 9 0 000-18zm0 16.364a7.364 7.364 0 110-14.727 7.364 7.364 0 010 14.727z"
      />
      <path
        fill={fill}
        d="M11.782 8.182H7.364a.818.818 0 00-.818.818v4.909a.818.818 0 00.818.818h4.418a.818.818 0 00.818-.818V9a.818.818 0 00-.818-.818zm-4.909-4.09a1.227 1.227 0 100-2.455 1.227 1.227 0 000 2.455z"
      />
    </svg>
  );
};

export default StreamIcon;
