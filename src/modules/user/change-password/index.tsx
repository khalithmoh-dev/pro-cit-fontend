import { useNavigate } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useAuthStore from '../../../store/authStore';
import { useToastStore } from '../../../store/toastStore';

interface SubmitValuesIF {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword, isLoading } = useAuthStore();

  const onSubmit = async (values: SubmitValuesIF) => {
    if (values.newPassword !== values.confirmPassword) {
      useToastStore.getState().showToast('error', 'New Password and Confirm Password should be the same');
      return;
    }
    const res = await changePassword(values.oldPassword, values.newPassword);
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Change Password Form"
      formHeader="Change Password"
      existingForm={null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[]}
      loading={isLoading}
      small
    />
  );
};

export default ChangePasswordPage;
