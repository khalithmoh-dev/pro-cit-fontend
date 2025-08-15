import { useEffect, useState } from 'react';
import style from './student.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import TableSelect from '../../../components/bu-select/index.tsx';
import { SelectOptionIF } from '../../../interface/component.interface.ts';
import useDepartmentStore from '../../../store/departmentStore.ts';
import StudentTableComponent from './student-table/index.tsx';
import useStudentStore from '../../../store/studentStore.ts';
import useInvitedStudentStore from '../../../store/invitedStudentStore.ts';
import { useToastStore } from '../../../store/toastStore.ts';
import { tableRowOptions } from '../../../utils/static-data/index.ts';
import useAuthStore from '../../../store/authStore.ts';

const InvitedStudentListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { total, loading, getInvitedStudents } = useInvitedStudentStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('5');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await getInvitedStudents(
        {
          pageSize: tableRows,
          pageNumber: currentPage,
          searchText,
          department: selectedDepartment,
        },
        firstRender,
      );

      if (res) setFirstRender(false);
    };

    getAllUsers();
  }, [tableRows, currentPage, searchText, selectedDepartment]);

  useEffect(() => {
    if (!departmentOptions.length) getDepartments();
  }, []);

  return (
    <div className={style.container}>
      <TableControlBox tableName="Invited Students" showBackButton>
        <TableSelect
          options={departmentOptions}
          update={(department) => setSelectedDepartment(department)}
          clearFilter={() => setSelectedDepartment('')}
        />
        <TableRow options={tableRowOptions} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />
        <Button
          disabled={!permissions?.admission?.create}
          onClick={() => navigate('/admission/invite')}
          startIcon={<PlusIcon fill="white" />}
        >
          Invite Student
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <StudentTableComponent startIndex={Number(tableRows) * currentPage - Number(tableRows)} />
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

export default InvitedStudentListPage;
