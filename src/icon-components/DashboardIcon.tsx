import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const DashboardIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 1.25H2.5C2.16848 1.25 1.85054 1.3817 1.61612 1.61612C1.3817 1.85054 1.25 2.16848 1.25 2.5L1.25 17.5C1.25 17.8315 1.3817 18.1495 1.61612 18.3839C1.85054 18.6183 2.16848 18.75 2.5 18.75H17.5C17.8315 18.75 18.1495 18.6183 18.3839 18.3839C18.6183 18.1495 18.75 17.8315 18.75 17.5V2.5C18.75 2.16848 18.6183 1.85054 18.3839 1.61612C18.1495 1.3817 17.8315 1.25 17.5 1.25ZM16.25 3.75V8.75H11.25V3.75H16.25ZM8.75 3.75V8.75H3.75V3.75H8.75ZM3.75 16.25V11.25H8.75V16.25H3.75ZM11.25 16.25V11.25H16.25V16.25H11.25Z"
        fill={fill}
      />
    </svg>
  );
};

export default DashboardIcon;
