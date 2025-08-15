import React, { useState } from 'react';
import style from './nested-form.module.css';
import { FieldIF } from '../../../../../interface/component.interface';
import RenderFormbuilderForm from '../../..';

interface NestedFormPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const NestedForm: React.FC<NestedFormPropsIF> = ({ index, form, setForm }) => {
  const [open, setOpen] = useState(false);
  const data: FieldIF[] = [...form];
  const field: FieldIF = data[index];

  const onSubmit = (value: any) => {
    field.value = value;
    setForm(data);
    setOpen(false);
  };
  return (
    <div className={style.container}>
      <div className={style.label}>{field.inputLabel}</div>
      <div className={style.inputBox} onClick={() => setOpen(true)}>
        Click to Fill {field.inputLabel}
      </div>
      {field.errorMessage && <div className={style.fieldError}>{field.errorMessage}</div>}
      {open && (
        <RenderFormbuilderForm
          formName={field.inputLabel}
          formHeader={field.inputLabel}
          existingForm={field.value}
          goBack={() => setOpen(false)}
          onSubmit={onSubmit}
          dynamicOptions={[[]]}
          onChange={() => {}}
          large
        />
      )}
    </div>
  );
};

export default NestedForm;
