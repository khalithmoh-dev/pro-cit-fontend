import React, { ReactNode } from 'react';
import style from './dialog.module.css';
import { DialogBodyPropsIF } from '../../interface/component.interface';

const DialogBody: React.FC<DialogBodyPropsIF> = ({ children }) => {
  return <div className={style.dialogBody}>{children}</div>;
};

export default DialogBody;
