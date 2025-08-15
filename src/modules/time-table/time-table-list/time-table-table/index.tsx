import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import useTimeTableStore, { DeleteTimeTableBodyIF } from '../../../../store/timeTableStore';
import { useEffect, useState } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';
import { useTimeTableLocalStore } from '../../timeTableLocalStore';
import convertToAmPm from '../../../../utils/functions/convert-time-to-am-pm';

interface PropsIF {
  query: any;
}

const TimeTableTableComponent: React.FC<PropsIF> = () => {
  const navigate = useNavigate();
  const { timeTables, getTimeTables, deleteTimeTable, loading, deleting } = useTimeTableStore();
  const { department, semester, weekName, setShowDialog, setTimeTableId } = useTimeTableLocalStore();

  const deleteHandler = async (data: DeleteTimeTableBodyIF) => {
    const res = await deleteTimeTable(data);
    if (res) {
      getTimeTables({ department, semester, week: weekName });
    }
  };
  const editClickHandler = (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    e.stopPropagation();
    setTimeTableId(id);
    setShowDialog('update');
  };

  const tableHead = [
    'SL NO.',
    'START TIME',
    'END TIME',
    'SUBJECT',
    'BATCH',
    'TEACHER',
    'ROOM NUMBER',
    'UPDATED AT',
    'ACTION',
  ];

  const tableBody = timeTables.map((timeTable, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{convertToAmPm(timeTable.startTime)}</td>
      <td>{convertToAmPm(timeTable.endTime)}</td>
      <td>{timeTable?.subject?.shortName}</td>
      <td>{timeTable.group?.batch}</td>
      <td>
        {timeTable.teacher?.firstName}&nbsp;{timeTable.teacher?.lastName}
      </td>
      <td>{timeTable.roomNumber}</td>
      <td>{convertDateFormat(timeTable.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
        <span onClick={(e) => editClickHandler(e, timeTable._id)}>
          <RichEditorIcon />
        </span>
        <TableDeleteButton
          name="Time Table"
          id={timeTable._id}
          onClick={(id) =>
            deleteHandler({
              id,
              department,
              semester,
              batch: timeTable.group?.batch,
              subject: timeTable?.subject?._id,
              week: timeTable.week,
              startTime: timeTable.startTime,
              endTime: timeTable.endTime,
              group: timeTable.group._id,
              teacher: timeTable.teacher._id,
            })
          }
          deleting={deleting}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHead} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default TimeTableTableComponent;
