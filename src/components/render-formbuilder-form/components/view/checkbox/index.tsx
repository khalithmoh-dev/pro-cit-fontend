import React, { useEffect } from 'react';
import style from './checkbox.module.css';
import { FieldIF } from '../../../../../interface/component.interface';

interface CheckboxPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const Checkbox: React.FC<CheckboxPropsIF> = ({ index, form, setForm }) => {
  const updatedForm: FieldIF[] = JSON.parse(JSON.stringify([...form]));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatedForm[index].value = e.target.checked;

    if (updatedForm[index].settings[1].value) {
      if (!e.target.checked) {
        updatedForm[index].errorMessage = 'error';
        setForm(updatedForm);
        return;
      } else {
        updatedForm[index].errorMessage = '';
        setForm(updatedForm);
        return;
      }
    }
    if (updatedForm[index].settings[2].value) {
      if (e.target.checked) {
        updatedForm[index].errorMessage = 'error';
        setForm(updatedForm);
        return;
      } else {
        updatedForm[index].errorMessage = '';
        setForm(updatedForm);
        return;
      }
    }

    setForm(updatedForm);
  };
  const error = Boolean(updatedForm[index].errorMessage);
  const checkboxId = `Checkbox_${index}`;

  return (
    <div className={`${style.checkboxContainer} `}>
      <input
        className={style.checkboxInput}
        type="checkbox"
        id={checkboxId}
        checked={form[index].value}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={checkboxId} className={`${style.checkboxLabel} ${error && style.errorLabel}`}>
        {form[index].inputLabel}
      </label>
    </div>
  );
};

export default Checkbox;

// import React from "react";
// import { FieldIF } from "../../../../../../interface/data.interface";
// import style from "./checkbox.module.css";

// interface CheckboxPropsIF {
//   form: FieldIF[];
//   setForm: (fields: FieldIF[]) => void;
//   index: number;
// }

// const Checkbox: React.FC<CheckboxPropsIF> = ({ index, form, setForm }) => {
//   // Deep copy the form data to prevent mutation
//   const updatedForm:FieldIF[] = form.map(field => ({ ...field }));

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const updatedForm:FieldIF[] = [...updatedForm];
//     updatedForm[index].value = e.target.checked;
//     setForm(updatedForm);
//   };

//   const error=Boolean(updatedForm[index].errorMessage)

//   const checkboxId = `Checkbox_${index}`;

//   return (
//     <div   className={`${style.checkboxContainer} ${!error && style.errorLabel}`}>
//       <input
//         type="checkbox"
//         id={checkboxId}
//         defaultChecked={form[index].settings[2].value}
//         onChange={handleCheckboxChange}
//       />
//       <label htmlFor={checkboxId} className={`${style.checkboxLabel} ${!error && style.errorLabel}`}>
//         {form[index].inputLabel}
//       </label>
//     </div>
//   );
// };

// export default Checkbox;
