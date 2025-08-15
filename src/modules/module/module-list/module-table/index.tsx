import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import useModuleStore from '../../../../store/moduleStore';
import { useEffect } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableDeleteButton from '../../../../components/table-delete-button';

const ModuleTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { modules, getModules, deleteModule, deleting, loading } = useModuleStore();

  useEffect(() => {
    getModules();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteModule(id);
    if (res) {
      getModules();
    }
  };

  const tableHead = ['SL NO.', 'MODULE NAME', 'ORDER', 'UPDATED AT', 'ACTION'];

  const tableBody = modules.map((module, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{module.name}</td>
      <td>{module.order}</td>
      <td>{convertDateFormat(module.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
        <span onClick={() => navigate(`/module/update/${module._id}`)}>
          <RichEditorIcon />
        </span>
        <TableDeleteButton name="Module" id={module._id} onClick={deleteHandler} deleting={deleting} />
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

export default ModuleTableComponent;
