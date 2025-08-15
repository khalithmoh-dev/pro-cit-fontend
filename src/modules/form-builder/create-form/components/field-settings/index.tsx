import { CreateFormStateIF } from '../..';
import { FieldIF, SettingIF } from '../../../../../interface/component.interface';
import settingTypes from '../input-settings/SettingTypes';
import style from './field-settings.module.css';

interface PropsIF {
  field: FieldIF;
  index: number;
  state: CreateFormStateIF;
  setState: (data: CreateFormStateIF) => void;
}

const FieldSettingsComponent: React.FC<PropsIF> = ({ field, index, state, setState }) => {
  return (
    <div className={style.settingsContainer}>
      <div className={style.settingsInnerContainer}>
        {field.settings.map((data: SettingIF, i: number) => {
          const Element = settingTypes.get(data.settingType);
          return Element ? (
            <div className={style.settingsBox} key={`${field.type}_${i}`}>
              <Element index={index} i={i} state={state} setState={setState} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default FieldSettingsComponent;
