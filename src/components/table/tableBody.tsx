import React, { ReactNode } from 'react';
import { TableBodyPropsIF } from '../../interface/component.interface';

const TableBody: React.FC<TableBodyPropsIF> = ({ tableBody }) => {
  return <tbody>{tableBody}</tbody>;
};

export default TableBody;
