// MultiString.tsx
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import style from './single-select.module.css';
import ArrowDownIcon from '../../icon-components/ArrowDownIcon';
import { MultiStringPropsIF } from '../../interface/component.interface';
import DeleteIcon from '../../icon-components/DeleteIcon';

const MultiString: React.FC<MultiStringPropsIF> = ({
  label,
  values,
  onChange,
  className,
  error,
  initialValue,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState<string>('');
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
    if (initialValue[0]) onChange(initialValue);
  }, [initialValue]);

  const addClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!input) return;
    const updatedValue = [...values];
    updatedValue.push(input);
    onChange(updatedValue);
    setInput('');
    setIsOpen(true);
  };
  const handleClickOption = (index: number) => {
    const updatedValue = [...values];
    updatedValue.splice(index, 1);
    onChange(updatedValue);
  };

  const placeholder = values.join(', ');

  return (
    <div ref={dropdownRef} className={`${style.dropdown} ${className}`} onClick={toggleDropdown}>
      <div className={style.fieldLabel}>{label}</div>
      <div className={`${style.selectedOption} ${error ? style.errorInput : ''}`}>
        <input placeholder={placeholder} style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} />{' '}
        {input && <span onClick={addClickHandler}>add</span>}
        <ArrowDownIcon />
      </div>
      {isOpen && (
        <ul className={style.options}>
          {values.map((value: string, index: number) => (
            <li className={style.option} key={index}>
              {value}{' '}
              <span onClick={() => handleClickOption(index)}>
                <DeleteIcon />
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className={style.fieldError}>{error}</div>
    </div>
  );
};

export default MultiString;
