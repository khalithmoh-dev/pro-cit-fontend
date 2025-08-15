import React from 'react';
import style from './boolean.module.css';
import { StateIF } from '../../interface';
import { FieldIF } from '../../../../../../interface/component.interface';

interface BooleanInputPropsIF {
  state: StateIF;
  setState: (state: StateIF) => void;
  index: number;
  i: number;
}

const BooleanInput: React.FC<BooleanInputPropsIF> = ({ state, index, i, setState }) => {
  const fields: FieldIF[] = JSON.parse(JSON.stringify([...state.fields]));
  const { settings } = fields[index];

  const updateCheckbox = (isChecked: boolean) => {
    const updatedFields = [...fields];
    const currentSetting = settings[i];
    const previousSetting = settings[i - 1];
    const nextSetting = settings[i + 1];
    currentSetting.value = isChecked;

    if (currentSetting.settingType === 'expectedFalse') previousSetting.value = !isChecked;
    else if (currentSetting.settingType === 'expectedTrue') nextSetting.value = !isChecked;
    else if (currentSetting.settingType === 'defaultChecked') {
      fields[index].value = isChecked;
      fields[index].initialValue = isChecked;
      currentSetting.value = isChecked;
    } else currentSetting.value = isChecked;

    setState({ ...state, fields: updatedFields });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    updateCheckbox(isChecked);
  };

  const checkboxId = `BooleanInputCheckbox_${index}_${i}`;

  return (
    <div className={style.checkboxContainer}>
      <input
        className={style.checkboxInput}
        type="checkbox"
        id={checkboxId}
        checked={settings[i].value}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={checkboxId} className={style.checkboxLabel}>
        {settings[i].name}
      </label>
    </div>
  );
};

export default BooleanInput;
