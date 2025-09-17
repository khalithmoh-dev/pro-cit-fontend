import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from "../../../../store/courseStores";
import PageTitle from "../../../../components/PageTitle";
import TitleButton from '../../../../components/TitleButton';
import { t } from 'i18next';

// Example usage
const CourseList: React.FC = () => {
    const navigate = useNavigate();
    const { getCourses } = useCourseStore();
    const [courseList, setCourseList] = useState([]);


    // Column configuration
    const columns = [
        {
            field: 'institutionName',
            headerName: 'Institution Name',
            sortable: false
        },
        {
            field: 'crsId',
            headerName: t("COURSE_ID"),
            sortable: true
        },
        {
            field: 'crsNm',
            headerName: t("COURSE_NAME"),
            sortable: true,
        },
        {
            field: 'offDept',
            headerName: t("OFFERING_DEPARTMENT"),
            sortable: true
        },
        {
            field: 'crsType',
            headerName: t("COURSE_TYPE"),
            sortable: true
        },
        {
            field: 'crdt',
            headerName: t("CREDIT"),
            sortable: true
        },
        {
            field: 'category',
            headerName: t("CATEGORY"),
            sortable: true
        },
        {
            field: 'subCat',
            headerName: t("SUB_CATEGORY"),
            sortable: true
        }
    ];

    // Action buttons
    const actions = [
        {
            label: 'View Details',
            icon: <Eye size={18} />,
            onClick: (row) => {
                navigate('/course/form/' + row._id);
            }
        }
    ];

    useEffect(() => {
        if (getCourses) {
          (async () => {
            try {
              const aCourseRes = await getCourses();
              if (Array.isArray(aCourseRes) && aCourseRes.length) {
                setCourseList(aCourseRes)
              }
            } catch (error) {
              console.error("Failed to fetch degrees:", error);
            }
          })();
        }
      }, [getCourses]);

    return (
        <Box sx={{ p: 3 }}>
            <PageTitle title={t("COURSE_LIST")} >
                <TitleButton Btnname={t("ADD")} onClick={()=>navigate('/course/form')} />
            </PageTitle>
            <DataTable
                data={courseList}
                columns={columns}
                title={t("COURSES")}
                actions={actions}
            />
        </Box>
    );
};

export default CourseList;