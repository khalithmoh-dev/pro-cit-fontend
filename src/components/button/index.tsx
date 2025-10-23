import React from "react";
import { ButtonPropsIF } from '../../interface/component.interface';
import style from './button.module.css';

const Button: React.FC<ButtonPropsIF> = ({
  className = '',
  secondary = false,
  children,
  fullWidth = false,
  disabled = false,
  submit = false,
  startIcon,
  endIcon,
  onClick,
  large = false,
  small = false,
  mt,
}) => {
  const classNames = [
    style.button,
    fullWidth && style.fullWidth,
    large && style.large,
    small && style.small,
    secondary && style.secondary,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  return (
    <button
      type={submit ? 'submit' : 'button'}
      style={{ marginTop: mt ?? 0 }}
      onClick={clickHandler}
      disabled={disabled}
      className={classNames}
    >
      {startIcon && <span className={style.icon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={style.icon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
