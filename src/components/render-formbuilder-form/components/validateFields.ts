import { FieldIF } from '../../../interface/component.interface';
import {
  dateViewErrorHandler,
  emailErrorHandler,
  fileUploadErrorHandler,
  multiSelectErrorHandler,
  multiStringErrorHandler,
  nestedFormErrorHandler,
  numberErrorHandler,
  plainTextErrorHandler,
  ratingErrorHandler,
  signatureErrorHandler,
  singleSelectErrorHandler,
  urlErrorHandler,
} from './error-handler';

export const validateFields = (fields: FieldIF[]) => {
  let isValid = true;
  const updatedFields: FieldIF[] = fields.map((field) => {
    console.log("🚀 ~ constupdatedFields:FieldIF[]=fields.map ~ field:", field)
    let updatedField = { ...field };
    switch (field.type) {
      case 'plainText':
      case 'multiLineText':
        updatedField = plainTextErrorHandler(field, field.value);
        break;
      case 'number':
        updatedField = numberErrorHandler(field, field.value);
        break;
      case 'email':
        updatedField = emailErrorHandler(field, field.value);
        break;
      case 'nestedForm':
        updatedField = nestedFormErrorHandler(field, field.value);
        break;
      case 'url':
        updatedField = urlErrorHandler(field, field.value); // Reusing email error handler for URL
        break;
      case 'singleSelect':
        updatedField = singleSelectErrorHandler(field, field.value);
        break;
      case 'multiSelect':
        updatedField = multiSelectErrorHandler(field, field.value);
        break;
      case 'date':
        updatedField = dateViewErrorHandler(field, field.value);
        break;
      case 'time':
        updatedField = dateViewErrorHandler(field, field.value);
        break;
      case 'signature':
        updatedField = signatureErrorHandler(field, field.value);
        break;
      case 'file':
        updatedField = fileUploadErrorHandler(field, field.value);
        break;
      case 'rating':
        updatedField = ratingErrorHandler(field, field.value);
        break;
      case 'multiString':
        updatedField = multiStringErrorHandler(field, field.value);
        break;
      default:
        break;
    }
    if (updatedField.errorMessage) {
      isValid = false;
    }
    return updatedField;
  });
  return { isValid, updatedFields };
};
