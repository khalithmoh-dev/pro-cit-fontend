import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import useRoleStore from '../../../../store/roleStore';
import { useEffect } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';

const RoleTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { roles, getRoles, deleteRole, deleting, loading } = useRoleStore();

  useEffect(() => {
    getRoles();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteRole(id);
    if (res) {
      getRoles();
    }
  };

  const tableHead = ['SL NO.', 'ROLE NAME', 'UPDATED AT', 'ACTION'];

  const tableBody = roles.map((role, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{role.name}</td>
      <td>{convertDateFormat(role.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
        <span onClick={() => navigate(`/role/update/${role._id}`)}>
          <RichEditorIcon />
        </span>
        <TableDeleteButton name={role.name} id={role._id} onClick={deleteHandler} deleting={deleting} />
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

export default RoleTableComponent;
