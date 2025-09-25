import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDegreeStore from '../../../store/degreeStore';
import { useTranslation } from 'react-i18next';

// Example usage
const DegreeList = () => {
  const navigate = useNavigate();
  const { getDegrees,degrees } = useDegreeStore();
  const [degreesData, setDegreesData] = useState([]);
  const { t } = useTranslation();
  

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
      headerName: t("INSTITUITION_NAME"), 
      sortable: false
    },
    { 
      field: 'degreeId', 
      headerName: t("DEGREE_ID"), 
      sortable: true      
    },
    { 
      field: 'degreeName', 
      headerName: t("DEGREE_NAME"),
      sortable: true,
    },
    { 
      field: 'description', 
      headerName: t("DESCRIPTION"),
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    {
      label: t("VIEW_DETAILS"),
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
      <DataTable
        data={degreesData}
        columns={columns}
        onSelect={handleSelection}
        title={t("DEGREE")}
        actions={actions}
      />
    </Box>
  );
};

export default DegreeList;