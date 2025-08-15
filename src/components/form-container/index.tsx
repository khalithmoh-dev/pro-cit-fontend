import { ReactNode } from 'react';
import style from './form-container.module.css';
import { FormContainerPropsIF } from '../../interface/component.interface';

const FormContainer: React.FC<FormContainerPropsIF> = ({ children, headerText, className, fullWidth }) => {
  return (
    <div className={`${style.formContainer} ${className} ${fullWidth ? style.fullWidth : ''}`}>
      <div className={style.formHeaderText}>{headerText}</div>
      {children}
    </div>
  );
};

export default FormContainer;
