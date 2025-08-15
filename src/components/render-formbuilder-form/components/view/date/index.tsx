import React from 'react';
import { dateViewErrorHandler } from '../../error-handler';
import TextField from '../../../../textfield';
import { FieldIF } from '../../../../../interface/component.interface';

interface DateViewPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const DateView: React.FC<DateViewPropsIF> = ({ index, form, setForm }) => {
  // const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string) => {
    const updatedData = dateViewErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = dateViewErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------

  return (
    <TextField
      error={field.errorMessage || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(e.target.value)}
      onBlur={onBlur}
      value={field.value.split('T')[0]}
      label={`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}
      type="date"
      min={field.settings[1].value}
      max={field.settings[2].value}
    />
  );
};

export default DateView;

// import React from "react";
// import style from "./date.module.css";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextField } from "../../../../../../global/global-components";

// interface DateViewPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const DateView: React.FC<DateViewPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
//   const update = (e: any) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };

//   return <TextField label={form[index].inputLabel} type="dateView-local" value={form[index].value} onChange={update} />;
// };

// export default DateView;
