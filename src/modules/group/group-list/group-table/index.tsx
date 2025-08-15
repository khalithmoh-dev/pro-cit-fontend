import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import useGroupStore from '../../../../store/groupStore';
import { useEffect, useState } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';
import useAuthStore from '../../../../store/authStore';
import TableActionTD from '../../../../components/table-action-td';

interface PropsIF {
  startIndex: number;
}

const GroupTableComponent: React.FC<PropsIF> = ({ startIndex }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { groups, getGroups, deleteGroup, loading, deleting } = useGroupStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteGroup(id);
    if (res) {
      getGroups();
    }
  };

  const tableHead = ['SL NO.', 'GROUP NAME', 'DEPARTMENT', 'SEMESTER', 'SUBJECT', 'BATCH', 'UPDATED AT', 'ACTION'];

  const tableBody = groups.map((group, index) => (
    <tr key={index}>
      <td>{index + startIndex + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{group.name}</td>
      <td>{group.department?.departmentCode}</td>
      <td>{group.semester}</td>
      <td>{group?.subject?.name}</td>
      <td>{group.batch}</td>
      <td>{convertDateFormat(group.createdAt)}</td>
      <TableActionTD
        permission={permissions?.group}
        deleting={deleting}
        id={group._id}
        name="Group"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/group/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.group)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default GroupTableComponent;
