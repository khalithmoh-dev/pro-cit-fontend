import { useCallback, useEffect, useState } from 'react';
import style from './student.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import TableSelect from '../../../components/bu-select/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import StudentTableComponent from './student-table/index.tsx';
import useStudentStore from '../../../store/studentStore.ts';
import TableSearch from '../../../components/table-search/index.tsx';
import { semesterSampleList, tableRowOptions } from '../../../utils/static-data/index.ts';
import useAuthStore from '../../../store/authStore.ts';
import { debounce } from 'lodash';
import ViewStudentPage from '../view-student/index.tsx';

const StudentListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { total, getStudents, exportStudents, loading, clearStudent } = useStudentStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('10');
  const [searchText, setSearchText] = useState('');
  const [debounceSearchText, setDebounceSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [firstRender, setFirstRender] = useState(true);
  const [studentId, setStudentId] = useState('');
  const { user } = useAuthStore();
  const roleName = user?.user?.role?.name || '';
  useEffect(() => {
    const getAllStudents = async () => {
      const res = await getStudents(
        {
          pageSize: tableRows,
          pageNumber: currentPage,
          searchText: debounceSearchText,
          department: selectedDepartment,
          semester: selectedSemester,
        },
        firstRender,
      );

      if (res) setFirstRender(false);
    };

    getAllStudents();
  }, [tableRows, currentPage, debounceSearchText, selectedDepartment, selectedSemester]);

  useEffect(() => {
    if (departmentOptions.length) return;
    getDepartments();
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

  const closeStudentViewPage = (id: string) => {
    setStudentId(id);
    clearStudent();
  };

  return (
    <>
      {studentId && <ViewStudentPage studentId={studentId} setStudentId={closeStudentViewPage} />}
      <div className={`${style.container} ${studentId ? style.hideContainer : ''}`}>
        <TableControlBox loading={loading} tableName="Students">
          <TableSelect
            hide={roleName !== 'admin' && roleName !== 'superadmin'}
            options={departmentOptions}
            update={(department) => setSelectedDepartment(department)}
            clearFilter={() => setSelectedDepartment('')}
          />
          <TableSelect
            options={semesterSampleList}
            update={(semester) => setSelectedSemester(semester)}
            clearFilter={() => setSelectedSemester('')}
            label="Semester"
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
          <Button secondary>Import</Button>
          <Button onClick={exportStudents} secondary>
            Export
          </Button>
          <Button
            disabled={!permissions?.student?.create}
            onClick={() => navigate('/student/create')}
            startIcon={<PlusIcon fill="white" />}
          >
            Create&nbsp;Student
          </Button>
        </TableControlBox>
        <div className={style.tableContainer}>
          <StudentTableComponent
            setStudentId={setStudentId}
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

export default StudentListPage;
