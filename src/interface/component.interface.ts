import { ChangeEvent, ReactNode } from 'react';

export default interface PaginationPropsIF {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  loading?: boolean;
}
export interface DropdownMenuPropsIF {
  children: ReactNode;
  options: string[];
  onChange: (option: string) => void;
}

export interface TablePropsIF {
  children: ReactNode;
  loading?: boolean;
}
export interface TableHeadPropsIF {
  tableHead: string[];
}
export interface TableBodyPropsIF {
  tableBody: ReactNode;
}
export interface TableRowPropsIF {
  options: string[];
  row: string;
  setRow: (option: string) => void;
}
export interface TableControlBoxPropsIF {
  children: ReactNode;
  tableName: string;
  showCacheMessage?: boolean;
  onRefresh?: () => void;
  showBackButton?: boolean;
  loading?: boolean;
}
export interface ButtonPropsIF {
  className?: CSSModuleClasses[string];
  children: ReactNode;
  fullWidth?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  submit?: boolean;
  large?: boolean;
  small?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  mt?: number;
}
export interface DialogPropsIF {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  small?: boolean;
  wide?: boolean;
  medium?: boolean;
  fullHeight?: boolean;
  className?: CSSModuleClasses[string];
}
export interface DialogActionPropsIF {
  closeButton?: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: CSSModuleClasses[string];
}
export interface DialogBodyPropsIF {
  children: ReactNode;
  className?: CSSModuleClasses[string];
}
export interface DialogTitlePropsIF {
  children: ReactNode;
  className?: CSSModuleClasses[string];
  onClose: () => void;
}
interface FilterDateIF {
  startDate: string;
  endDate: string;
}
export interface TableFilterPropsIF {
  isOpen: boolean;
  filter?: boolean;
  onClose: () => void;
  onClick: () => void;
  updateDate: (date: FilterDateIF) => void;
  clearFilter?: () => void;
}
export interface SelectOptionIF {
  label: string;
  value: string;
}

export interface RequestSubjectIF {
  _id: string;
  name?: string;
  shortName?: string;
  subjectCode?: string;
  type?: string;
}
export interface SingleSelectPropsIF {
  label: string;
  error?: string;
  initialValue?: SelectOptionIF;
  options: SelectOptionIF[];
  onChange: (option: SelectOptionIF) => void;
  onBlur?: () => void;
  className?: CSSModuleClasses[string];
  selectedValue?: string;
}
export interface MultiSelectPropsIF {
  label: string;
  error?: string;
  initialValue?: SelectOptionIF[];
  options: SelectOptionIF[];
  onChange: (option: SelectOptionIF[]) => void;
  onBlur?: () => void;
  className?: CSSModuleClasses[string];
  selectedValues?:string[];
  disabled?: boolean;
}
export interface TextFieldPropsIF {
  className?: CSSModuleClasses[string];
  error?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  min?:string;
  max?:string;
  defaultValue?:string;
  disabled?: boolean;
}
export interface TextAreaPropsIF {
  className?: CSSModuleClasses[string];
  error?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
export interface FormContainerPropsIF {
  children: ReactNode;
  headerText: string;
  className?: string;
  fullWidth?: boolean;
}
export interface TableSearchPropsIF {
  searchText: string;
  setSearchText: (value: string) => void;
}
export interface FlexPropsIF {
  children: ReactNode;
  className?: CSSModuleClasses[string];
  center?: boolean;
  end?: boolean;
  alignCenter?: boolean;
  fullWidth?: boolean;
  between?: boolean;
  around?: boolean;
  evenly?: boolean;
  minWidth?: boolean;
  maxWidth?: boolean;
  minHeight?: boolean;
  maxHeight?: boolean;
  fitWidth?: boolean;
  fitHeight?: boolean;
  gap?: number;
}
export interface TableSelectPropsIF {
  label?: string;
  error?: string;
  initialValue?: SelectOptionIF;
  options: SelectOptionIF[];
  onChange?: (option: SelectOptionIF) => void;
  className?: CSSModuleClasses[string];
  clearFilter: () => void;
  update: (value: string) => void;
  hide?: boolean;
  lockSelection?: boolean;
}
export interface MultiStringPropsIF {
  label: string;
  error?: string;
  values: string[];
  initialValue: string[];
  onChange: (option: string[]) => void;
  onBlur?: () => void;
  className?: CSSModuleClasses[string];
}
export interface SwitchPropsIF {
  checked: boolean;
  onChange: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
export interface SettingIF {
  settingType: string;
  value: any;
  name: string;
}
export interface FieldIF {
  name: string;
  type: string;
  inputLabel: string;
  keyName: string;
  icon: string;
  settings: SettingIF[];
  value: any;
  errorMessage: string;
  initialValue: any;
  hide?: boolean;
  placeholder?: string;
}
export interface RenderFormbuilderFormIF {
  formName: string;
  formHeader: string;
  updateForm?: boolean;
  large?: boolean;
  extraLarge?: boolean;
  small?: boolean;
  existingForm?: any;
  goBack: () => void;
  onSubmit: (data: any) => void;
  formData?: FieldIF[];
  dynamicOptions: SelectOptionIF[][];
  onChange?: (fields: FieldIF[]) => void
  update?: boolean
  loading?: boolean
}

export interface FeeFieldGroup {
  applicable_year: number[];
  category_name: string;
  amount: number;
  duration_type: string;
  is_mandatory: boolean;
  
}
