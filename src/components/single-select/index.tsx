// SingleSelect.tsx
import React, { useEffect, useRef, useState } from 'react';
import style from './single-select.module.css';
import ArrowDownIcon from '../../icon-components/ArrowDownIcon';
import { SingleSelectPropsIF, SelectOptionIF } from '../../interface/component.interface';

const SingleSelect: React.FC<SingleSelectPropsIF> = ({
  label,
  options,
  onChange,
  className,
  error,
  initialValue,
  onBlur,
  selectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOptionIF | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      if (isOpen && onBlur) {
        onBlur();
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    if (initialValue) setSelectedOption(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const filteredOption = options.filter((option) => selectedValue === option.value);
    setSelectedOption(filteredOption[0]);
  }, [selectedValue]);

  const handleClickOption = (option: SelectOptionIF) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div ref={dropdownRef} className={`${style.dropdown} ${className}`} onClick={toggleDropdown}>
      {/* <input value={selectedOption?.label}/> */}
      <div className={style.fieldLabel}>{label}</div>
      <div className={`${style.selectedOption} ${error ? style.errorInput : ''}`}>
        {selectedOption?.label || 'Select'}
        <ArrowDownIcon />
      </div>
      {isOpen && (
        <ul className={style.options}>
          {options.map((option, index) => (
            <li
              className={`${style.option} ${selectedValue === option.value ? style.active : ''}`}
              key={index}
              onClick={() => handleClickOption(option)}
            >
              {option.label}
            </li>
          ))}
          <li className={style.emptyLi} />
        </ul>
      )}

      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default SingleSelect;
