import React from 'react';
import style from './text.module.css';
import { StateIF } from '../../interface';

interface TextInputPropsIF {
  state: StateIF;
  setState: (fields: StateIF) => void;
  index: number;
  i: number;
}

const TextInput: React.FC<TextInputPropsIF> = ({ state, index, i, setState }) => {
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = state.fields.slice();
    data[index].settings[i].value = e.target.value;
    setState({ ...state, fields: data });
  };

  const textInput = `textInput${index}_${i}`; // Generate a unique id for each checkbox

  return (
    <div className={style.inputBox}>
      <div className={style.label}>{state.fields[index].settings[i].name}</div>
      <input type="text" id={textInput} value={state.fields[index].settings[i].value} onChange={update} />
    </div>
  );
};

export default TextInput;
