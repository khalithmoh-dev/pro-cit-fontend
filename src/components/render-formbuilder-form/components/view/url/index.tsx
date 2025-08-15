import React from 'react';
import { urlErrorHandler } from '../../error-handler';
import TextField from '../../../../textfield';
import { FieldIF } from '../../../../../interface/component.interface';

interface UrlPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const Url: React.FC<UrlPropsIF> = ({ index, form, setForm }) => {
  // const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string) => {
    const updatedData = urlErrorHandler(field, inputValue);

    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = urlErrorHandler(field, field.value);
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
    />
  );
};

export default Url;

// import React from "react";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextField } from "../../../../../../global/global-components";

// interface UrlPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const Url: React.FC<UrlPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
//   const update = (e: React.ChangeEvent<HTMLInputElement>) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };
//   return (
//     <TextField type="url" onChange={update} value={data[index].value} label={form[index].inputLabel} />
//   );

// };

// export default Url;

// import React from "react";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextField } from "../../../../../../global/global-components";

// interface UrlPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const Url: React.FC<UrlPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
//   const update = (e: React.ChangeEvent<HTMLInputElement>) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };
//   return (
//     <TextField type="url" onChange={update} value={data[index].value} label={form[index].inputLabel} />
//   );

// };

// export default Url;
