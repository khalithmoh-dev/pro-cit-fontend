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

import React,{ useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import EnterpriseFilterForm from "./../../../components/enterprisefilter";
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useBaseStore, { BaseData } from '../../../store/baseStore';

const EmployeeListPage = () => {
  const { t } = useTranslation();
  const [baseData, setBaseData] = useState<BaseData>({ institutes: [], program: [], department: [], semester: [] });
  const baseStore = useBaseStore();

  //to get the initial base data eg: program data and degree data
    useEffect(() => {
      try {
        if (baseStore) {
          (async () => {
            const aReq = ['institutes'];
            const oBaseData = await baseStore.getBaseData(aReq);
            setBaseData(oBaseData);
          })();
        }
      } catch (err) {
        console.error(err);
      }
    }, [baseStore]);
  console.log('baseData',baseData?.institutes)
  const schema = {
      fields: {
        "COURSE_SCHEDULE": [
          {
            name: "insId",
            label: t("INSTITUTION_NAME"),
            type: 'select',
            labelKey: "insName",
            valueKey: "_id",
            validation: Yup.string().required(t("INSTITUTION_NAME_IS_REQUIRED")),
            options: baseData?.institutes ?? [],
            isRequired: true,
            multiOptn: true
          },
          {
            name: "degId",
            label: t("DEGREE"),
            type: "select",
            labelKey: "degNm",
            valueKey: "_id",
            validation: Yup.string().required(t("DEGREE_IS_REQUIRED")),
            isRequired: true,
            options: baseData?.degree ?? []
          }, {
            name: "prgId",
            label: t("PROGRAM"),
            type: "select",
            labelKey: "prgNm",
            valueKey: "_id",
            validation: Yup.string().required(t("PROGRAM_IS_REQUIRED")),
            isRequired: true,
            options: baseData?.program ?? []
          },
          {
            name: "deptId",
            label: t("DEPARTMENT"),
            type: "select",
            labelKey: "deptNm",
            valueKey: "_id",
            validation: Yup.string().required(t("DEPARTMENT_IS_REQUIRED")),
            isRequired: true,
            options: baseData?.department ?? []
          },
          {
            name: "semId",
            label: t("SEMESTER"),
            type: "select",
            labelKey: "semNm",
            valueKey: "_id",
            validation: Yup.string().required(t("SEMESTER_IS_REQUIRED")),
            isRequired: true,
            options: baseData?.semester ?? []
          }
        ]
      },
      buttons: [
        {
          name: t("RESET"), variant: "outlined", nature: "reset", onClick: ()=>{}
        }, {
          name: t("SEARCH"), variant: "contained", nature: "primary", type: "submit"
        }
      ]
    };
  return (
    <>
      <EnterpriseFilterForm
        schema={schema}
        onSubmit={() => {}}
      />
      {/* <DataTable /> */}
    </>
  )
};

export default EmployeeListPage;
