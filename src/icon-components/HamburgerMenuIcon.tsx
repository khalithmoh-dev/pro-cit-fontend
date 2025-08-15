import React from 'react';

const HamburgerMenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  width = 20,
  height = 20,
  fill = 'grey',
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      aria-hidden="true"
      focusable="false"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
    </svg>
  );
};

export default HamburgerMenuIcon;
