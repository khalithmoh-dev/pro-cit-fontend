import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import useDesignationStore from '../../../../store/designationStore';
import { useEffect, useState } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';
import TableActionTD from '../../../../components/table-action-td';
import useAuthStore from '../../../../store/authStore';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';

const DesignationTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { designations, getDesignations, deleteDesignation, loading, deleting } = useDesignationStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteDesignation(id);
    if (res) {
      getDesignations();
    }
  };

  const tableHead = ['SL NO.', 'DESIGNATION NAME', 'CREATED AT', 'UPDATED AT', 'ACTION'];

  const tableBody = designations.map((designation, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{designation.name}</td>
      <td>{convertDateFormat(designation.createdAt)}</td>
      <td>{convertDateFormat(designation.updatedAt)}</td>
      <TableActionTD
        permission={permissions?.designation}
        deleting={deleting}
        id={designation._id}
        name="Designation"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/designation/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.designation)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default DesignationTableComponent;
