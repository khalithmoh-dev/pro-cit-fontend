import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import useSubjectStore from '../../../../store/subjectStore';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableActionTD from '../../../../components/table-action-td';
import useAuthStore from '../../../../store/authStore';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';

interface PropsIF {
  startIndex: number;
}

const SubjectTableComponent: React.FC<PropsIF> = ({ startIndex }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { subjects, getSubjects, deleteSubject, loading, deleting } = useSubjectStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteSubject(id);
    if (res) {
      getSubjects();
    }
  };

  const tableHead = ['SL NO.', 'SUBJECT NAME', 'DEPARTMENT', 'SEMESTER', 'TOTAL BATCHES', 'TYPE', 'ACTION'];

  const tableBody = subjects.map((subject, index) => (
    <tr key={index}>
      <td>{index + startIndex + 1}</td>
      <td>{subject?.name}</td>
      <td>{subject?.department?.departmentCode}</td>
      <td>{subject.semester}</td>
      <td>{subject.totalBatches}</td>
      <td>{subject.type}</td>
      <TableActionTD
        permission={permissions?.subject}
        deleting={deleting}
        id={subject._id}
        name="Subject"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/subject/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.subject)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default SubjectTableComponent;
