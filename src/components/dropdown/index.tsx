// DropdownMenu.tsx
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import style from './dropdown.module.css';
import { DropdownMenuPropsIF } from '../../interface/component.interface';

const DropdownMenu: React.FC<DropdownMenuPropsIF> = ({ children, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
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

  return (
    <div ref={dropdownRef} className={style.dropdown} onClick={toggleDropdown}>
      {children}
      {isOpen && (
        <ul className={style.options}>
          {options.map((option, index: number) => (
            <li key={index} onClick={() => onChange(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
