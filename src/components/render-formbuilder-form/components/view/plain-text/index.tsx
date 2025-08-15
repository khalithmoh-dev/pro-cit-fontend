import React from 'react';
import { plainTextErrorHandler } from '../../error-handler';
import TextField from '../../../../textfield';
import { FieldIF } from '../../../../../interface/component.interface';

interface PlainTextPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const PlainText: React.FC<PlainTextPropsIF> = ({ index, form, setForm }) => {
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
    <TextField
      error={field.errorMessage || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(e.target.value)}
      onBlur={onBlur}
      value={field.value}
      label={`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}
    />
  );
};

export default PlainText;
