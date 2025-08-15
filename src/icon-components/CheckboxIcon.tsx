import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { GREY_4, PRIMARY } from '../theme/color';

const CheckboxIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = GREY_4 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.8571 20H2.14286C0.959375 20 0 19.0406 0 17.8571V2.14286C0 0.959375 0.959375 0 2.14286 0H17.8571C19.0406 0 20 0.959375 20 2.14286V17.8571C20 19.0406 19.0406 20 17.8571 20ZM8.71937 15.6224L16.9337 7.40808C17.2126 7.12915 17.2126 6.67688 16.9337 6.39795L15.9235 5.38781C15.6446 5.10888 15.1923 5.10884 14.9133 5.38781L8.21429 12.0868L5.08665 8.9592C4.80772 8.68027 4.35545 8.68027 4.07647 8.9592L3.06634 9.96933C2.78741 10.2483 2.78741 10.7005 3.06634 10.9795L7.7092 15.6223C7.98817 15.9013 8.4404 15.9013 8.71937 15.6224Z"
        fill={fill}
      />
    </svg>
  );
};

export default CheckboxIcon;
