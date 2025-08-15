import { ChangeEvent } from 'react';
import style from './textfield.module.css';
import { TextFieldPropsIF } from '../../interface/component.interface';


const TextField: React.FC<TextFieldPropsIF> = ({ defaultValue, className, error, disabled, placeholder, label, name, value, onChange, onBlur, type, min, max }) => {
  return (
    <div className={`${style.fieldContainer} ${className}`}>
      <div className={style.fieldLabel}>{label}</div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type ? type : 'text'}
        placeholder={placeholder}
        className={`${style.textInput} ${error && style.inputFieldError}`}
        min={min}
        max={max}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default TextField;
