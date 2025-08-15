import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useSubjectStore, { createSubjectPayloadIF } from '../../../store/subjectStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import { semesterSampleList } from '../../../utils/static-data';

interface PropsIF {
  update?: boolean;
}

const CreateSubjectPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departments, departmentOptions } = useDepartmentStore();
  const { updateSubject, createSubject, subject, getSubject, loading } = useSubjectStore();
  const [semesterList, setSemesterList] = useState<SelectOptionIF[]>([]);

  useEffect(() => {
    if (!id) return;
    getSubject(id);
  }, [id]);

  useEffect(() => {
    if (departmentOptions.length) return;
    getDepartments();
  }, []);

  const onSubmit = async (values: createSubjectPayloadIF) => {
    const res = id && update ? await updateSubject(values, id) : await createSubject(values);
    if (res) {
      navigate(-1);
    }
  };
  const onChangeInputHandler = (fields: FieldIF[]) => {
    if (!fields[5].value) return;
    let totalSemesters = 0;
    departments?.forEach((field) => {
      if (field._id === fields[5].value) {
        totalSemesters = field.totalSemesters;
        if (fields[6].value > field.totalSemesters) {
          fields[6].value = 0;
        }
      }
    });
    const generatedSemesterList = (totalSemesters: number) => {
      const filteredArray = semesterSampleList.filter((item) => Number(item.value) <= totalSemesters);
      setSemesterList(filteredArray);
    };
    generatedSemesterList(totalSemesters);
  };
  return (
    <RenderFormbuilderForm
      formName="Create Subject Form"
      formHeader={`${update ? 'Update' : 'Create'} Subject Form`}
      existingForm={update ? subject : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[departmentOptions, semesterList]}
      onChange={onChangeInputHandler}
      large
      loading={loading}
    />
  );
};

export default CreateSubjectPage;
