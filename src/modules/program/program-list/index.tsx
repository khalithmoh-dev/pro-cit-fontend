import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useProgramStore from '../../../store/programStore';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/Icons';
import useAuthStore from '../../../store/authStore';

// Example usage
const ProgramList = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { getPrograms } = useProgramStore();
  const [programsData, setProgramsData] = useState([]);
  const { t } = useTranslation();

  //intial master function
  useEffect(() => {
    (async()=>{
      setProgramsData(await getPrograms() || []);
    })()
  }, []);
 
  // Column configuration
  const columns = [
    { 
      field: 'insname', 
      headerName: t("INSTITUITION_NAME"), 
      sortable: false
    },
    {
      field: 'degNm',
      headerName: t("DEGREE"),
      sortable: true
    },
    { 
      field: 'prgCd', 
      headerName: t("PROGRAM_ID"),
      sortable: true      
    },
    { 
      field: 'prgNm', 
      headerName: t("PROGRAM_NAME"),
      sortable: true,
    },
    { 
      field: 'desc', 
      headerName:  t("DESCRIPTION"),
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    ...(authStore?.permissions?.["/program/list"]?.update ? [{
      label: 'View Details',
      icon: <Icon size={18} name="Eye" />,
      onClick: (row) => {
        navigate(`/program/form/${row._id}`)
      }
    }] : [])
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={programsData}
        columns={columns}
        addRoute='/program/form'
        title={t('PROGRAM_LIST')}
        actions={actions}
      />
    </Box>
  );
};

export default ProgramList;