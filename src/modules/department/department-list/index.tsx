import style from './department.module.css';
import TableControlBox from '../../../components/table-control-box';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import { useNavigate } from 'react-router-dom';
import DepartmentTableComponent from './department-table/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import useAuthStore from '../../../store/authStore.ts';
import { useEffect, useState } from 'react';
import { useToastStore } from '../../../store/toastStore.ts';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { showToast } = useToastStore();
  const { getDepartments, departmentOptions, loading } = useDepartmentStore();
  const [firstRender, setFirstRender] = useState(true);
  const [showCacheMessage, setShowCacheMessage] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      if (departmentOptions.length) return;
      const res = await getDepartments(firstRender);
      if (res) setFirstRender(false);
    };
    getAllUsers();
  }, []);

  const onRefresh = async () => {
    const res = await getDepartments(false);
    if (res) {
      setShowCacheMessage(false);
      showToast('success', 'Departments refreshed successfully');
    } else {
      showToast('error', 'Failed to refresh departments');
    }
  };

  return (
    <div className={style.container}>
      <TableControlBox
        tableName="Departments"
        onRefresh={onRefresh}
        showCacheMessage={showCacheMessage}
        showBackButton
        loading={loading}
      >
        <Button
          disabled={!permissions?.department?.create}
          onClick={() => navigate('/department/create')}
          startIcon={<PlusIcon fill="white" />}
        >
          Create&nbsp;Department
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <DepartmentTableComponent />
      </div>
    </div>
  );
};

export default DepartmentListPage;
