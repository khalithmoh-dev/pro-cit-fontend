import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4 } from '../theme/color';

const ArrowDownIcon: React.FC<SVGProps> = ({ width = 30, height = 15, fill = GREY_4 }) => {
  return (
    <svg
      transform="rotate(180)"
      width={width}
      height={height}
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.2501 4.71885L5.53135 1.0001C5.2376 0.706348 4.7626 0.706348 4.47198 1.0001L0.750099 4.71885C0.278224 5.19072 0.612599 6.0001 1.28135 6.0001H8.71885C9.3876 6.0001 9.72198 5.19072 9.2501 4.71885Z"
        fill={fill}
      />
    </svg>
  );
};

export default ArrowDownIcon;
