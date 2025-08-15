import { FieldIF } from '../../../../../interface/component.interface';

function isIncorrectEmail(emailAdress: string) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
  if (emailAdress.match(regex)) return false;
  else return true;
}
function isIncorrectUrl(emailAdress: string) {
  const regex =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;  
  // if(emailAdress.startsWith("https://") || emailAdress.startsWith("http://"))return false;
  if (regex.test(emailAdress)) return false;
  else return true;
}

export const plainTextErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  const minLength = field.settings[1].value;
  const maxLength = field.settings[2].value;
  const inputLength = inputValue.length;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else if (minLength && inputLength < minLength) field.errorMessage = `Minimum character length is ${minLength}`;
  else if (maxLength && inputLength > maxLength) field.errorMessage = `Maximum character length is ${maxLength}`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const multiStringErrorHandler = (field: FieldIF, inputValue: string[]): FieldIF => {
  const nonEmpty = field.settings[0].value;
  if (nonEmpty && !inputValue[0]) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};

export const numberErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  const min = field.settings[2].value;
  const max = field.settings[3].value;
  const minDigit = field.settings[4].value;
  const maxDigit = field.settings[5].value;
  const value = Number(inputValue);
  if (!nonEmpty) {
    field.value = inputValue;
    return field;
  }
  if (nonEmpty && inputValue === '0') field.errorMessage = 'This field should be non zero';
  else if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  // else if (noDecimals && inputValue?.includes(".")) field.errorMessage = `Decimals not allowed`;
  else if (min && value < min) field.errorMessage = `Minimum number is ${min}`;
  else if (max && value > max) field.errorMessage = `Maximum number is ${max}`;
  else if (minDigit && inputValue.length < minDigit) field.errorMessage = `Minimum Digit is ${minDigit}`;
  else if (maxDigit && inputValue.length > maxDigit) field.errorMessage = `Maximum Digit is ${maxDigit}`;
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const emailErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;
  const exceptDomains: string = field.settings[1].value;
  const onlyDomains: string = field.settings[2].value;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else if (isIncorrectEmail(inputValue)) field.errorMessage = 'Incorrect Email Address';
  else if (exceptDomains.length) {
    let error = false;
    exceptDomains.split(',')?.forEach((domain) => {
      const regex = new RegExp('(?:[^\\w]|^)' + domain + '(?:[^\\w]|$)');

      if (regex.test(inputValue)) {
        error = true;
      }
    });
    if (error) field.errorMessage = 'This domain is not a allowed';
    else field.errorMessage = '';
  } else if (onlyDomains.length) {
    let error = true;
    onlyDomains.split(",")?.forEach((domain) => {
      const regex = new RegExp("(?:[^\\w]|^)" + domain + "(?:[^\\w]|$)");

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

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else if (isIncorrectUrl(inputValue)) field.errorMessage = 'Incorrect Url';
  else if (exceptDomains.length) {
    let error = false;
    exceptDomains.split(",")?.forEach((domain) => {
      const regex = new RegExp("(?:[^\\w]|^)" + domain + "(?:[^\\w]|$)");

      if (regex.test(inputValue)) {
        error = true;
      }
    });
    if (error) field.errorMessage = 'This domain is not a allowed';
    else field.errorMessage = '';
  } else if (onlyDomains.length) {
    let error = true;
    onlyDomains.split(",")?.forEach((domain) => {
      const regex = new RegExp("(?:[^\\w]|^)" + domain + "(?:[^\\w]|$)");

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

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const multiSelectErrorHandler = (field: FieldIF, inputValue: any[]): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue.length) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const dateTimeErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const signatureErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const fileUploadErrorHandler = (field: FieldIF, inputValue: string): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const ratingErrorHandler = (field: FieldIF, inputValue: number): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty && !inputValue) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  field.value = inputValue;
  return field;
};
export const tableErrorHandler = (field: FieldIF): FieldIF => {
  const nonEmpty = field.settings[0].value;

  if (nonEmpty) field.errorMessage = 'This field is required';
  else field.errorMessage = '';
  return field;
};
