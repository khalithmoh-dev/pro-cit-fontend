import { useEffect, useState } from 'react';
import style from './attendance.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Pagination from '../../../components/pagination/index.tsx';
import { useParams } from 'react-router-dom';
import TableSelect from '../../../components/bu-select/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import { semesterSampleList, tableRowOptions } from '../../../utils/static-data/index.ts';
import useAttendanceStore from '../../../store/attendanceStore.ts';
import AttendanceTableComponent from './attendance-table/index.tsx';
import useAuthStore from '../../../store/authStore.ts';
import DateSelect from '../../../components/date-select/index.tsx';
import useSubjectStore from '../../../store/subjectStore.ts';

const AttendanceListPage = () => {
  const { id } = useParams();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { user } = useAuthStore();
  const { getFilteredSubjects, subjectOptions } = useSubjectStore();
  const { total, getAttendances, loading } = useAttendanceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('10');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    const getAllAttendances = async () => {
      const getByDateReqBody = {
        teacher: id ? id : user?.user._id,
        date: new Date(startDate),
      };
      const getByFilterReqBody = {
        teacher: id ? id : user?.user._id,
        pageSize: tableRows,
        pageNumber: currentPage,
        searchText,
        department: selectedDepartment,
        semester: selectedSemester,
        subject: selectedSubject,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
      const reqBody = startDate ? getByDateReqBody : getByFilterReqBody;

      const res = await getAttendances(getByFilterReqBody, firstRender);

      if (res) setFirstRender(false);
    };

    getAllAttendances();
  }, [id, tableRows, currentPage, searchText, selectedDepartment, selectedSemester, startDate, selectedSubject]);

  useEffect(() => {
    if (departmentOptions.length) return;
    getDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDepartment || !selectedSemester) return;
    getFilteredSubjects({ department: selectedDepartment, semester: selectedSemester });
  }, [selectedDepartment, selectedSemester]);

  return (
    <div className={style.container}>
      <TableControlBox showBackButton={Boolean(id)} loading={loading} tableName="Attendance List">
        <DateSelect name="Start Date" onDateChange={(date) => setStartDate(date)} onClose={() => setStartDate('')} />
        <DateSelect name="End Date" onDateChange={(date) => setEndDate(date)} onClose={() => setEndDate('')} />
        <TableSelect
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
        <TableSelect
          options={subjectOptions}
          update={(subject) => setSelectedSubject(subject)}
          clearFilter={() => setSelectedSubject('')}
          label="Subject"
        />
        <TableRow
          options={tableRowOptions}
          row={`${tableRows}`}
          setRow={(size) => {
            setCurrentPage(1);
            setTableRows(size);
          }}
        />
        {/* <TableSearch searchText={searchText} setSearchText={setSearchText} /> */}
      </TableControlBox>
      <div className={style.tableContainer}>
        <AttendanceTableComponent startIndex={Number(tableRows) * currentPage - Number(tableRows)} />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(total / Number(tableRows))}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        loading={loading}
      />
    </div>
  );
};

export default AttendanceListPage;
