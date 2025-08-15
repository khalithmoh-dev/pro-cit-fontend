import React from 'react';
import style from './number.module.css';
import { StateIF } from '../../interface';
import { FieldIF } from '../../../../../../interface/component.interface';

interface NumberInputPropsIF {
  state: StateIF;
  setState: (state: StateIF) => void;
  index: number;
  i: number;
}

const NumberInput: React.FC<NumberInputPropsIF> = ({ state, index, i, setState }) => {
  const fields: FieldIF[] = JSON.parse(JSON.stringify([...state.fields]));
  const { settings } = fields[index];

  const updateNumber = (value: string) => {
    const inputValue = Number(value);
    const updatedFields = [...fields];
    const currentSetting = settings[i];
    const previousSetting = settings[i - 1];
    const nextSetting = settings[i + 1];
    currentSetting.value = inputValue;

    if (currentSetting.settingType === 'minLength' || currentSetting.settingType === 'min') {
      if (nextSetting.value < inputValue) currentSetting.value = nextSetting.value;
      else currentSetting.value = value;
    } else if (currentSetting.settingType === 'maxLength' || currentSetting.settingType === 'max') {
      if (previousSetting.value > inputValue) currentSetting.value = previousSetting.value;
      else currentSetting.value = value;
    } else {
      currentSetting.value = value;
    }

    setState({ ...state, fields: updatedFields });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.value;
    updateNumber(isChecked);
  };

  const numberId = `NumberInputNumber_${index}_${i}`;

  return (
    <div className={style.inputBox}>
      <label htmlFor={numberId} className={style.label}>
        {settings[i].name}
      </label>
      <input
        // className={style.numberInput}
        type="number"
        id={numberId}
        value={settings[i].value}
        onChange={handleNumberChange}
      />
    </div>
  );
};

export default NumberInput;
