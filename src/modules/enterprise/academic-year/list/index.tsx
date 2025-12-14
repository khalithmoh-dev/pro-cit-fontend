import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAcademicYearStore from "../../../../store/academicYearStore";
import { t } from 'i18next';
import Icon from '../../../../components/Icons';

const AcademicYearList: React.FC = () => {
    const navigate = useNavigate();
    const { getAcademicYears } = useAcademicYearStore();
    const [academicYearList, setAcademicYearList] = useState([]);

    // Column configuration
    const columns = [
        {
            field: 'insName',
            headerName: t("INSTITUTION_NAME"),
            sortable: true,
        },
        {
            field: 'academicYearCode',
            headerName: t("ACADEMIC_YEAR_CODE"),
            sortable: true,
        },
        {
            field: 'academicYearNm',
            headerName: t("ACADEMIC_YEAR_NAME"),
            sortable: true,
        },
        {
            field: 'startDate',
            headerName: t("START_DATE"),
            sortable: true,
            renderCell: (row: any) => {
                return row.startDate ? new Date(row.startDate).toLocaleDateString() : '';
            }
        },
        {
            field: 'endDate',
            headerName: t("END_DATE"),
            sortable: true,
            renderCell: (row: any) => {
                return row.endDate ? new Date(row.endDate).toLocaleDateString() : '';
            }
        }
    ];

    // Action buttons
    const actions = [
        {
            label: 'View Details',
            icon: <Icon size={18} name="Eye"/>,
            onClick: (row) => {
                navigate('/academic-year/form/' + row._id);
            }
        }
    ];

    useEffect(() => {
        if (getAcademicYears) {
          (async () => {
            try {
              const aAcademicYearRes = await getAcademicYears();
              if (Array.isArray(aAcademicYearRes?.data) && aAcademicYearRes?.data?.length) {
                setAcademicYearList(aAcademicYearRes?.data);
              }
            } catch (error) {
              console.error("Failed to fetch academic years:", error);
            }
          })();
        }
    }, [getAcademicYears]);

    return (
        <Box sx={{ p: 3 }}>
            <DataTable
                data={academicYearList}
                columns={columns}
                addRoute = {'/academic-year/form'}
                title={t("ACADEMIC_YEARS")}
                actions={actions}
            />
        </Box>
    );
};

export default AcademicYearList;