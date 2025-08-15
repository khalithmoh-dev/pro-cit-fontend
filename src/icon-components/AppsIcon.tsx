import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const AppsIcon: React.FC<SVGProps> = ({ width = 18, height = 18, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={fill}
        d="M2.7 1.8h1.8v1.8H2.7V1.8zm3.6 0h1.8v1.8H6.3V1.8zm3.6 0h1.8v1.8H9.9V1.8zm3.6 0h1.8v1.8h-1.8V1.8zM2.7 5.4h1.8v1.8H2.7V5.4zm3.6 0h1.8v1.8H6.3V5.4zm3.6 0h1.8v1.8H9.9V5.4zm3.6 0h1.8v1.8h-1.8V5.4zM2.7 9h1.8v1.8H2.7V9zm3.6 0h1.8v1.8H6.3V9zm3.6 0h1.8v1.8H9.9V9zm3.6 0h1.8v1.8h-1.8V9zM2.7 12.6h1.8v1.8H2.7v-1.8zm3.6 0h1.8v1.8H6.3v-1.8zm3.6 0h1.8v1.8H9.9v-1.8zm3.6 0h1.8v1.8h-1.8v-1.8zM2.7 16.2h1.8v1.8H2.7v-1.8zm3.6 0h1.8v1.8H6.3v-1.8zm3.6 0h1.8v1.8H9.9v-1.8zm3.6 0h1.8v1.8h-1.8v-1.8z"
      />
    </svg>
  );
};

export default AppsIcon;
