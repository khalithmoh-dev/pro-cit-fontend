import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import { useToastStore } from '../../../store/toastStore';
import useInvitedStudentStore, { createInvitedStudentPayloadIF } from '../../../store/invitedStudentStore';
import { semesterSampleList } from '../../../utils/static-data';

interface PropsIF {
  update?: boolean;
}

const RegisterStudentPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { updateInvitedStudent, invitedStudent, getInvitedStudent, loading } = useInvitedStudentStore();
  const [departmentList, setDepartmentList] = useState<SelectOptionIF[]>([]);
  const { showToast } = useToastStore();

  useEffect(() => {
    if (id) getInvitedStudent(id);
    if (!departmentOptions.length) getDepartments();
  }, [id]);

  const onSubmit = async (values: createInvitedStudentPayloadIF) => {
    if (values.permanentSameAsPresent) values.permanentAddress = values.presentAddress;

    values.semester = values.admissionSemester;
    if (!invitedStudent?.email) {
      showToast('error', 'Invalid email address');
      return;
    }
    if (update) values.email = invitedStudent?.email;

    const res = id && update ? await updateInvitedStudent(values, id) : null;
    if (res) {
      navigate('/login');
    }
  };
  const onChangeInputHandler = (fields: FieldIF[]) => {
    // ============ Address Hide Logic =============
    const permanentSameAsPresentField = fields.filter((field) => field.keyName === 'permanentSameAsPresent');
    const permanentAddressField = fields.filter((field) => field.keyName === 'permanentAddress');
    permanentAddressField[0].hide = permanentSameAsPresentField[0].value;
    permanentAddressField[0].settings[0].value = !permanentSameAsPresentField[0].value;
    // =============================================

    // ============ Previous Education Hide Logic =============
    const previousEducationField = fields.filter((field) => field.keyName === 'previousEducation');
    const diplomaMarksField = fields.filter((field) => field.keyName === 'diplomaMarks');
    const puOr12thMarksField = fields.filter((field) => field.keyName === 'puOr12thMarks');
    if (previousEducationField[0].value === 'Diploma') {
      diplomaMarksField[0].hide = false;
      diplomaMarksField[0].settings[0].value = true;
      puOr12thMarksField[0].settings[0].value = false;
      puOr12thMarksField[0].hide = true;
    } else if (previousEducationField[0].value === 'PUC/12th') {
      diplomaMarksField[0].hide = true;
      puOr12thMarksField[0].hide = false;
      puOr12thMarksField[0].settings[0].value = true;
      diplomaMarksField[0].settings[0].value = false;
    }

    // =============================================
  };

  return (
    <RenderFormbuilderForm
      formName="Invited Student Form"
      formHeader={`Student Application`}
      existingForm={update ? invitedStudent : null}
      goBack={() => navigate('/login')}
      onSubmit={onSubmit}
      dynamicOptions={[departmentOptions, semesterSampleList]}
      onChange={onChangeInputHandler}
      extraLarge
      update={update}
      loading={loading}
    />
  );
};

export default RegisterStudentPage;
