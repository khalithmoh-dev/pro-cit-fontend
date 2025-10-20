import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useCourseStore from "../../../../store/courseStores";
import CourseUploadModal from '../CourseFormXtras/course-upload-modal';
import { t } from 'i18next';
import Icon from '../../../../components/Icons';

// Example usage
const CourseList: React.FC = () => {
    const navigate = useNavigate();
    const { getCourses } = useCourseStore();
    const [courseList, setCourseList] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Column configuration
    const columns = [
        {
            field: 'crsCd',
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
            sortable: true,
        }
    ];

    // Action buttons
    const actions = [
        {
            label: 'View Details',
            icon: <Icon size={18} name="Eye"/>,
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

      const aHeaderActn = [
        {
            actionName: 'upload',
            onClick: () => {
                setIsUploadModalOpen(true);
            }
        }
      ]

    return (
        <>
        <Box sx={{ p: 3 }}>
            <DataTable
                data={courseList}
                columns={columns}
                addRoute = {'/course/form'}
                headerAction={aHeaderActn}
                title={t("COURSES")}
                actions={actions}
            />
        </Box>
        <CourseUploadModal 
            setIsModalOpen={setIsUploadModalOpen}
            isModalOpen={isUploadModalOpen}
            handleModalUpload={() => {
                // Implement upload logic here
                console.log('data uploaded successfully')
            }}

        />
        </>
    );
};

export default CourseList;