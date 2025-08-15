import style from './designation.module.css';
import TableControlBox from '../../../components/table-control-box';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import { useNavigate } from 'react-router-dom';
import DesignationTableComponent from './designation-table/index.tsx';
import { useEffect, useState } from 'react';
import useDesignationStore from '../../../store/designationStore.ts';
import { useToastStore } from '../../../store/toastStore.ts';
import useAuthStore from '../../../store/authStore.ts';

const DesignationListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { permissions } = useAuthStore();
  const { designations, getDesignations, loading } = useDesignationStore();
  const [showCacheMessage, setShowCacheMessage] = useState(true);

  useEffect(() => {
    if (designations.length) return;
    getDesignations();
  }, []);

  const onRefresh = async () => {
    const res = await getDesignations();
    if (res) {
      setShowCacheMessage(false);
      showToast('success', 'Designations refreshed successfully');
    } else {
      showToast('error', 'Failed to refresh designations');
    }
  };
  return (
    <div className={style.container}>
      <TableControlBox
        tableName="Designations"
        onRefresh={onRefresh}
        showCacheMessage={showCacheMessage}
        showBackButton
        loading={loading}
      >
        <Button
          disabled={!permissions?.designation?.create}
          onClick={() => navigate('/designation/create')}
          startIcon={<PlusIcon fill="white" />}
        >
          Create&nbsp;Designation
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <DesignationTableComponent />
      </div>
    </div>
  );
};
export default DesignationListPage;
