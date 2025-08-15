import React, { useEffect, useState } from "react";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import useDiscountStore, { createDiscountPayloadIF } from "../../../store/discountCategoryStore";
import { useNavigate, useParams } from "react-router-dom";
import useDepartmentStore from "../../../store/departmentStore";
import useCategoriesStore from "../../../store/categoriesStore";
import useStudentStore from "../../../store/studentStore";
import useCourseStore from "../../../store/courseStore";
import { FieldIF, SelectOptionIF } from "../../../interface/component.interface";

interface PropsIF {
  update?: boolean;
}

const CreateDiscountCategoryPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departments } = useDepartmentStore();
  const { getAllCategories, categories } = useCategoriesStore();
  const { getStudents, studentOptions } = useStudentStore();
  const { courses, getCourses } = useCourseStore();

  const {
    updateDiscount,
    createDiscount,
    discountStructure,
    getDiscount,
    loading,
  } = useDiscountStore();

  useEffect(() => {
    if (!id) return;
    getDiscount(id);
  }, [id]);



  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const [courseOptions, setCourseOptions] = useState<SelectOptionIF[]>([]);



  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    if (selectedDepartment) {
      getCourses(selectedDepartment);
    }
  }, [selectedDepartment, getCourses]);

  useEffect(() => {
    if (courses) {
      const updatedCourseOptions = courses.map((course) => ({
        label: course.course_name,
        value: course._id,
      }));
      setCourseOptions(updatedCourseOptions);
    }
  }, [courses]);

  const onSubmit = async (values: createDiscountPayloadIF) => {
    const updatedValues: any = {
      ...values,
      eligible_students: Array.isArray(values.eligible_students)
        ? values.eligible_students.map((student: any) => student)
        : [],
      value: Number(values?.value)

    };
    const res =
      id && update
        ? await updateDiscount(updatedValues, id)
        : await createDiscount(updatedValues);
    if (res) {
      navigate(-1);
    }
  };

  const departmentOptions: SelectOptionIF[] = departments.map((dep) => ({
    label: dep.departmentCode,
    value: dep._id,
  }));

  const categoriesOptions: SelectOptionIF[] = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  // Handle department change in the form and trigger course fetch
  const handleDepartmentChange = (fields: FieldIF[]) => {
    const departmentField = fields.find(
      (field) => field.keyName === "applicable_department_id"
    );

    if (departmentField && departmentField.value) {
      setSelectedDepartment(departmentField.value);
    }

  };


  return (
    <RenderFormbuilderForm
      formName="Create Discount Form"
      formHeader={`${update ? "Update" : "Create"} Discount Form`}
      existingForm={update ? discountStructure : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      onChange={handleDepartmentChange}
      dynamicOptions={[departmentOptions, courseOptions, categoriesOptions, studentOptions]}
      loading={loading}
      large
    />
  );
};

export default CreateDiscountCategoryPage;
