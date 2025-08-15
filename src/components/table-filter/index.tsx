import style from './table-filter.module.css';
import crossIcon from '../../assets/svg/black/cross.svg';
import Dialog from '../dialog';
import { useState } from 'react';
import Button from '../button';
import DialogAction from '../dialog/dialog-action';
import { TableFilterPropsIF } from '../../interface/component.interface';
import FilterIcon from '../../icon-components/FilterIcon';
import convertDateFormat from '../../utils/functions/convert-date-format';

const TableFilter: React.FC<TableFilterPropsIF> = ({ onClick, isOpen, onClose, updateDate, filter, clearFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (e: any) => {
    setStartDate(e.target.value);
  };
  const handleEndDateChange = (e: any) => {
    setEndDate(e.target.value);
  };
  const handleDateSubmit = () => {
    if (!startDate) return;
    if (!endDate) return;
    const convertedStartDate = new Date(`${startDate}`);
    const convertedEndDate = new Date(`${endDate}`);
    updateDate({ startDate: `${convertedStartDate}`, endDate: `${convertedEndDate}` });
    onClose();
  };
  const clearFilterHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setStartDate('');
    setEndDate('');
    clearFilter && clearFilter();
  };
  return (
    <div onClick={onClick} className={style.tableFilter}>
      <FilterIcon />
      {filter ? (
        <div className={style.filterDate}>
          {convertDateFormat(startDate)}&nbsp;to&nbsp;{convertDateFormat(endDate)}
        </div>
      ) : (
        'Filter'
      )}
      {filter && <img onClick={clearFilterHandler} src={crossIcon} />}
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className={style.datePickerContainer}>
          <input type="date" onChange={handleStartDateChange} />
          <input type="date" onChange={handleEndDateChange} />
        </div>

        <DialogAction>
          <Button onClick={onClose}>Cancel</Button>
          {startDate && endDate && <Button onClick={handleDateSubmit}>Submit</Button>}
        </DialogAction>
      </Dialog>
    </div>
  );
};

export default TableFilter;
