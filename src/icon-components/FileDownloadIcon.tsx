import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4 } from '../theme/color';

const FileDownloadIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = GREY_4 }) => {
  return (
    <svg
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="FileDownloadIcon"
      width={width}
      height={height}
      fill={fill}
    >
      <path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z"></path>
    </svg>
  );
};

export default FileDownloadIcon;
