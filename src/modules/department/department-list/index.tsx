import DataTable from '../../common/generic-table';
import { useNavigate } from 'react-router-dom';
import useDepartmentStore from '../../../store/departmentStore.ts';
import Icon from '../../../components/Icons';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const { getDepartments } = useDepartmentStore();
  const { t } = useTranslation();


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
        data={[]}
        columns={columns}
        addRoute={'/department/create'}
        title={t("DEPARTMENT")}
        actions={actions}
        apiService={getDepartments}
        serverSide={true}
      />
    </Box>
  );
};

export default DepartmentListPage;
