import style from './department.module.css';
import TableControlBox from '../../../components/table-control-box';
import DataTable from '../../common/generic-table';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import { useNavigate } from 'react-router-dom';
import DepartmentTableComponent from './department-table/index.tsx';
import useDepartmentStore from '../../../store/departmentStore.ts';
import useAuthStore from '../../../store/authStore.ts';
import { useEffect, useState } from 'react';
import { useToastStore } from '../../../store/toastStore.ts';
import Icon from '../../../components/Icons';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { showToast } = useToastStore();
  const { getDepartments, departmentOptions, loading } = useDepartmentStore();
  const [firstRender, setFirstRender] = useState(true);
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const [departmentData, setDepartmentData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if(getDepartments){
      (async () => {
        try {
          const aDepartmentList = await getDepartments();
          if (Array.isArray(aDepartmentList) && aDepartmentList.length) {
            setDepartmentData(aDepartmentList);
          }
        } catch (error) {
          console.error("Failed to fetch degrees:", error);
        }
      })();
    }
  }, [getDepartments]);

  const onRefresh = async () => {
    const res = await getDepartments(false);
    if (res) {
      setShowCacheMessage(false);
      showToast('success', 'Departments refreshed successfully');
    } else {
      showToast('error', 'Failed to refresh departments');
    }
  };

    // Column configuration
  const columns = [
    {
      field: 'insname',
      headerName: t("INSTITUITION_NAME"),
      sortable: false
    },
    {
      field: 'deptCd',
      headerName: t("DEPARTMENT_CODE"),
      sortable: true
    },
    {
      field: 'deptNm',
      headerName: t("DEPARTMENT_NAME"),
      sortable: true,
    },
    {
      field: 'desc',
      headerName: t("DESCRIPTION"),
      sortable: true
    },
  ];

    // Action buttons
      const actions = [
        {
          label: t("VIEW_DETAILS"),
          icon: <Icon name="Eye" size={18} />,
          onClick: (row) => {
            navigate(`/department/update/${row._id}`)
          }
        }
      ];

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={departmentData}
        columns={columns}
        addRoute = {'/department/create'}
        title={t("DEPARTMENT")}
        actions={actions}
      />
    </Box>
  );
};

export default DepartmentListPage;
