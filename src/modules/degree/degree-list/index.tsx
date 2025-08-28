import React from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";

// Example usage
const ExampleTable = () => {
  const navigate = useNavigate();
  // Sample data
  const sampleData = [
    { id: 1, name: 'Project Alpha', status: 'active', category: 'Development', budget: 5000, deadline: '2024-03-15' },
    { id: 2, name: 'Marketing Campaign', status: 'pending', category: 'Marketing', budget: 3200, deadline: '2024-04-20' },
    { id: 3, name: 'System Upgrade', status: 'completed', category: 'Infrastructure', budget: 7500, deadline: '2024-02-10' },
    { id: 4, name: 'Website Redesign', status: 'active', category: 'Development', budget: 4200, deadline: '2024-05-05' },
    { id: 5, name: 'Product Launch', status: 'pending', category: 'Marketing', budget: 8500, deadline: '2024-06-12' },
  ];

  // Column configuration
  const columns = [
    { 
      field: 'name', 
      headerName: 'Project Name', 
      sortable: true
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      sortable: true,
      renderCell: (row) => {
        const colorMap = {
          active: 'success',
          pending: 'warning',
          completed: 'primary'
        };
        
        return (
          <Chip 
            label={row.status} 
            color={colorMap[row.status] || 'default'} 
            size="small" 
          />
        );
      }
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      sortable: true,
    },
    { 
      field: 'budget', 
      headerName: 'Budget ($)', 
      sortable: true,
      renderCell: (row) => `$${row.budget.toLocaleString()}`,
    },
    { 
      field: 'deadline', 
      headerName: 'Deadline', 
      sortable: true,
      renderCell: (row) => new Date(row.deadline).toLocaleDateString(),
    },
  ];

  // Action buttons
  const actions = [
    {
      label: 'View Details',
      icon: <Eye size={18} />,
      onClick: (row) => {
        console.log('View:', row);
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
        data={sampleData}
        columns={columns}
        onSelect={handleSelection}
        title="Degree list"
        actions={actions}
      />
    </Box>
  );
};

export default ExampleTable;