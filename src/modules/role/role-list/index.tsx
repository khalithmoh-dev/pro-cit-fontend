import style from './role.module.css';
import TableControlBox from '../../../components/table-control-box';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import { useNavigate } from 'react-router-dom';
import RoleTableComponent from './role-table/index.tsx';
import useAuthStore from '../../../store/authStore.ts';

const RoleListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();

  return (
    <div className={style.container}>
      <TableControlBox tableName="Roles">
        <Button
          disabled={!permissions?.employee?.create}
          onClick={() => navigate('/role/create')}
          startIcon={<PlusIcon fill="white" />}
        >
          Create&nbsp;Role
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <RoleTableComponent />
      </div>
    </div>
  );
};

export default RoleListPage;
