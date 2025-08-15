import { useNavigate } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useInvitedStudentStore, { createInvitePayloadIF } from '../../../store/invitedStudentStore';

const CreateInvitePage: React.FC = () => {
  const navigate = useNavigate();
  const { createInvite, loading } = useInvitedStudentStore();

  const onSubmit = async (values: createInvitePayloadIF) => {
    const res = await createInvite(values);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Invite Form"
      formHeader={`Create Invite Form`}
      existingForm={null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[]}
      small
      loading={loading}
    />
  );
};

export default CreateInvitePage;
