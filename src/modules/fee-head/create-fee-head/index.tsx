import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useFeeHeadStore, { createFeeHeadPayloadIF } from '../../../store/feeHeadStore';
import { useEffect } from 'react';

interface PropsIF {
  update?: boolean;
}

const CreateFeeHeadPage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateFeeHead, createFeeHead, feeHead, getFeeHead , loading } = useFeeHeadStore();

  useEffect(() => {
    if (!id) return;
    getFeeHead(id);
  }, [id]);

  const onSubmit = async (values: createFeeHeadPayloadIF) => {
    const res = id && update ? await updateFeeHead(values, id) : await createFeeHead(values);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Fee Head Form"
      formHeader={`${update ? 'Update' : 'Create'} Fee Head Form`}
      existingForm={update ? feeHead : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[]}
      loading={loading}
    />
  );
};

export default CreateFeeHeadPage;
