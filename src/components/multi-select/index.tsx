// MultiSelect.tsx
import React, { useEffect, useRef, useState } from 'react';
import style from './multi-select.module.css';
import ArrowDownIcon from '../../icon-components/ArrowDownIcon';
import { MultiSelectPropsIF, SelectOptionIF } from '../../interface/component.interface';

const MultiSelect: React.FC<MultiSelectPropsIF> = ({ selectedValues = [], label, options, onChange, className, error, onBlur, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectOptionIF[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updated = options.filter((item) => selectedValues.includes(item.value));
    setSelectedOptions(updated);
  }, []);

  const toggleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      if (isOpen && onBlur) {
        onBlur();
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  // useEffect(() => {
  //   if (initialValue) setSelectedOptions(initialValue);
  // }, [initialValue]);

  const handleOptionToggle = (option: SelectOptionIF) => {
    const isSelected = selectedOptions.some((selected) => selected.value === option.value);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
      onChange(selectedOptions.filter((selected) => selected.value !== option.value));
    } else {
      setSelectedOptions([...selectedOptions, option]);
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div ref={dropdownRef} className={`${style.dropdown} ${className}`}>
      <div className={style.fieldLabel}>{label}</div>
      <div className={`${style.selectedOptions} ${error ? style.errorInput : ''}`} onClick={toggleDropdown}>
        {selectedOptions.length ? (
          <div>
            {selectedOptions.map((item, index) => (
              <span key={index}>{item.label},&nbsp;</span>
            ))}
          </div>
        ) : (
          'Select'
        )}
        <ArrowDownIcon />
      </div>
      {isOpen && (
        <div className={style.options} ref={optionRef}>
          {options.map((option, index) => {
            // const selected=selectedValuesList.find((item)=>item===option.value)
            return (
              <div
                key={index}
                onClick={() => handleOptionToggle(option)}
                className={`${style.option} ${selectedOptions.some((selected) => selected.value === option.value) ? style.selected : ''
                  }`}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}

      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default MultiSelect;
