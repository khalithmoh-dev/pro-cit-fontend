import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useDepartmentStore, { createDepartmentPayloadIF } from '../../../store/departmentStore';
import { useEffect } from 'react';

interface PropsIF {
  update?: boolean;
}

const CreateDepartmentPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateDepartment, createDepartment, department, getDepartment, loading } = useDepartmentStore();

  useEffect(() => {
    if (!id) return;
    getDepartment(id);
  }, [id]);

  const onSubmit = async (values: createDepartmentPayloadIF) => {
    values.totalSemesters = Number(values.totalSemesters);
    const res = id && update ? await updateDepartment(values, id) : await createDepartment(values);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Department Form"
      formHeader={`${update ? 'Update' : 'Create'} Department Form`}
      existingForm={update ? department : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[]}
      loading={loading}
    />
  );
};

export default CreateDepartmentPage;
