// Slider.tsx

import React, { useState } from 'react';
import styles from './slider.module.css';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
  label: string;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value = 0, onChange, label }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={styles.sliderContainer}>
      <span className={styles.label}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleSliderChange}
        className={styles.slider}
      />
      <span className={styles.value}>{currentValue}</span>
    </div>
  );
};

export default Slider;
