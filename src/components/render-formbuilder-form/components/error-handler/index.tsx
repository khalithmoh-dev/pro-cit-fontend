import { FieldIF } from '../../../../interface/component.interface';
import {
  containsOnlyLettersWithSingleSpace,
  isIncorrectEmail,
  isIncorrectUrl,
  containsOnlyLettersAndNumbers,
} from './functions';

export const plainTextErrorHandler = (field: FieldIF, inputValue: string) => {
  const nonEmpty = field.settings[0].value;
  const minLength = field.settings[1].value;
  const maxLength = field.settings[2].value;
  const onlyLetters = field.settings[3] && field.settings[3].value;
  const onlyLettersAndNumbers = field.settings[4] && field.settings[4].value;
  const inputLength = inputValue.length;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else if (minLength && inputLength < minLength) field.errorMessage = `Minimum character length is ${minLength}`;
  else if (maxLength && inputLength > maxLength) field.errorMessage = `Maximum character length is ${maxLength}`;
  else if (onlyLetters && !containsOnlyLettersWithSingleSpace(inputValue))
    field.errorMessage = `Only letters with single space allowed`;
  else if (onlyLettersAndNumbers && !containsOnlyLettersAndNumbers(inputValue))
    field.errorMessage = `Only letters and numbers allowed`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const multiStringErrorHandler = (field: FieldIF, inputValue: string[]): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue[0]) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};

export const numberErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  // const noDecimals = field.settings[1].value;
  const min = field.settings[2].value;
  const max = field.settings[3].value;
  const minDigit = field.settings[4].value;
  const maxDigit = field.settings[5].value;
  const value = Number(inputValue);
  if (nonEmpty && inputValue === '0') field.errorMessage = 'This field should be non zero';
  else if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  // else if (noDecimals && inputValue?.includes(".")) field.errorMessage = `Decimals not allowed`;
  else if (inputValue && min && value < min) field.errorMessage = `Minimum number is ${min}`;
  else if (inputValue && max && value > max) field.errorMessage = `Maximum number is ${max}`;
  else if (inputValue && minDigit && inputValue.length < minDigit) field.errorMessage = `Minimum Digit is ${minDigit}`;
  else if (inputValue && maxDigit && inputValue.length > maxDigit) field.errorMessage = `Maximum Digit is ${maxDigit}`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const emailErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  const exceptDomains: any = field.settings[1].value;
  const onlyDomains: any = field.settings[2].value;

  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else if (isIncorrectEmail(inputValue)) field.errorMessage = 'Incorrect Email Address';
  else if (exceptDomains.length) {
    let error = false;
    exceptDomains.split(',').forEach((domain:any) => {
      const regex = new RegExp('(?:[^\\w]|^)' + domain + '(?:[^\\w]|$)');

      if (regex.test(inputValue)) {
        error = true;
      }
    });
    if (error) field.errorMessage = 'This domain is not a allowed';
    else field.errorMessage = '';
  } else if (onlyDomains.length) {
    let error = true;
    onlyDomains.split(',').forEach((domain:any) => {
      const regex = new RegExp('(?:[^\\w]|^)' + domain + '(?:[^\\w]|$)');

      if (regex.test(inputValue)) {
        error = false;
      }
    });
    if (error) field.errorMessage = `Only ${onlyDomains} domain is allowed`;
    else field.errorMessage = '';
  } else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const urlErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  const exceptDomains: string = field.settings[1].value;
  const onlyDomains: string = field.settings[2].value;

  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else if (isIncorrectUrl(inputValue)) field.errorMessage = 'Incorrect Url';
  else if (exceptDomains.length) {
    let error = false;
    exceptDomains.split(',').forEach((domain) => {
      const regex = new RegExp('(?:[^\\w]|^)' + domain + '(?:[^\\w]|$)');
      if (regex.test(inputValue)) {
        error = true;
      }
    });
    if (error) field.errorMessage = 'This domain is not a allowed';
    else field.errorMessage = '';
  } else if (onlyDomains.length) {
    let error = true;
    onlyDomains.split(',').forEach((domain) => {
      const regex = new RegExp('(?:[^\\w]|^)' + domain + '(?:[^\\w]|$)');

      if (regex.test(inputValue)) {
        error = false;
      }
    });
    if (error) field.errorMessage = `Only ${onlyDomains} domain is allowed`;
    else field.errorMessage = '';
  } else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const singleSelectErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const nestedFormErrorHandler = (field: FieldIF, inputValue: {}): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (!nonEmpty) {
    field.value = inputValue;
    field.errorMessage = '';
    return field;
  }
  let error = true;
  Object.values(inputValue)?.forEach((item) => {
    if (item) {
      error = false;
      field.errorMessage = '';
    }
  });
  if (error) field.errorMessage = `${field.inputLabel} is required`;
  field.value = inputValue;
  return field;
};
export const multiSelectErrorHandler = (field: FieldIF, inputValue: any[]): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue.length) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const dateViewErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue) {
    field.errorMessage = `${field.inputLabel} is required`;
    field.value = inputValue;
    return field;
  }

  const inputYear = Number(inputValue.split('-')[0]);
  if (nonEmpty && !inputValue && (inputYear < 2023 || inputYear > 2099)) {
    field.errorMessage = 'Invalid Date';
  }
  field.errorMessage = '';

  field.value = inputValue;
  return field;
};

export const timeViewErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const signatureErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const fileUploadErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const ratingErrorHandler = (field: FieldIF, inputValue: number): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const tableErrorHandler = (field: FieldIF): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty) field.errorMessage = `${field.inputLabel} is required`;
  else field.errorMessage = '';
  return field;
};
