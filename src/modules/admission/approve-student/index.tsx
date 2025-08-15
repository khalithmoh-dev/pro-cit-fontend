import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useStudentStore, { createStudentPayloadIF } from '../../../store/studentStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useInvitedStudentStore from '../../../store/invitedStudentStore';

const ApproveInvitedStudentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departments } = useDepartmentStore();
  const { createStudent } = useStudentStore();
  const { invitedStudent, getInvitedStudent, deleteInvitedStudent } = useInvitedStudentStore();
  const [departmentList, setDepartmentList] = useState<SelectOptionIF[]>([]);

  useEffect(() => {
    if (!id) return;
    getInvitedStudent(id);
  }, [id]);

  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    if (departments.length === 0) return;
    const options = departments.map((department) => {
      return {
        label: department.name,
        value: department._id,
      };
    });
    setDepartmentList(options);
  }, [departments]);

  const onSubmit = async (values: createStudentPayloadIF) => {
    if (values.permanentSameAsPresent) values.permanentAddress = values.presentAddress;

    values.semester = values.admissionSemester;

    const res = await createStudent(values);
    if (res) {
      if (id) await deleteInvitedStudent(id);
      navigate('/admission/student/list');
    }
  };
  const onChangeInputHandler = (fields: FieldIF[]) => {
    // ============ Address Hide Logic =============
    const permanentSameAsPresentField = fields.filter((field) => field.keyName === 'permanentSameAsPresent');
    const permanentAddressField = fields.filter((field) => field.keyName === 'permanentAddress');
    permanentAddressField[0].hide = permanentSameAsPresentField[0].value;
    // =============================================

    // ============ Previous Education Hide Logic =============
    const previousEducationField = fields.filter((field) => field.keyName === 'previousEducation');
    const diplomaMarksField = fields.filter((field) => field.keyName === 'diplomaMarks');
    const puOr12thMarksField = fields.filter((field) => field.keyName === 'puOr12thMarks');
    if (previousEducationField[0].value === 'Diploma') {
      diplomaMarksField[0].hide = false;
      puOr12thMarksField[0].hide = true;
    } else if (previousEducationField[0].value === 'PUC/12th') {
      diplomaMarksField[0].hide = true;
      puOr12thMarksField[0].hide = false;
    }
    // =============================================
  };

  return (
    <RenderFormbuilderForm
      formName="Create Student Form"
      formHeader={`Approve Student Form`}
      existingForm={invitedStudent}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[departmentList, semesterSampleList]}
      onChange={onChangeInputHandler}
      extraLarge
      update={true}
    />
  );
};

export default ApproveInvitedStudentPage;

const semesterSampleList = [
  {
    label: '1st Semester',
    value: '1',
  },
  {
    label: '2nd Semester',
    value: '2',
  },
  {
    label: '3rd Semester',
    value: '3',
  },
  {
    label: '4th Semester',
    value: '4',
  },
  {
    label: '5th Semester',
    value: '5',
  },
  {
    label: '6th Semester',
    value: '6',
  },
  {
    label: '7th Semester',
    value: '7',
  },
  {
    label: '8th Semester',
    value: '8',
  },
];
