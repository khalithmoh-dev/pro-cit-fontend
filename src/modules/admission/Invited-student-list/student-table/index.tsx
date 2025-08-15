import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import { useEffect } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import useInvitedStudentStore from '../../../../store/invitedStudentStore';
import TableDeleteButton from '../../../../components/table-delete-button';
import Button from '../../../../components/button';
import useAuthStore from '../../../../store/authStore';

interface PropsIF {
  startIndex: number;
}

const StudentTableComponent: React.FC<PropsIF> = ({ startIndex }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { invitedStudents, getInvitedStudents, deleteInvitedStudent, initialLoading, deleting } =
    useInvitedStudentStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteInvitedStudent(id);
    if (res) {
      getInvitedStudents();
    }
  };

  const rowClickHandler = (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
    e.stopPropagation();
    navigate(`/admission/student/details/${id}`);
  };

  const tableHead = ['SL NO.', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'CREATED AT', 'ACTION'];

  const tableBody = invitedStudents.map((student, index) => (
    <tr key={index} onClick={(e) => rowClickHandler(e, student._id)}>
      <td>{index + startIndex + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{student.firstName}</td>
      <td>{student.lastName}</td>
      <td>{student.email}</td>
      <td>{convertDateFormat(student.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Button small secondary onClick={() => navigate(`/admission/student/approve/${student._id}`)}>
          Approve
        </Button>
        <TableDeleteButton
          hide={!permissions?.admission?.delete}
          name="Invited Student"
          id={student._id}
          onClick={deleteHandler}
          deleting={deleting}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <Table loading={initialLoading}>
        <TableHead tableHead={tableHead} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default StudentTableComponent;
