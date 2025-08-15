import { useEffect, useState } from 'react';
import style from './group.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import GroupTableComponent from './group-table/index.tsx';
import useGroupStore from '../../../store/groupStore.ts';
import TableSearch from '../../../components/table-search/index.tsx';
import TableSelect from '../../../components/bu-select/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import { semesterSampleList, tableRowOptions } from '../../../utils/static-data/index.ts';
import useAuthStore from '../../../store/authStore.ts';

const GroupListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { getGroups, loading, total } = useGroupStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('10');
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [firstRender, setFirstRender] = useState(true);
  const { user } = useAuthStore();
  const roleName = user?.user?.role?.name || '';
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    const getAllGroups = async () => {
      const res = await getGroups(
        {
          pageSize: tableRows,
          pageNumber: currentPage,
          searchText,
          department: selectedDepartment,
          semester: selectedSemester,
        },
        firstRender ? false : true,
      );
      if (res) setFirstRender(false);
    };
    getAllGroups();
  }, [tableRows, currentPage, searchText, selectedDepartment, selectedSemester]);

  useEffect(() => {
    if (departmentOptions.length) return;
    getDepartments();
  }, []);

  return (
    <div className={style.container}>
      <TableControlBox tableName="Groups">
        <TableSelect
          hide={roleName !== 'admin' && roleName !== 'superadmin'}
          options={departmentOptions}
          update={(department) => setSelectedDepartment(department)}
          clearFilter={() => setSelectedDepartment('')}
          lockSelection={Boolean(selectedSemester)}
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
        <TableSearch searchText={searchText} setSearchText={setSearchText} />
        <Button
          disabled={!permissions?.group?.create}
          onClick={() => navigate('/group/create')}
          startIcon={<PlusIcon fill="white" />}
        >
          Create&nbsp;Group
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <GroupTableComponent startIndex={Number(tableRows) * currentPage - Number(tableRows)} />
      </div>
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / Number(tableRows))}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      )}
    </div>
  );
};

export default GroupListPage;
