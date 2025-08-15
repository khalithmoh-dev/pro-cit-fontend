import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import useAttendanceStore from '../../../../store/attendanceStore';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';
import TableActionTD from '../../../../components/table-action-td';
import useAuthStore from '../../../../store/authStore';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';

interface PropsIF {
  startIndex: number;
}

const AttendanceTableComponent: React.FC<PropsIF> = ({ startIndex }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { attendances, getAttendances, deleteAttendance, initialLoading, deleting } = useAttendanceStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteAttendance(id);
    if (res) {
      getAttendances();
    }
  };

  const rowClickHandler = (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
    e.stopPropagation();
    navigate(`/attendance/view/${id}`);
  };

  const tableHead = ['SL NO.', 'DATE', 'DEPARTMENT', 'SEMESTER', 'SUBJECT', 'CREATED AT', 'ACTION'];

  const tableBody = attendances.map((attendance, index) => (
    <tr key={index} onClick={(e) => rowClickHandler(e, attendance._id)}>
      <td>{index + startIndex + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{convertDateFormat(attendance.date)}</td>
      <td>{attendance.department?.departmentCode}</td>
      <td>{attendance.semester}</td>
      <td>{attendance.subject?.shortName}</td>
      <td>{convertDateFormat(attendance.createdAt)}</td>
      <TableActionTD
        permission={permissions?.attendance}
        deleting={deleting}
        id={attendance._id}
        name="Attendance"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/attendance/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={initialLoading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.attendance)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default AttendanceTableComponent;
