import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import useStudentStore from '../../../../store/studentStore';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';
import TableActionTD from '../../../../components/table-action-td';
import useAuthStore from '../../../../store/authStore';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';

interface PropsIF {
  startIndex: number;
  setStudentId: (id: string) => void;
}

const StudentTableComponent: React.FC<PropsIF> = ({ startIndex, setStudentId }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { students, getStudents, deleteStudent, initialLoading, deleting } = useStudentStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteStudent(id);
    if (res) {
      getStudents();
    }
  };

  const rowClickHandler = (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
    e.stopPropagation();
    setStudentId(id);
  };

  const tableHead = [
    'SL NO.',
    'NAME',
    'DEPARTMENT',
    'SEMESTER',
    'USN NUMBER',
    'ADMISSION NUMBER',
    'ADMISSION STATUS',
    'ACTION',
  ];

  const tableBody = students.map((student, index) => (
    <tr key={index} onClick={(e) => rowClickHandler(e, student._id)}>
      <td>{index + startIndex + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>
        {student.firstName}&nbsp;{student.lastName}
      </td>
      <td>{student.department?.departmentCode}</td>
      <td>{student.semester}</td>
      <td style={{ textTransform: 'capitalize' }}>{student.usnNumber}</td>
      <td style={{ textTransform: 'capitalize' }}>{student.admissionNumber}</td>
      <td style={{ textTransform: 'capitalize' }}>{student.admissionStatus}</td>
      <TableActionTD
        permission={permissions?.student}
        deleting={deleting}
        id={student._id}
        name="Student"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/student/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={initialLoading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.student)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default StudentTableComponent;
