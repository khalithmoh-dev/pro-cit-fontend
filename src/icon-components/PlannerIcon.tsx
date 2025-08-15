import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const PlannerIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2071_525)">
        <path
          d="M5.33594 5.42158C4.94362 5.53247 4.58437 5.73762 4.28949 6.01915C3.99462 6.30068 3.77307 6.65005 3.64414 7.03682L0 17.9688L0.573828 18.5427L6.4375 12.679C6.3207 12.4345 6.25 12.1642 6.25 11.8751C6.25 10.8396 7.08945 10.0001 8.125 10.0001C9.16055 10.0001 10 10.8396 10 11.8751C10 12.9106 9.16055 13.7501 8.125 13.7501C7.83594 13.7501 7.56562 13.6794 7.32109 13.5626L1.45742 19.4263L2.03125 20.0001L12.9633 16.356C13.35 16.227 13.6994 16.0055 13.9809 15.7106C14.2625 15.4157 14.4676 15.0565 14.5785 14.6642L16.25 8.7501L11.25 3.7501L5.33594 5.42158ZM19.4508 2.89736L17.1027 0.549316C16.3703 -0.183105 15.1824 -0.183105 14.45 0.549316L12.241 2.7583L17.2418 7.75908L19.4508 5.5501C20.1832 4.81768 20.1832 3.63018 19.4508 2.89736Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_2071_525">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlannerIcon;
