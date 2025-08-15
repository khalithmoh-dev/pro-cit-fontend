import React, { FC, ReactNode, useRef, useState } from 'react';
import style from './dialog.module.css';
import { DialogPropsIF } from '../../interface/component.interface';

const Dialog: FC<DialogPropsIF> = ({ isOpen, onClose, children, small, wide, medium, fullHeight, className }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Adjust as needed to match CSS transition duration
  };

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div onClick={handleClose} className={`${style.dialog} ${isClosing ? style.closing : ''}`}>
      <div
        ref={dialogRef}
        onClick={handleContentClick}
        className={`${style.content} ${wide && style.wide} ${small && style.small} ${medium && style.medium} ${fullHeight && style.fullHeight} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
