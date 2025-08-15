import { useCallback, useEffect, useState } from 'react';
import style from './employee.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import TableSelect from '../../../components/bu-select/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import EmployeeTableComponent from './employee-table/index.tsx';
import useEmployeeStore from '../../../store/employeeStore.ts';
import TableSearch from '../../../components/table-search/index.tsx';
import { tableRowOptions } from '../../../utils/static-data/index.ts';
import useAuthStore from '../../../store/authStore.ts';
import useDesignationStore from '../../../store/designationStore.ts';
import { debounce } from 'lodash';
import ViewEmployee from '../view-employee/index.tsx';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { getDesignations, designationOptions } = useDesignationStore();
  const { permissions } = useAuthStore();
  const { getEmployees, loading, total, clearEmployee } = useEmployeeStore();
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('10');
  const [searchText, setSearchText] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [debounceSearchText, setDebounceSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [firstRender, setFirstRender] = useState(true);
  const roleName = user?.user?.role?.name || '';

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await getEmployees(
        {
          pageSize: tableRows,
          pageNumber: currentPage,
          searchText: debounceSearchText,
          department: selectedDepartment,
          designation: selectedDesignation,
        },
        firstRender,
      );

      if (res) setFirstRender(false);
    };

    getAllUsers();
  }, [tableRows, currentPage, debounceSearchText, selectedDepartment, selectedDesignation]);

  useEffect(() => {
    if (!departmentOptions.length) getDepartments();
    if (!designationOptions.length) getDesignations();
  }, []);

  const debouncedChangeHandler = useCallback(
    debounce((value: string) => {
      setDebounceSearchText(value);
    }, 1500),
    [],
  );

  const handleOnchangeSearchText = (text: string) => {
    setSearchText(text);
    debouncedChangeHandler(text);
  };

  const closeEmployeeViewPage = (id: string) => {
    setEmployeeId(id);
    clearEmployee();
  };

  return (
    <>
      {employeeId && <ViewEmployee employeeId={employeeId} setEmployeeId={closeEmployeeViewPage} />}
      <div className={`${style.container} ${employeeId ? style.hideContainer : ''}`}>
        <TableControlBox loading={loading} tableName="Employees">
          <TableSelect
            hide={roleName !== 'admin' && roleName !== 'superadmin'}
            options={departmentOptions}
            update={(department) => setSelectedDepartment(department)}
            clearFilter={() => setSelectedDepartment('')}
          />
          <TableSelect
            options={designationOptions}
            update={(designation) => setSelectedDesignation(designation)}
            clearFilter={() => setSelectedDesignation('')}
            label="Designation"
          />
          <TableRow
            options={tableRowOptions}
            row={`${tableRows}`}
            setRow={(size) => {
              setCurrentPage(1);
              setTableRows(size);
            }}
          />
          <TableSearch searchText={searchText} setSearchText={handleOnchangeSearchText} />
          <Button
            disabled={!permissions?.employee?.create}
            onClick={() => navigate('/employee/create')}
            startIcon={<PlusIcon fill="white" />}
          >
            Create&nbsp;Employee
          </Button>
        </TableControlBox>
        <div className={style.tableContainer}>
          <EmployeeTableComponent
            setEmployeeId={setEmployeeId}
            startIndex={Number(tableRows) * currentPage - Number(tableRows)}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / Number(tableRows))}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          loading={loading}
        />
      </div>
    </>
  );
};

export default EmployeeListPage;
