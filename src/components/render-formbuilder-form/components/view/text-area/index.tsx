import React from 'react';
import { plainTextErrorHandler } from '../../error-handler';
import TextArea from '../../../../textArea';
import { FieldIF } from '../../../../../interface/component.interface';

interface MultiLineTextPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const MultiLineText: React.FC<MultiLineTextPropsIF> = ({ index, form, setForm }) => {
  // const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string) => {
    const updatedData = plainTextErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = plainTextErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------

  return (
    <TextArea
      error={field.errorMessage || ''}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update(e.target.value)}
      onBlur={onBlur}
      value={field.value}
      label={`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}
    />
  );
};

export default MultiLineText;

// import React from "react";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import { TextArea } from "../../../../../../global/global-components";

// interface TextAreaPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const MultiLineText: React.FC<TextAreaPropsIF> = ({ index, form, setForm }) => {
//   const data: FieldIF[] = JSON.parse(JSON.stringify([...form]));

//   const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     data[index].value = e.target.value;
//     setForm(data);
//   };

//     return (
//       <TextArea  onChange={update} value={data[index].value} label={form[index].inputLabel} />
//     );

// };

// export default MultiLineText;
