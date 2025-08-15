import React from 'react';
import style from './table.module.css';
// import { TableHeadPropsIF } from '../../interface/component.interface';

interface TableHeadProps {
  tableHead: Array<string | React.ReactNode>; // Updated to allow both string and React elements
}
const TableHead: React.FC<TableHeadProps> = ({ tableHead }) => {
  return (
    <thead>
      <tr>
        {tableHead.map((item, index) => (
          <th key={index}>
            <div className={style.tableHeadBox}>{item}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
