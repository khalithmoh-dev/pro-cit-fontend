import React, { useEffect } from 'react'
import Table from '../../../../components/table'
import TableHead from '../../../../components/table/tableHead'
import TableBody from '../../../../components/table/tableBody'
import { useNavigate } from 'react-router-dom'
import useCourseStore from '../../../../store/courseStore'
import convertDateFormat from '../../../../utils/functions/convert-date-format'
import RichEditorIcon from '../../../../icon-components/RichEditor'
import DeleteIcon from '../../../../icon-components/DeleteIcon'

const CourseTableComponent = (departmentId: any) => {
    const navigate = useNavigate();
    const {allCourses, deleteCourse , getAllCourse ,  loading} = useCourseStore();
    useEffect(() => {
        
        getAllCourse();
    }, []);

    const deleteHandler = async (id: string) => {
        const res = await deleteCourse(id, departmentId?.departmentId);
        if (res) {
            getAllCourse();
        }
    };

    const tableHead = ["SL NO.","DEPARTMENT NAME", "COURSE NAME", "DURATION (YEAR)", "CREATED AT", "ACTION"];

    const tableBody = allCourses.map((course, index) => (        
        <tr key={index}>
            <td>{index + 1}</td>
            <td style={{ textTransform: "capitalize" }}>{course.department_id?.name}</td>
            <td style={{ textTransform: "capitalize" }}>{course.course_name}</td>
            <td>{course.duration}</td>
            <td>{convertDateFormat(course.createdAt)}</td>
            <td style={{ cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={() => navigate(`/courses/update/${course._id}`)}>
                    <RichEditorIcon />
                </span>
                <span onClick={() => deleteHandler(course._id)}>
                    <DeleteIcon />
                </span>
            </td>
        </tr>
    ));
    return (
        <div>
            <Table loading={loading}>
                <TableHead tableHead={tableHead} />
                <TableBody tableBody={tableBody} />
            </Table>
        </div>
    )
}

export default CourseTableComponent