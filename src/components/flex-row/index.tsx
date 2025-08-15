import React from 'react';
import style from './flexRow.module.css';
import { FlexPropsIF } from '../../interface/component.interface';

const FlexRow: React.FC<FlexPropsIF> = ({
  children,
  className = '',
  center = false,
  end = false,
  between = false,
  around = false,
  evenly = false,
  alignCenter = false,
  fullWidth = false,
  fitWidth = false,
  minWidth = false,
  maxWidth = false,
  fitHeight = false,
  minHeight = false,
  maxHeight = false,
  gap,
}) => {
  return (
    <div
      style={{ gap: gap ? gap : 0 }}
      className={`
        ${style.container}
        ${className}
        ${center && style.center}
        ${end && style.end}
        ${alignCenter && style.alignCenter}
        ${fullWidth && style.fullWidth}
        ${gap && style.gap}
        ${between && style.between}
        ${around && style.around}
        ${evenly && style.evenly}
        ${fitWidth && style.fitWidth}
        ${minWidth && style.minWidth}
        ${maxWidth && style.maxWidth}
        ${fitHeight && style.fitHeight}
        ${minHeight && style.minHeight}
        ${maxHeight && style.maxHeight}
      `}
    >
      {children}
    </div>
  );
};

export default FlexRow;
