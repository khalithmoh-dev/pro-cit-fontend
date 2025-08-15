import React, { useRef, useState } from 'react';
import style from './date-select.module.css';
import CloseIcon from '../../icon-components/CloseIcon';

interface PropsIF {
  onDateChange: (date: string) => void;
  onClose: () => void;
  name: string;
}

const DateSelect: React.FC<PropsIF> = ({ onDateChange, onClose, name }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.showPicker(); // Opens the calendar in modern browsers
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date); // Update state with the selected date
    onDateChange(date); // Call the onDateChange prop to pass the date to the parent
  };

  const handleClearDate = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSelectedDate(''); // Clear the selected date
    onClose(); // Call the onClose prop to notify the parent
  };

  return (
    <div className={`${style.container} ${selectedDate ? style.active : ''}`} onClick={handleDateClick}>
      <div className={style.customDatePicker}>{selectedDate ? selectedDate : name}</div>
      <input id="date-select" type="date" ref={inputRef} onChange={handleDateChange} value={selectedDate} />
      {selectedDate && (
        <span onClick={handleClearDate} className={style.clearIcon}>
          <CloseIcon height={16} />
        </span>
      )}
    </div>
  );
};

export default DateSelect;
