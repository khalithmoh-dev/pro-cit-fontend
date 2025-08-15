import React from 'react';
import { singleSelectErrorHandler } from '../../error-handler';
import { FieldIF } from '../../../../../interface/component.interface';
import { capitalizeText } from '../../../../../utils/functions/text-transform';
import SingleSelect from '../../../../single-select';

interface SelectPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
  dynamicOptions: SelectOptionIF[][];
  onChange: (value: string) => void;  // Add onChange here
}

export interface SelectOptionIF {
  label: string;
  value: string;
}

const Select: React.FC<SelectPropsIF> = ({ index, form, setForm, dynamicOptions = [[]], onChange }) => {
  const data: FieldIF[] = [...form];
  let field = data[index];

  const update = (value: string) => {
    const updatedData = singleSelectErrorHandler(field, value);
    field = updatedData;
    setForm([...data]);
  };

  const onBlur = () => {
    const updatedData = singleSelectErrorHandler(field, field.value);
    field = updatedData;
    setForm([...data]);
  };

  let options: SelectOptionIF[] = [{ label: 'Please add options', value: 'No Options' }];
  const optionsString: string = field.settings[1].value;
  if (typeof optionsString === 'string') {
    const optionsStringArray: string[] = optionsString.split(',');
    options = optionsStringArray.map((item: string) => {
      return { label: capitalizeText(item), value: item };
    });
  }

  const dynamicOptionsArray: SelectOptionIF[] =
    dynamicOptions[field.settings[3].value]?.length > 0 ? dynamicOptions[field.settings[3].value] : [];

  const selectedValue = field.value;  // Define selectedValue here

  return (
    <SingleSelect
      label={`${field.inputLabel} ${field.settings[0].value ? ' *' : ''}`}
      options={field.settings[2].value ? dynamicOptionsArray : options}
      onChange={(e: SelectOptionIF) => {
        update(e.value);
        onChange(e.value);
      }}
      error={field.errorMessage}
      onBlur={onBlur}
      selectedValue={selectedValue || String(selectedValue)}  // Use selectedValue
    />
  );
};

export default Select;
