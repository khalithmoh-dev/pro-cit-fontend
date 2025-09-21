import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useProgramStore from '../../../store/programStore';
import { useTranslation } from 'react-i18next';

// Example usage
const ProgramList = () => {
  const navigate = useNavigate();
  const { getPrograms, programs } = useProgramStore();
  const [programsData, setProgramsData] = useState([]);
   const { t } = useTranslation();

  useEffect(() => {
    getPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      setProgramsData(programs);
    }
  }, [programs]);
 
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
      label: t("VIEW_DETAILS"),
      icon: <Eye size={18} />,
      onClick: (row) => {
        navigate('/program/create')
      }
    }
  ];

  // Handle selection
  const handleSelection = (selectedIds) => {
    console.log('Selected IDs:', selectedIds);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle title={t("PROGRAM_LIST")}/>
      <DataTable
        data={programsData}
        columns={columns}
        onSelect={handleSelection}
        title= {t("PROGRAM_LIST")}
        actions={actions}
      />
    </Box>
  );
};

export default ProgramList;