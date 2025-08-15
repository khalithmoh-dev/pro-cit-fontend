import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4 } from '../theme/color';

const SendIcon: React.FC<SVGProps> = ({ width = 24, height = 24, fill = GREY_4 }) => {
  return (
    <svg
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="SendIcon"
      aria-label="fontSize medium"
      width={width}
      height={height}
      fill={fill}
    >
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
  );
};

export default SendIcon;
