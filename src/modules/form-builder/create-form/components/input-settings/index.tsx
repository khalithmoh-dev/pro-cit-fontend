// Settings.tsx
import React from 'react';
import style from './settings.module.css';
import { StateIF } from '../interface';
import { FieldIF, SettingIF } from '../../../../../interface/component.interface';

interface PropsIF {
  index: number;
  field: FieldIF;
  state: StateIF;
  setState: (state: StateIF) => void;
  settingTypes: Map<string, React.FC<any>>;
}

const InputSettings: React.FC<PropsIF> = ({ index, field, state, setState, settingTypes }) => {
  return (
    <div className={style.settingsContainer}>
      {field.settings.map((data: SettingIF, i: number) => {
        const Element = settingTypes.get(data.settingType);
        return Element ? (
          <div className={style.settingsBox} key={`${field.type}_${i}`}>
            <Element index={index} i={i} state={state} setState={setState} />
            {/* Add more conditions for other setting types */}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default InputSettings;
