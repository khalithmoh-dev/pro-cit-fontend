import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4 } from '../theme/color';

const CloseIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = GREY_4 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox="0 0 20 20"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
};

export default CloseIcon;
