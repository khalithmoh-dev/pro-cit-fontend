import { useState } from 'react';
import style from './form.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import FormTableComponent from './forms-table/index.tsx';
import useFormStore from '../../../store/formStore.ts';
import ExportJSON from '../../../components/export-json/index.tsx';
import { tableRowOptions } from '../../../utils/static-data/index.ts';

const FormListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('5');
  const { forms, loading } = useFormStore();

  return (
    <div className={style.container}>
      <TableControlBox tableName="Forms">
        <TableRow options={tableRowOptions} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />
        <ExportJSON data={forms} fileName={`${new Date()}-form`} />
        <Button onClick={() => navigate('/formbuilder/create')} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;Form
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <FormTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        loading={loading}
      />
    </div>
  );
};

export default FormListPage;
