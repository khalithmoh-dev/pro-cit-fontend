import React, { ReactNode } from 'react';
import style from './dialog.module.css';
import { DialogActionPropsIF } from '../../interface/component.interface';
import Button from '../button';

const DialogAction: React.FC<DialogActionPropsIF> = ({ children, closeButton, onClose, className }) => {
  return (
    <div className={`${style.dialogAction} ${className}`}>
      {closeButton && <Button onClick={onClose}>Cancel</Button>}
      {children}
    </div>
  );
};

export default DialogAction;
