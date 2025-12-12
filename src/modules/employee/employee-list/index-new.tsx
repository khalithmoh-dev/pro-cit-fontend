import React, { useState, useCallback, useMemo, useEffect } from 'react';
import DataTable from '../../common/generic-table';
import { useTranslation } from 'react-i18next';
import useEmployeeStore, { employeeIF } from '../../../store/employeeStore';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import EnterpriseFilter from '../../../components/enterprisefilter';
import useCourseStore from '../../../store/courseStore';
import useDesignationStore from '../../../store/designationStore';
import { Box, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import SectionHeader from '../../../components/SectionHeader';
import Button from '../../../components/ButtonMui';

const EmployeeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getEmployees, deleteEmployee } = useEmployeeStore();
  const { permissions } = useAuthStore();
  const { getAllCourse } = useCourseStore();
  const { getDesignations, designationOptions } = useDesignationStore();

  const [filters, setFilters] = useState({
    insId: '',
    prgId: '',
    courseId: '',
    deptId: '',
    designation: '',
  });
  const [courseOptions, setCourseOptions] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch courses and designations on mount
  useEffect(() => {
    const fetchAdditionalFilters = async () => {
      // Fetch all courses
      await getAllCourse();
      const allCourses = useCourseStore.getState().allCourses;
      if (allCourses && Array.isArray(allCourses)) {
        const courseOpts = allCourses.map((course: any) => ({
          label: course.course_name,
          value: course._id,
        }));
        setCourseOptions(courseOpts);
      }

      // Fetch designations
      await getDesignations();
    };
    fetchAdditionalFilters();
  }, [getAllCourse, getDesignations]);

  // Handle enterprise filter search
  const handleEnterpriseFilterSearch = (values: any) => {
    setFilters({
      insId: values.insId || '',
      prgId: values.prgId || '',
      courseId: values.courseId || '',
      deptId: values.deptId || '',
      designation: filters.designation, // Keep existing designation filter
    });
    setRefreshKey((prev) => prev + 1); // Force table refresh
  };

  // Handle designation filter change
  const handleDesignationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, designation: value }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      insId: '',
      prgId: '',
      courseId: '',
      deptId: '',
      designation: '',
    });
    setRefreshKey((prev) => prev + 1);
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Enterprise filter schema
  const enterpriseFilterSchema = {
    fields: {
      institutes: {
        label: t('INSTITUTION') || 'Institution',
        type: 'select',
        required: false,
      },
      program: {
        label: t('PROGRAM') || 'Program',
        type: 'select',
        required: false,
      },
      course: {
        label: t('COURSE') || 'Course',
        type: 'select',
        required: false,
        options: courseOptions, // Pass course options externally
      },
      department: {
        label: t('DEPARTMENT') || 'Department',
        type: 'select',
        required: false,
      },
    },
    buttons: [
      {
        name: t('RESET') || 'Reset',
        variant: 'outlined',
        nature: 'reset',
        onClick: handleResetFilters,
      },
      {
        name: t('SEARCH') || 'Search',
        variant: 'contained',
        nature: 'primary',
        type: 'submit',
      },
    ],
  };

  // Define table columns - memoized to prevent recreation
  const columns = useMemo(
    () => [
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
    ],
    [t]
  );

  // Define action buttons - memoized to prevent recreation
  const actions = useMemo(
    () => [
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
                  setRefreshKey((prev) => prev + 1); // Refresh table after delete
                }
              },
            },
          ]
        : []),
    ],
    [t, navigate, permissions, deleteEmployee]
  );

  // API service for server-side data fetching - useCallback to prevent recreation
  const apiService = useCallback(
    async (page: number, limit: number, searchTerm: string) => {
      try {
        // Build query with all filters
        const query: any = {
          pageSize: limit,
          pageNumber: page + 1, // Convert 0-based to 1-based
          searchText: searchTerm,
        };

        // Add filters if they have values
        if (filters.deptId) query.department = filters.deptId;
        if (filters.designation) query.designation = filters.designation;
        if (filters.insId) query.institute = filters.insId;
        if (filters.prgId) query.program = filters.prgId;
        if (filters.courseId) query.course = filters.courseId;

        const response = await getEmployees(query);

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
    },
    [getEmployees, filters.deptId, filters.designation, filters.insId, filters.prgId, filters.courseId, refreshKey]
  );

  return (
    <>
      {/* Enterprise Filter Section */}
      <EnterpriseFilter
        autoFieldSchema={enterpriseFilterSchema.fields}
        schema={{ buttons: enterpriseFilterSchema.buttons }}
        onSubmit={handleEnterpriseFilterSearch}
        isAutoGen={true}
      />

      {/* Additional Designation Filter */}
      <Box mb={3} className="generic-master-card" sx={{ p: 2, border: '1px solid rgba(224, 224, 224, 1)', borderRadius: 3 }}>
        <SectionHeader sectionName={t('ADDITIONAL_FILTERS') || 'Additional Filters'} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Designation Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('DESIGNATION') || 'Designation'}</InputLabel>
            <Select
              value={filters.designation}
              label={t('DESIGNATION') || 'Designation'}
              onChange={(e) => handleDesignationChange(e.target.value)}
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
