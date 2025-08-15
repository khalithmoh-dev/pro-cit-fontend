import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useCourseStore, { courseIF, createCoursePayloadIF } from '../../../store/courseStore';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF } from '../../../interface/component.interface';

interface PropsIF {
    update?: boolean;
}

const CreateCoursePage: React.FC<PropsIF> = ({ update }) => {
    const { departmentId, id }: any = useParams(); // Get departmentId and course id from URL params
    const navigate = useNavigate();

    const { getCourse, updateCourse, createCourse, course , loading } = useCourseStore(); // Course-related store actions
    const { getDepartment,getDepartments, department , departmentOptions } = useDepartmentStore(); // Department-related store actions
    const [departmentName, setDepartmentName] = useState<string | null>(null); // State to store department name
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        null
      );
    // Fetch course by ID if updating
    useEffect(() => {
        if (id) {
            getCourse(id);
        }
    }, [id]);
    
    useEffect(() => {
        getDepartments();
      }, [getDepartments]);
    // Fetch department by departmentId from URL
    useEffect(() => {
        if (selectedDepartment) {
            getDepartment(selectedDepartment); // Fetch department data by ID
        }
    }, [selectedDepartment]);

    // Set department name when department data is fetched
    useEffect(() => {
        if (department?.name) {
            setDepartmentName(department.name);
        }
    }, [department]);

    // Submit form and include departmentId in the payload
    const onSubmit = async (values: createCoursePayloadIF) => {
        // Ensure duration is an integer
        const parsedValues = {
            ...values,
            duration: parseInt(values.duration as unknown as string, 10),
            department_id: (selectedDepartment || course?.department_id) || "",
        };

        const res = id && update
            ? await updateCourse(parsedValues, id, departmentId) // If updating, send PUT request
            : await createCourse(parsedValues, departmentId); // If creating, send POST request

        if (res) {
            navigate(-1); // Navigate back if successful
        }
    };

    const handleDepartmentChange = (fields: FieldIF[]) => {        
        const departmentField = fields.find(
          (field) => field.keyName === "department_id"
        );
    
        if (departmentField && departmentField.value) {
          setSelectedDepartment(departmentField.value);
        }
      
      };


    return (
        <RenderFormbuilderForm
            formName="Create Course Form"
            formHeader={`${update ? "Update" : "Create"} Course Form`}
            existingForm={update
                ? course 
                : ""}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            onChange={handleDepartmentChange}
            dynamicOptions={[ departmentOptions ]}
            large
            loading={loading}
        />
    );
};

export default CreateCoursePage;
