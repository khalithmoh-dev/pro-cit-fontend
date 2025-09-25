import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProgramStore from '../../../store/programStore';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/Icons';
import { t } from 'i18next';

// Example usage
const ProgramList = () => {
  const navigate = useNavigate();
  const { getPrograms, programs } = useProgramStore();
  const [programsData, setProgramsData] = useState([]);
   const { t } = useTranslation();

  //intial master function
  useEffect(() => {
    (async()=>{
      await getPrograms();
      setProgramsData(programs || []);
    })()
  }, []);
 
  // Column configuration
  const columns = [
    { 
      field: 'institutionName', 
      headerName: t("INSTITUITION_NAME"), 
      sortable: false
    },
    { 
      field: 'programId', 
      headerName: t("PROGRAM_ID"),
      sortable: true      
    },
    { 
      field: 'programName', 
      headerName: t("PROGRAM_NAME"),
      sortable: true,
    },
    { 
      field: 'description', 
      headerName:  t("DESCRIPTION"),
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    {
      label: 'View Details',
      icon: <Icon size={18} name="Eye" />,
      onClick: () => {
        navigate('/program/create')
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={programsData}
        columns={columns}
        title={t('PROGRAM_LIST')}
        actions={actions}
      />
    </Box>
  );
};

export default ProgramList;