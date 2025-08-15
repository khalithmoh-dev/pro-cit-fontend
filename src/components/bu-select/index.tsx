// TableSelect.tsx
import React, { useEffect, useRef, useState } from 'react';
import style from './table-select.module.css';
import { TableSelectPropsIF } from '../../interface/component.interface';
import ArrowDownIcon from '../../icon-components/ArrowDownIcon';
import CloseIcon from '../../icon-components/CloseIcon';

interface SelectOptionIF {
  label: string;
  value: string;
}

const TableSelect: React.FC<TableSelectPropsIF> = ({
  options,
  onChange,
  className,
  error,
  initialValue,
  clearFilter,
  update,
  label,
  hide,
  lockSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOptionIF | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (selectedOption) return;
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (initialValue) setSelectedOption(initialValue);
  }, [initialValue]);

  const handleClickOption = (option: SelectOptionIF) => {
    setSelectedOption(option);
    onChange && onChange(option);
    update(option.value);
  };

  const clearFilterHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (lockSelection) return;
    setSelectedOption(null);
    clearFilter && clearFilter();
  };

  if (hide) return null;

  return (
    <div ref={dropdownRef} className={`${style.dropdown} ${className}`} onClick={toggleDropdown}>
      {/* <div className={style.fieldLabel}>{label}</div> */}
      <div className={`${style.selectedOption} ${selectedOption ? style.active : ''}`}>
        {selectedOption?.label || label || 'Department'}
        {selectedOption ? (
          <span onClick={clearFilterHandler}>
            <CloseIcon height={16} />
          </span>
        ) : (
          <ArrowDownIcon />
        )}
      </div>
      {isOpen && (
        <ul className={style.options}>
          {options.map((option, index) => (
            <li key={index} onClick={() => handleClickOption(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}

      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default TableSelect;
