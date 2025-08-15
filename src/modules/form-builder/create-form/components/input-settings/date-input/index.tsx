import React from 'react';
import style from './date.module.css';
import { StateIF } from '../../interface';

interface DateInputPropsIF {
  state: StateIF;
  setState: (fields: StateIF) => void;
  index: number;
  i: number;
}

const DateInput: React.FC<DateInputPropsIF> = ({ state, index, i, setState }) => {
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = state.fields.slice();
    data[index].settings[i].value = e.target.value;
    setState({ ...state, fields: data });
  };

  const dateInput = `dateInput${index}_${i}`; // Generate a unique id for each checkbox
  const settings = state.fields[index].settings;
  state.fields[index].settings;
  state.fields[index].settings;
  const label = settings[i].name;
  const minDate = label === 'Min Date';

  return (
    <div className={style.inputBox}>
      <div className={style.label}>{label}</div>
      <input
        type="date"
        min={minDate ? '' : settings[i - 1].value}
        max={minDate ? settings[i + 1].value : ''}
        id={dateInput}
        value={settings[i].value}
        onChange={update}
      />
    </div>
  );
};

export default DateInput;
