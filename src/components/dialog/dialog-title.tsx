import React, { ReactNode } from 'react';
import style from './dialog.module.css';
import { DialogTitlePropsIF } from '../../interface/component.interface';
import CloseIcon from '../../icon-components/CloseIcon';

const DialogTitle: React.FC<DialogTitlePropsIF> = ({ children, onClose }) => {
  return (
    <div className={style.dialogTitle}>
      {children}{' '}
      <span onClick={onClose}>
        <CloseIcon />
      </span>
    </div>
  );
};

export default DialogTitle;
