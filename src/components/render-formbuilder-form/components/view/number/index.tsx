import React from 'react';
import { numberErrorHandler } from '../../error-handler';
import TextField from '../../../../textfield';
import { FieldIF } from '../../../../../interface/component.interface';

interface NumberPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const Number: React.FC<NumberPropsIF> = ({ index, form, setForm }) => {
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string) => {
    const updatedData = numberErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = numberErrorHandler(field, field.value);
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
      type="number"
    />
  );
};

export default Number;

// import React from "react";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextField } from "../../../../../../global/global-components";

// interface NumberPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const Number: React.FC<NumberPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
//   const update = (e: React.ChangeEvent<HTMLInputElement>) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };
//   return (
//     <TextField type="number" onChange={update} value={data[index].value} label={form[index].inputLabel} />
//   );

// };

// export default Number;
