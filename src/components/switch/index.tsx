import React from 'react';
import styles from './switch.module.css';
import { SwitchPropsIF } from '../../interface/component.interface';

const Switch: React.FC<SwitchPropsIF> = ({ checked, onChange, size = 'medium', color = '#2196F3' }) => {
  const sizeStyles = {
    small: { '--switch-width': '30px', '--switch-height': '15px' },
    medium: { '--switch-width': '40px', '--switch-height': '20px' },
    large: { '--switch-width': '50px', '--switch-height': '25px' },
  };

  return (
    // @ts-ignore
    <label className={styles.switch} style={{ ...sizeStyles[size], '--switch-color': color } as React.CSSProperties}>
      <input className={styles.input} type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default Switch;
