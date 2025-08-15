import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useDesignationStore, { createDesignationPayloadIF } from '../../../store/designationStore';
import { useEffect } from 'react';

interface PropsIF {
  update?: boolean;
}

const CreateDesignationPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateDesignation, createDesignation, designation, getDesignation, loading } = useDesignationStore();

  useEffect(() => {
    if (!id) return;
    getDesignation(id);
  }, [id]);

  const onSubmit = async (values: createDesignationPayloadIF) => {
    const res = id && update ? await updateDesignation(values, id) : await createDesignation(values);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Designation Form"
      formHeader={`${update ? 'Update' : 'Create'} Designation Form`}
      existingForm={update ? designation : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[]}
      loading={loading}
    />
  );
};

export default CreateDesignationPage;
