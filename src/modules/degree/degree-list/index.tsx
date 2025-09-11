import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useDegreeStore from '../../../store/degreeStore';

// Example usage
const DegreeList = () => {
  const navigate = useNavigate();
  const { getDegrees,degrees } = useDegreeStore();
  const [degreesData, setDegreesData] = useState([]);

  useEffect(() => {
    if (getDegrees) {
      (async () => {
        try {
          const aDegreeList = await getDegrees();
          if (Array.isArray(aDegreeList) && aDegreeList.length) {
            setDegreesData(aDegreeList);
          }
        } catch (error) {
          console.error("Failed to fetch degrees:", error);
        }
      })();
    }
  }, [getDegrees]);


  useEffect(() => {
    if (degrees.length > 0) {
      setDegreesData(degrees);
    }
  }, [degrees]);
 
  // Column configuration
  const columns = [
    { 
      field: 'institutionName', 
      headerName: 'Institution Name', 
      sortable: false
    },
    { 
      field: 'degreeId', 
      headerName: 'Degree ID', 
      sortable: true      
    },
    { 
      field: 'degreeName', 
      headerName: 'Degree Name', 
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
        navigate('/degree/create')
      }
    }
  ];

  // Handle selection
  const handleSelection = (selectedIds) => {
    console.log('Selected IDs:', selectedIds);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle title={'Degree list'}/>
      <DataTable
        data={degreesData}
        columns={columns}
        onSelect={handleSelection}
        title="Degree list"
        actions={actions}
      />
    </Box>
  );
};

export default DegreeList;