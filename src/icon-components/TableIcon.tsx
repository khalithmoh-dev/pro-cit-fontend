import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4, PRIMARY } from '../theme/color';

const TableIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = GREY_4 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 10V6.25H8.75V10H2.5ZM2.5 12.5H8.75V16.25H2.5V12.5ZM11.25 16.25V12.5H17.5V16.25H11.25ZM17.5 10H11.25V6.25H17.5V10ZM2.5 1.25C1.12109 1.25 0 2.37109 0 3.75V16.25C0 17.6289 1.12109 18.75 2.5 18.75H17.5C18.8789 18.75 20 17.6289 20 16.25V3.75C20 2.37109 18.8789 1.25 17.5 1.25H2.5Z"
        fill={fill}
      />
    </svg>
  );
};

export default TableIcon;
