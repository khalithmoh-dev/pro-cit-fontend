import React from 'react';
import { timeViewErrorHandler } from '../../error-handler';
import TextField from '../../../../textfield';
import { FieldIF } from '../../../../../interface/component.interface';

interface TimeViewPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const TimeView: React.FC<TimeViewPropsIF> = ({ index, form, setForm }) => {
  // const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string) => {
    const updatedData = timeViewErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = timeViewErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------

  return (
    <TextField
      error={field.errorMessage || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(e.target.value)}
      onBlur={onBlur}
      value={field.value}
      label={`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}
      type="time"
    />
  );
};

export default TimeView;

// import React from "react";
// import style from "./date.module.css";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextField } from "../../../../../../global/global-components";

// interface TimeViewPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const TimeView: React.FC<TimeViewPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
//   const update = (e: any) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };

//   return <TextField label={form[index].inputLabel} type="timeView-local" value={form[index].value} onChange={update} />;
// };

// export default TimeView;
