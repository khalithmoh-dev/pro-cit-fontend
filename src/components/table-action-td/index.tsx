import RichEditorIcon from '../../icon-components/RichEditor';
import { ModulePermissions } from '../../store/moduleStore';
import TableDeleteButton from '../table-delete-button';

interface PropsIF {
  permission: ModulePermissions | null | undefined;
  id: string;
  deleteHandler: (id: string) => void;
  updateHandler: (id: string) => void;
  deleting: string;
  name: string;
}

const TableActionTD: React.FC<PropsIF> = ({ permission, id, deleteHandler, deleting, name, updateHandler }) => {
  if (!permission?.update && !permission?.delete) return null;

  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    updateHandler(id);
  };
  return (
    <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
      {permission.update && (
        <span onClick={onClickHandler}>
          <RichEditorIcon />
        </span>
      )}
      <TableDeleteButton hide={!permission.delete} name={name} id={id} onClick={deleteHandler} deleting={deleting} />
    </td>
  );
};
export default TableActionTD;
