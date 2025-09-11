import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useProgramStore from '../../../store/programStore';

// Example usage
const ProgramList = () => {
  const navigate = useNavigate();
  const { getPrograms, programs } = useProgramStore();
  const [programsData, setProgramsData] = useState([]);

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
      headerName: 'Institution Name', 
      sortable: false
    },
    { 
      field: 'programId', 
      headerName: 'Program ID', 
      sortable: true      
    },
    { 
      field: 'programName', 
      headerName: 'Program Name', 
      sortable: true,
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    {
      label: 'View Details',
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
      <PageTitle title={'Program list'}/>
      <DataTable
        data={programsData}
        columns={columns}
        onSelect={handleSelection}
        title="Program list"
        actions={actions}
      />
    </Box>
  );
};

export default ProgramList;