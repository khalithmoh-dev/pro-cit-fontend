import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import { useEffect, useState } from "react";
import useFeeCategoryStore, {
  createFeeStructuresPayloadIF,
} from "../../../store/feeCategoryStore";
import useDepartmentStore from "../../../store/departmentStore";
import useCourseStore from "../../../store/courseStore";
import {
  FieldIF,
  SelectOptionIF,
} from "../../../interface/component.interface";
import useStudentStore from "../../../store/studentStore";
import useCategoriesStore from "../../../store/categoriesStore";

interface PropsIF {
  update?: boolean;
}

const CreateFeeStructuresPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getDepartments, departments } = useDepartmentStore();
  const { getAllCategories, categories } = useCategoriesStore();

  const {
    updateFeeStructures,
    createFeeStructures,
    feeStructure,
    getFeeStructure,
    loading
  } = useFeeCategoryStore();

  const { getStudents, studentOptionsDepartment, getStudentsByDepartment } = useStudentStore();
  const { courses, getCourses } = useCourseStore();


  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [courseYear, setCourseYear] = useState<string | null>(
    null
  );
  const [courseOptions, setCourseOptions] = useState<SelectOptionIF[]>([]);
  const departmentIDFee = selectedDepartment ? selectedDepartment : feeStructure?.department_id?._id
  const courseYearFee = courseYear ? courseYear : feeStructure?.course_year

  useEffect(() => {
    if (!departmentIDFee) return;
    getStudentsByDepartment({ department_id: departmentIDFee, year: courseYearFee });
  }, [selectedDepartment, courseYear, departmentIDFee, courseYearFee, feeStructure]);

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    if (!id) return;

    getFeeStructure(id);
    const fetchFeeStructure = async () => {

      if (feeStructure?.department_id) {
        getCourses(feeStructure?.department_id?._id);
      }

    };

    fetchFeeStructure();
  }, [id, getFeeStructure, getCourses, departmentIDFee]);

  useEffect(() => {
    if (feeStructure) {
      setSelectedDepartment(feeStructure?.department_id?._id);
    }
  }, [feeStructure])

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

  const onSubmit = async (values: createFeeStructuresPayloadIF) => {
    console.log(
      "value---student_id",
      Array.isArray(values.eligible_students)
        ? values.eligible_students.map((student: any) => student)
        : []
    );

    const createValuesPayload: any = {
      ...values,
      fees: values.fees.map((fee) => ({
        ...fee,
        amount: parseInt(fee.amount),
      })),
      course_year: parseInt(values?.course_year),
      eligible_students: Array.isArray(values.eligible_students)
        ? values.eligible_students.map((student: any) => student)
        : [],
      fee_structure_name: values?.fee_structure_name,

    };
    const updatedValues: any = {
      ...values,
      fees: values.fees.map((fee) => ({
        ...fee,
        amount: parseInt(fee.amount),
      })),
      course_year: parseInt(values?.course_year),
      eligible_students: Array.isArray(values.eligible_students)
        ? values.eligible_students.map((student: any) => student)
        : [],
      fee_structure_name: values?.fee_structure_name,
      course_id: values?.course_id?._id || values?.course_id,
      department_id: values?.department_id?._id || values?.department_id,

    };

    const res =
      id && update
        ? await updateFeeStructures(updatedValues, id)
        : await createFeeStructures(createValuesPayload);

    if (res) {
      navigate(-1);
    }
  };

  // Create department options for dropdown
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
      (field) => field.keyName === "department_id"
    );
    const courseYear = fields?.find(
      (field) => field.keyName === "course_year"
    )

    if (departmentField && departmentField.value) {
      setSelectedDepartment(departmentField.value);
    }
    if (courseYear && courseYear.value) {
      setCourseYear(courseYear.value);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Fee Form"
      formHeader={`${update ? "Update" : "Create"} Fee Form`}
      existingForm={update ? feeStructure : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      onChange={handleDepartmentChange}
      large
      dynamicOptions={[departmentOptions, courseOptions, studentOptionsDepartment, categoriesOptions]}
      loading={loading}
    />
  );
};

export default CreateFeeStructuresPage;
