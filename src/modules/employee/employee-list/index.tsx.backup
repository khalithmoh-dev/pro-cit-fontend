// import { useCallback, useEffect, useState } from 'react';
// import style from './employee.module.css';
// import TableControlBox from '../../../components/table-control-box';
// import TableRow from '../../../components/table-row';
// import Button from '../../../components/button';
// import PlusIcon from '../../../icon-components/PlusIcon';
// import Pagination from '../../../components/pagination/index.tsx';
// import { useNavigate } from 'react-router-dom';
// import TableSelect from '../../../components/bu-select/index.tsx';
// import useDepartmentStore from '../../../store/departmentStore.ts';
// import EmployeeTableComponent from './employee-table/index.tsx';
// import useEmployeeStore from '../../../store/employeeStore.ts';
// import TableSearch from '../../../components/table-search/index.tsx';
// import { tableRowOptions } from '../../../utils/static-data/index.ts';
// import useAuthStore from '../../../store/authStore.ts';
// import useDesignationStore from '../../../store/designationStore.ts';
// import { debounce } from 'lodash';
// import ViewEmployee from '../view-employee/index.tsx';

// const EmployeeListPage = () => {
//   const navigate = useNavigate();
//   const { getDepartments, departmentOptions } = useDepartmentStore();
//   const { getDesignations, designationOptions } = useDesignationStore();
//   const { permissions } = useAuthStore();
//   const { getEmployees, loading, total, clearEmployee } = useEmployeeStore();
//   const { user } = useAuthStore();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [tableRows, setTableRows] = useState('10');
//   const [searchText, setSearchText] = useState('');
//   const [employeeId, setEmployeeId] = useState('');
//   const [debounceSearchText, setDebounceSearchText] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedDesignation, setSelectedDesignation] = useState('');
//   const [firstRender, setFirstRender] = useState(true);
//   const roleName = user?.user?.role?.name || '';

//   useEffect(() => {
//     const getAllUsers = async () => {
//       const res = await getEmployees(
//         {
//           pageSize: tableRows,
//           pageNumber: currentPage,
//           searchText: debounceSearchText,
//           department: selectedDepartment,
//           designation: selectedDesignation,
//         },
//         firstRender,
//       );

//       if (res) setFirstRender(false);
//     };

//     getAllUsers();
//   }, [tableRows, currentPage, debounceSearchText, selectedDepartment, selectedDesignation]);

//   useEffect(() => {
//     if (!departmentOptions.length) getDepartments();
//     if (!designationOptions.length) getDesignations();
//   }, []);

//   const debouncedChangeHandler = useCallback(
//     debounce((value: string) => {
//       setDebounceSearchText(value);
//     }, 1500),
//     [],
//   );

//   const handleOnchangeSearchText = (text: string) => {
//     setSearchText(text);
//     debouncedChangeHandler(text);
//   };

//   const closeEmployeeViewPage = (id: string) => {
//     setEmployeeId(id);
//     clearEmployee();
//   };

//   return (
//     <>
//       {employeeId && <ViewEmployee employeeId={employeeId} setEmployeeId={closeEmployeeViewPage} />}
//       <div className={`${style.container} ${employeeId ? style.hideContainer : ''}`}>
//         <TableControlBox loading={loading} tableName="Employees">
//           <TableSelect
//             hide={roleName !== 'admin' && roleName !== 'superadmin'}
//             options={departmentOptions}
//             update={(department) => setSelectedDepartment(department)}
//             clearFilter={() => setSelectedDepartment('')}
//           />
//           <TableSelect
//             options={designationOptions}
//             update={(designation) => setSelectedDesignation(designation)}
//             clearFilter={() => setSelectedDesignation('')}
//             label="Designation"
//           />
//           <TableRow
//             options={tableRowOptions}
//             row={`${tableRows}`}
//             setRow={(size) => {
//               setCurrentPage(1);
//               setTableRows(size);
//             }}
//           />
//           <TableSearch searchText={searchText} setSearchText={handleOnchangeSearchText} />
//           <Button
//             disabled={!permissions?.employee?.create}
//             onClick={() => navigate('/employee/create')}
//             startIcon={<PlusIcon fill="white" />}
//           >
//             Create&nbsp;Employee
//           </Button>
//         </TableControlBox>
//         <div className={style.tableContainer}>
//           <EmployeeTableComponent
//             setEmployeeId={setEmployeeId}
//             startIndex={Number(tableRows) * currentPage - Number(tableRows)}
//           />
//         </div>
//         <Pagination
//           currentPage={currentPage}
//           totalPages={Math.ceil(total / Number(tableRows))}
//           onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
//           loading={loading}
//         />
//       </div>
//     </>
//   );
// };

