import React, { useState } from 'react';
import style from './rating.module.css';
import { ratingErrorHandler } from '../../error-handler';
import StarRating from '../../star-rating';
import { FieldIF } from '../../../../../interface/component.interface';

interface RatingPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const RatingView: React.FC<RatingPropsIF> = ({ index, form, setForm }) => {
  const data: FieldIF[] = [...form];
  let field = data[index];
  // -----------------------------------------------------------------

  const update = (inputValue: number) => {
    const updatedData = ratingErrorHandler(field, inputValue);
    field = updatedData;
    setForm(data);
  };
  const onPointerLeave = () => {
    const updatedData = ratingErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };

  const error = field.errorMessage;
  return (
    <div className={style.container}>
      <div className={`${style.fieldContainer}`}>
        <div className={style.fieldLabel}>{`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}</div>
        <div className={`${style.inputWrapper} ${error && style.inputFieldError}`}>
          {/* <Rating size={22} onClick={update} onPointerLeave={onPointerLeave} /> */}
          <StarRating totalStars={5} onClick={update} onPointerLeave={onPointerLeave} />
        </div>
        {error && <div className={style.fieldError}>{error}</div>}
      </div>
    </div>
  );
};

export default RatingView;
