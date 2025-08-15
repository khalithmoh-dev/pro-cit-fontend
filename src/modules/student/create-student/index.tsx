import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useStudentStore, { createStudentPayloadIF } from '../../../store/studentStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import { semesterSampleList } from '../../../utils/static-data';

interface PropsIF {
  update?: boolean;
}

const CreateStudentPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { updateStudent, createStudent, student, getStudent, loading } = useStudentStore();

  useEffect(() => {
    if (id) getStudent(id);
    if (!departmentOptions.length) getDepartments();
  }, [id]);

  const onSubmit = async (values: createStudentPayloadIF) => {
    if (values.permanentSameAsPresent) values.permanentAddress = values.presentAddress;

    values.semester = values.admissionSemester;

    const res = id && update ? await updateStudent(values, id) : await createStudent(values);
    if (res) {
      navigate(-1);
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
      formName="Create Student Form"
      formHeader={`${update ? 'Update' : 'Create'} Student Form`}
      existingForm={update ? student : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[departmentOptions, semesterSampleList]}
      onChange={onChangeInputHandler}
      extraLarge
      update={update}
      loading={loading}
    />
  );
};

export default CreateStudentPage;