// export default EmployeeListPage;

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import DataTable from '../../common/generic-table';
import { useTranslation } from 'react-i18next';
import useEmployeeStore, { employeeIF } from '../../../store/employeeStore';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { Box, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import SectionHeader from '../../../components/SectionHeader';
import Button from '../../../components/ButtonMui';
import useDepartmentStore from '../../../store/departmentStore';
import useDesignationStore from '../../../store/designationStore';

const EmployeeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getEmployees, deleteEmployee, employees, total } = useEmployeeStore();
  const { permissions } = useAuthStore();
  const { getDepartments } = useDepartmentStore();
  const { getDesignations, designationOptions } = useDesignationStore();

  const [filters, setFilters] = useState({
    department: '',
    designation: '',
  });
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch departments and designations on mount
  useEffect(() => {
    const fetchFilters = async () => {
      const deptResult = await getDepartments(1, 1000, '');
      if (deptResult?.data) {
        const deptOpts = deptResult.data.map((dept: any) => ({
          label: dept.name || dept.departmentCode,
          value: dept._id,
        }));
        setDepartmentOptions(deptOpts);
      }
      await getDesignations();
    };
    fetchFilters();
  }, [getDepartments, getDesignations]);

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({ department: '', designation: '' });
    setRefreshKey((prev) => prev + 1); // Force table refresh
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setRefreshKey((prev) => prev + 1); // Force table refresh with new filters
  };

  // Define table columns - memoized to prevent recreation
  const columns = useMemo(() => [
    {
      field: 'slNo',
      headerName: t('SL_NO') || 'Sl No',
      renderCell: (row: any) => row.slNo,
    },
    {
      field: 'name',
      headerName: t('NAME') || 'Name',
      renderCell: (row: employeeIF) =>
        `${row.salutation || ''} ${row.firstName} ${row.middleName || ''} ${row.lastName || ''}`.trim(),
    },
    {
      field: 'employeeCode',
      headerName: t('EMPLOYEE_CODE') || 'Employee Code',
      renderCell: (row: employeeIF) => row.employeeCode,
    },
    {
      field: 'email',
      headerName: t('EMAIL') || 'Email',
      renderCell: (row: employeeIF) => row.email,
    },
    {
      field: 'contactNumber',
      headerName: t('CONTACT') || 'Contact',
      renderCell: (row: employeeIF) => row.contactNumber,
    },
    {
      field: 'department',
      headerName: t('DEPARTMENT') || 'Department',
      renderCell: (row: employeeIF) => row.department?.name || row.department?.departmentCode || '-',
    },
    {
      field: 'designation',
      headerName: t('DESIGNATION') || 'Designation',
      renderCell: (row: employeeIF) => row.designation?.name || '-',
    },
    {
      field: 'role',
      headerName: t('ROLE') || 'Role',
      renderCell: (row: employeeIF) => row.role?.name || '-',
    },
  ], [t]);

  // Define action buttons - memoized to prevent recreation
  const actions = useMemo(() => [
    {
      label: t('VIEW') || 'View',
      icon: <Eye size={18} />,
      color: 'primary',
      onClick: (row: employeeIF) => navigate(`/employee/view/${row._id}`),
    },
    ...(permissions?.employee?.update
      ? [
          {
            label: t('EDIT') || 'Edit',
            icon: <Edit size={18} />,
            color: 'info',
            onClick: (row: employeeIF) => navigate(`/employee/update/${row._id}`),
          },
        ]
      : []),
    ...(permissions?.employee?.delete
      ? [
          {
            label: t('DELETE') || 'Delete',
            icon: <Trash2 size={18} />,
            color: 'error',
            onClick: async (row: employeeIF) => {
              if (window.confirm(t('DELETE_CONFIRMATION') || 'Are you sure you want to delete this employee?')) {
                await deleteEmployee(row._id);
              }
            },
          },
        ]
      : []),
  ], [t, navigate, permissions, deleteEmployee]);

  // API service for server-side data fetching - useCallback to prevent recreation
  const apiService = useCallback(async (page: number, limit: number, searchTerm: string) => {
    try {
      const response = await getEmployees({
        pageSize: limit,
        pageNumber: page + 1, // Convert 0-based to 1-based
        searchText: searchTerm,
        department: filters.department,
        designation: filters.designation,
      });

      // Get fresh data from store after API call
      const currentEmployees = useEmployeeStore.getState().employees;
      const currentTotal = useEmployeeStore.getState().total;

      // Add serial numbers to employees
      const employeesWithSlNo = currentEmployees.map((emp, index) => ({
        ...emp,
        slNo: page * limit + index + 1,
        id: emp._id, // DataTable expects 'id' field for row selection
      }));

      return {
        data: employeesWithSlNo,
        total: currentTotal,
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return {
        data: [],
        total: 0,
      };
    }
  }, [getEmployees, filters.department, filters.designation, refreshKey]);

  return (
    <>
      {/* Filter Section */}
      <Box mb={3} className="generic-master-card" sx={{ p: 2, border: '1px solid rgba(224, 224, 224, 1)', borderRadius: 3 }}>
        <SectionHeader sectionName={t('FILTER') || 'Filter'} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Department Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('DEPARTMENT') || 'Department'}</InputLabel>
            <Select
              value={filters.department}
              label={t('DEPARTMENT') || 'Department'}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <MenuItem value="">
                <em>{t('ALL') || 'All'}</em>
              </MenuItem>
              {departmentOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Designation Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('DESIGNATION') || 'Designation'}</InputLabel>
            <Select
              value={filters.designation}
              label={t('DESIGNATION') || 'Designation'}
              onChange={(e) => handleFilterChange('designation', e.target.value)}
            >
              <MenuItem value="">
                <em>{t('ALL') || 'All'}</em>
              </MenuItem>
              {designationOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filter Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variantType="outlined" size="small" onClick={handleResetFilters}>
              {t('RESET') || 'Reset'}
            </Button>
            <Button variantType="submit" size="small" onClick={handleApplyFilters}>
              {t('APPLY') || 'Apply'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Data Table */}
      <DataTable
        title={t('EMPLOYEES') || 'Employees'}
        columns={columns}
        actions={actions}
        apiService={apiService}
        serverSide={true}
        searchable={true}
        pagination={true}
        addRoute="/employee/create"
        selectable={false}
      />
    </>
  );
};

export default EmployeeListPage;
