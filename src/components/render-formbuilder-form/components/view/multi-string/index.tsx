import React from 'react';
import { multiStringErrorHandler } from '../../error-handler';
import MultiString from '../../../../multi-string';
import { FieldIF } from '../../../../../interface/component.interface';

interface MultiStringPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const MultiStringInput: React.FC<MultiStringPropsIF> = ({ index, form, setForm }) => {
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: string[]) => {
    const updatedData = multiStringErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------
  const onBlur = () => {
    const updatedData = multiStringErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };
  // -----------------------------------------------------------------

  const value: string[] = field.value[0] ? field.value : [];

  return (
    <MultiString
      error={field.errorMessage || ''}
      onChange={update}
      onBlur={onBlur}
      initialValue={field.value}
      values={value}
      label={`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}
    />
    // <TextField
    //   error={field.errorMessage || ""}
    //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(e.target.value)}
    //   onBlur={onBlur}
    //   value={field.value}
    //   label={`${form[index].inputLabel} ${field.settings[0].value ? " *" : ""}`}
    // />
  );
};

export default MultiStringInput;
