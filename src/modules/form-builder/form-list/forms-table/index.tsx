import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import { useEffect, useState } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../../../../store/formStore';
import TableDeleteButton from '../../../../components/table-delete-button';

const FormTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { forms, getForms, deleteForm, initialLoading, deleting } = useFormStore();

  useEffect(() => {
    if (forms.length) return;
    getForms();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteForm(id);
    if (res) {
      getForms();
    }
  };

  const tableHead = ['SL NO.', 'FORM NAME', 'UPDATED AT', 'ACTION'];

  const tableBody = forms.map((form, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{form.name}</td>
      <td>{convertDateFormat(form.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
        <span onClick={() => navigate(`/formbuilder/update/${form._id}`)}>
          <RichEditorIcon />
        </span>
        <TableDeleteButton name={form.name} id={form._id} onClick={deleteHandler} deleting={deleting} />
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

export default FormTableComponent;
