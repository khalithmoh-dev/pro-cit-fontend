import { useEffect, useState } from 'react';
import style from './time-table.module.css';
import TableControlBox from '../../../components/table-control-box';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import InputContainer from './week-select-bar/index.tsx';
import CreateTimeTableDialog from '../create-time-table/index.tsx';
import useTimeTableStore, { createTimeTablePayloadIF } from '../../../store/timeTableStore.ts';
import TimeTableTableComponent from './time-table-table/index.tsx';
import { useNavigate } from 'react-router-dom';
import { useTimeTableLocalStore } from '../timeTableLocalStore.ts';
import useAuthStore from '../../../store/authStore.ts';

const TimeTableListPage = () => {
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const { permissions } = useAuthStore();
  const { getTimeTables, clearTimeTableList } = useTimeTableStore();
  const { department, semester, weekName, setShowDialog, setSemester, setDepartment } = useTimeTableLocalStore();

  useEffect(() => {
    if (!department || !semester || firstRender) return;
    getTimeTables({ department, semester, week: weekName });
  }, [department, semester, weekName]);

  useEffect(() => {
    setSemester('');
    setDepartment('');
    clearTimeTableList();
    setFirstRender(false);
  }, []);

  return (
    <div className={style.container}>
      <TableControlBox tableName="Time Tables">
        <Button secondary onClick={() => navigate('/swap/list')}>
          TimeTable&nbsp;Requests
        </Button>
        <Button
          disabled={Boolean(!department || !semester) || !permissions?.timetable?.create}
          onClick={() => setShowDialog('create')}
          startIcon={<PlusIcon fill="white" />}
        >
          Create&nbsp;TimeTable
        </Button>
      </TableControlBox>
      <InputContainer />
      <div className={style.tableContainer}>
        <TimeTableTableComponent query={{ department, semester, week: weekName }} />
      </div>
      <CreateTimeTableDialog />
    </div>
  );
};

export default TimeTableListPage;
