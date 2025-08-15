import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4, PRIMARY } from '../theme/color';

const NumberIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = GREY_4 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.75 7.5C3.75 4.04688 6.54688 1.25 10 1.25C13.4531 1.25 16.25 4.04688 16.25 7.5V12.5C16.25 15.9531 13.4531 18.75 10 18.75C6.54688 18.75 3.75 15.9531 3.75 12.5V7.5ZM10 3.75C7.92969 3.75 6.25 5.42969 6.25 7.5V12.5C6.25 14.5703 7.92969 16.25 10 16.25C12.0703 16.25 13.75 14.5703 13.75 12.5V7.5C13.75 5.42969 12.0703 3.75 10 3.75Z"
        fill={fill}
      />
    </svg>
  );
};

export default NumberIcon;
