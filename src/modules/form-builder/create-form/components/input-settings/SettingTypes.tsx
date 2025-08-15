import BooleanInput from './boolean-input';
import DateInput from './date-input';
import NumberInput from './number-input';
import TextInput from './text-input';

const settingTypes = new Map<string, React.FC<any>>();
settingTypes.set('nonEmpty', BooleanInput);
settingTypes.set('multiline', BooleanInput);
settingTypes.set('nonZero', BooleanInput);
settingTypes.set('noDecimals', BooleanInput);
settingTypes.set('multiSelect', BooleanInput);
settingTypes.set('expectedTrue', BooleanInput);
settingTypes.set('expectedFalse', BooleanInput);
settingTypes.set('defaultChecked', BooleanInput);
settingTypes.set('required', BooleanInput);
settingTypes.set('number', BooleanInput);
settingTypes.set('fullWidth', BooleanInput);
settingTypes.set('enableDynamincOption', BooleanInput);
settingTypes.set('onlyLettersWithSingleSpace', BooleanInput);
settingTypes.set('onlyLettersAndNumbers', BooleanInput);

settingTypes.set('minLength', NumberInput);
settingTypes.set('maxLength', NumberInput);
settingTypes.set('min', NumberInput);
settingTypes.set('max', NumberInput);
settingTypes.set('minDigits', NumberInput);
settingTypes.set('maxDigits', NumberInput);
settingTypes.set('dynamincOptionIndex', NumberInput);

settingTypes.set('regex', TextInput);
settingTypes.set('options', TextInput);
settingTypes.set('exceptDomains', TextInput);
settingTypes.set('onlyDomains', TextInput);
settingTypes.set('columns', TextInput);
settingTypes.set('rows', TextInput);
settingTypes.set('accept', TextInput);

settingTypes.set('minDate', DateInput);
settingTypes.set('maxDate', DateInput);

export default settingTypes;
