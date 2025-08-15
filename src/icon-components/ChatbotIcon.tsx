import React from 'react';
import { SVGProps } from './ArrowLeftIcon';
import { PRIMARY } from '../theme/color';

const ChatbotIcon: React.FC<SVGProps> = ({ width = 18, height = 18, fill = PRIMARY }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={fill}
        d="M9 0C4.029 0 0 4.029 0 9c0 1.881.579 3.624 1.566 5.067L0 18l3.933-1.566A8.956 8.956 0 009 18c4.971 0 9-4.029 9-9s-4.029-9-9-9zm0 16.364c-1.516 0-2.932-.463-4.114-1.261l-.3-.205-2.261.897.897-2.261-.205-.3C2.1 12.932 1.636 11.516 1.636 9 1.636 5.297 5.297 1.636 9 1.636S16.364 5.297 16.364 9c0 3.703-3.661 7.364-7.364 7.364z"
      />
      <path
        fill={fill}
        d="M5.973 7.364a1.227 1.227 0 100-2.455 1.227 1.227 0 000 2.455zM12.727 7.364a1.227 1.227 0 100-2.455 1.227 1.227 0 000 2.455zM9 9.818a3.682 3.682 0 00-3.682 3.682h7.364A3.682 3.682 0 009 9.818z"
      />
    </svg>
  );
};

export default ChatbotIcon;
