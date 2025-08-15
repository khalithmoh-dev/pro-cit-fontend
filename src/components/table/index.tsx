import React, { ReactNode } from 'react';
import style from './table.module.css';
import { TablePropsIF } from '../../interface/component.interface';
import Spinner from '../spinner';

const Table: React.FC<TablePropsIF> = ({ children, loading }) => {
  // Convert children to an array safely
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={style.tableContainer}>
      <table className={style.table} cellPadding={10}>
        {childrenArray[0] ? childrenArray[0] : null}
        {!loading && childrenArray[1] ? childrenArray[1] : null}
      </table>
      {loading && (
        <div className={style.loaderBox}>
          <Spinner large />
        </div>
      )}
    </div>
  );
};

export default Table;
