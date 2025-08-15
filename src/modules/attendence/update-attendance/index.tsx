import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './mark-attendance.module.css';
import TableControlBox from '../../../components/table-control-box';
import Button from '../../../components/button';
import TableHead from '../../../components/table/tableHead';
import TableBody from '../../../components/table/tableBody';
import Table from '../../../components/table';
import useTimeTableStore, { PeriodIF, PeriodStudentsIF } from '../../../store/timeTableStore';
import useAttendanceStore from '../../../store/attendanceStore';
import convertToAmPm from '../../../utils/functions/convert-time-to-am-pm';

// Component for displaying attendance details
const UpdateAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateAttendance, attendance, getAttendance } = useAttendanceStore();
  const { id } = useParams<{ id: string }>();

  const [students, setStudents] = useState<PeriodStudentsIF[]>([]);

  const handleSubmit = async () => {
    if (!id) return;
    // const requestBody = {
    //   date: id.split('@')[1] || '',
    //   department: period?.department?._id || '',
    //   semester: period?.group?.semester || '',
    //   batch: period?.group?.batch || '',
    //   startTime: period?.startTime || '',
    //   endTime: period?.endTime || '',
    //   subject: period?.subject._id || '',
    //   teacher: period?.teacher._id || '',
    //   week: period?.week || '',
    //   students: students || [],
    // };
    const requestBody = {
      students: students || [],
    };
    const res = await updateAttendance(requestBody, id);
  };

  const tableHead = ['SL NO.', 'STUDENT NAME', 'USN NUMBER', 'ADMISSION STATUS', 'PRESENT'];

  useEffect(() => {
    if (id) getAttendance(id);
  }, [id]);
  useEffect(() => {
    if (attendance) {
      setStudents(attendance.students);
    }
  }, [attendance]);

  const allPresentHandler = (status: boolean) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        return { ...student, present: status };
      }),
    );
  };

  // Handle attendance status change for a specific student
  const handleAttendanceChange = (index: number, isPresent: boolean) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) => (i === index ? { ...student, present: isPresent } : student)),
    );
  };

  return (
    <div className={style.container}>
      <TableControlBox tableName="Update Attendance" showBackButton>
        <Button secondary onClick={() => navigate('/calendar/view')}>
          Open Calendar
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </TableControlBox>

      {/* <PeriodDetails period={period} /> */}
      <div className={style.allSelectContainer}>
        <Button secondary onClick={() => allPresentHandler(true)}>
          Present All
        </Button>
        <Button secondary onClick={() => allPresentHandler(false)}>
          Absent All
        </Button>
      </div>
      <Table>
        <TableHead tableHead={tableHead} />
        <TableBody
          tableBody={students.map((student, index) => (
            <StudentRow
              key={index}
              index={index}
              student={student}
              onChangeAttendance={(isPresent) => handleAttendanceChange(index, isPresent)}
            />
          ))}
        />
      </Table>
    </div>
  );
};

export default UpdateAttendancePage;

// Component for displaying student details in a table row
type StudentRowProps = {
  index: number;
  student: PeriodStudentsIF;
  onChangeAttendance: (isPresent: boolean) => void;
};

const StudentRow: React.FC<StudentRowProps> = ({ index, student, onChangeAttendance }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className={`${style.capitalize}`}>{`${student.firstName} ${student.lastName}`}</td>
      <td>{student.usnNumber}</td>
      <td>Completed</td>
      <td className={style.checkboxCell}>
        <input
          type="checkbox"
          checked={student.present}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeAttendance(e.target.checked)}
          className={style.checkboxInput}
        />
      </td>
    </tr>
  );
};

// Component for displaying period details
type PeriodDetailsProps = {
  period: PeriodIF | null;
};

const PeriodDetails: React.FC<PeriodDetailsProps> = ({ period }) => {
  if (!period) return null;

  return (
    <div className={style.detailsContainer}>
      <p>
        <strong>Department:</strong> {period?.department?.departmentCode}
      </p>
      <p>
        <strong>Semester:</strong> {period.group?.semester}
      </p>
      <p>
        <strong>Subject:</strong> {period.subject.shortName}
      </p>
      <p>
        <strong>Batch:</strong> {period.group?.batch}
      </p>
      <p>
        <strong>Week:</strong> {period.week}
      </p>
      <p>
        <strong>Start Time:</strong> {convertToAmPm(period.startTime)}
      </p>
      <p>
        <strong>End Time:</strong> {convertToAmPm(period.endTime)}
      </p>
    </div>
  );
};
