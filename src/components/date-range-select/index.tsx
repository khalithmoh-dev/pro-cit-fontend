import React, { useRef, useState } from 'react';
import style from '../date-select/date-select.module.css';
import CloseIcon from '../../icon-components/CloseIcon';

interface PropsIF {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

const DateRangeSelect: React.FC<PropsIF> = ({ onDateRangeChange, onClose }) => {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleDateClick = (ref: React.RefObject<HTMLInputElement>) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (ref.current) {
      ref.current.showPicker(); // Opens the calendar in modern browsers
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setStartDate(date);
    onDateRangeChange(date, endDate); // Update the parent with both dates
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setEndDate(date);
    onDateRangeChange(startDate, date); // Update the parent with both dates
  };

  const handleClearDates = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setStartDate('');
    setEndDate('');
    onClose(); // Notify parent of clear action
  };

  return (
    <div className={style.container}>
      <div className={`${style.dateInput} ${startDate ? style.active : ''}`} onClick={handleDateClick(startDateRef)}>
        <div className={style.customDatePicker}>{startDate ? startDate : 'Start Date'}</div>
        <input type="date" ref={startDateRef} onChange={handleStartDateChange} value={startDate} />
      </div>

      <div className={`${style.dateInput} ${endDate ? style.active : ''}`} onClick={handleDateClick(endDateRef)}>
        <div className={style.customDatePicker}>{endDate ? endDate : 'End Date'}</div>
        <input type="date" ref={endDateRef} onChange={handleEndDateChange} value={endDate} />
      </div>

      {(startDate || endDate) && (
        <span onClick={handleClearDates} className={style.clearIcon}>
          <CloseIcon height={16} />
        </span>
      )}
    </div>
  );
};

export default DateRangeSelect;
