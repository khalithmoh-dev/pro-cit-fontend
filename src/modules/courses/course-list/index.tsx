import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useToastStore } from '../../../store/toastStore';
import style from "./course.module.css"
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import CourseTableComponent from './course-table';
import Pagination from '../../../components/pagination';
import PlusIcon from '../../../icon-components/PlusIcon';
import useCourseStore from '../../../store/courseStore';
import useDepartmentStore from '../../../store/departmentStore';

const CourseListPage = () => {
    const { departmentId } = useParams();

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [tableRows, setTableRows] = useState("5");
    const {getAllCourse } = useCourseStore()
    const { getDepartment, department } = useDepartmentStore();
    const [showCacheMessage, setShowCacheMessage] = useState(true);
    const { showToast } = useToastStore();
    const [departmentName, setDepartmentName] = useState<string | null>(null); // State to store department name


    useEffect(() => {
        if (departmentId) {
            getDepartment(departmentId); // Fetch department data by ID
        }
    }, [departmentId]);

    useEffect(() => {
        if (department?.name) {
            setDepartmentName(department.name);
        }
    }, [department]);



    const onRefresh = async () => {
            const res = await getAllCourse();
            if (res) {
                setShowCacheMessage(false);
                showToast("success", "Courses refreshed successfully");
            } else {
                showToast("error", "Failed to refresh Courses");
            }
    };
    return (
        <div className={style.container}>
            {/* <TableControlBox tableName={`${departmentName ? departmentName : ""}Courses`} onRefresh={onRefresh} showCacheMessage={showCacheMessage}> */}
            <TableControlBox tableName={`Courses`} onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
                <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

                <Button onClick={() => navigate(`/courses/create`)} startIcon={<PlusIcon fill="white" />}>
                    Create&nbsp;Course
                </Button>
            </TableControlBox>
            <div className={style.tableContainer}>
                <CourseTableComponent departmentId={departmentId} />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(1)}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
        </div>
    )
}

export default CourseListPage

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
