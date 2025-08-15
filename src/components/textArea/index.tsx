import { ChangeEvent } from 'react';
import style from './textArea.module.css';
import { TextAreaPropsIF } from '../../interface/component.interface';

const TextArea: React.FC<TextAreaPropsIF> = ({
  className,
  error,
  placeholder,
  label,
  name,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className={`${style.fieldContainer} ${className}`}>
      <div className={style.fieldLabel}>{label}</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${style.textInput} ${error && style.inputFieldError}`}
      />
      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default TextArea;
