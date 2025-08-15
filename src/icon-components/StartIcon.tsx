import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const StarIcon: React.FC<SVGProps> = ({ width = 20, height = 20, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.00335 1.72909L6.73599 6.32631L1.66308 7.0659C0.753353 7.19784 0.38877 8.31937 1.04849 8.96173L4.71863 12.5381L3.85058 17.5902C3.69433 18.5034 4.65613 19.1874 5.46169 18.7603L9.99988 16.3749L14.5381 18.7603C15.3436 19.184 16.3054 18.5034 16.1492 17.5902L15.2811 12.5381L18.9513 8.96173C19.611 8.31937 19.2464 7.19784 18.3367 7.0659L13.2638 6.32631L10.9964 1.72909C10.5902 0.909647 9.41307 0.89923 9.00335 1.72909Z"
        fill={fill}
      />
    </svg>
  );
};

export default StarIcon;
