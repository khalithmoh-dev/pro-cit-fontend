import { useEffect, useState } from 'react';
import style from './view-attendance.module.css';
import TableControlBox from '../../../components/table-control-box';
import Pagination from '../../../components/pagination/index.tsx';
import { useParams } from 'react-router-dom';
import useAttendanceStore, { AttendanceIF } from '../../../store/attendanceStore.ts';
import Table from '../../../components/table';
import TableHead from '../../../components/table/tableHead';
import TableBody from '../../../components/table/tableBody';
import convertToAmPm from '../../../utils/functions/convert-time-to-am-pm.ts';
import convertDateFormat from '../../../utils/functions/convert-date-format.ts';

const ViewAttendancePage: React.FC = () => {
  const tableHead = ['SL NO.', 'STUDENT NAME', 'USN NUMBER', 'STATUS'];
  const { id } = useParams();
  const { attendance, getAttendance, loading } = useAttendanceStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (id) getAttendance(id);
  }, [id]);

  const tableBody = attendance?.students.map((student, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {student.firstName}&nbsp;{student.lastName}
      </td>
      <td>{student.usnNumber}</td>
      <td style={{ color: student.present ? 'green' : 'red' }}>{student.present ? 'Present' : 'Absent'}</td>
    </tr>
  ));

  return (
    <div className={style.container}>
      <TableControlBox showBackButton loading={loading} tableName="View Attendance">
        <></>
      </TableControlBox>
      <AttendanceDetails attendance={attendance} />
      <div className={style.tableContainer}>
        <Table loading={false}>
          <TableHead tableHead={tableHead} />
          <TableBody tableBody={tableBody} />
        </Table>
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

export default ViewAttendancePage;

type AttendanceDetailsPropsIF = {
  attendance: AttendanceIF | null;
};

const AttendanceDetails: React.FC<AttendanceDetailsPropsIF> = ({ attendance }) => {
  if (!attendance) return null;

  return (
    <div className={style.detailsContainer}>
      <p>
        <strong>Department:</strong> {attendance?.department?.departmentCode}
      </p>
      <p>
        <strong>Date:</strong> {convertDateFormat(attendance?.date)}
      </p>
      <p>
        <strong>Semester:</strong> {attendance?.semester}
      </p>
      <p>
        <strong>Subject:</strong> {attendance?.subject?.shortName}
      </p>
      <p>
        <strong>Batch:</strong> {attendance?.batch}
      </p>
      <p>
        <strong>Week:</strong> {attendance?.week}
      </p>
      <p>
        <strong>Start Time:</strong> {convertToAmPm(attendance.startTime)}
      </p>
      <p>
        <strong>End Time:</strong> {convertToAmPm(attendance.endTime)}
      </p>
    </div>
  );
};
