import Button from '../../../components/button';
import DotLoader from '../../../components/dot-loader';
import FormContainer from '../../../components/form-container';
import TextField from '../../../components/textfield';
import useAuthStore from '../../../store/authStore';
import AuthLayout from '../layout';
import { forgotPasswordValidationSchema } from '../schema';

import style from './forgot-password.module.css';
import { Form, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

export interface ForgotPasswordFormValuesIF {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { isLoading, forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  const { email } = useParams();

  const initialValues = {
    email: email || '',
  };
  const onSubmit = async (values: ForgotPasswordFormValuesIF) => {
    const res = await forgotPassword(values.email);
    if (res) {
      navigate(`/auth/validate-otp/${values.email}`);
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <FormContainer className={style.formContainer} headerText="Forgot Password">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <TextField
                  label="enter email"
                  placeholder="eg - john@email.com"
                  className={style.fieldContainer}
                  {...formik.getFieldProps('email')}
                  error={formik.errors['email'] && formik.touched['email'] ? formik.errors['email'] : ''}
                />
                <div onClick={redirectToLogin} className={style.forgotPasswordText}>
                  Login?
                </div>
                <Button mt={20} submit large fullWidth className={style.loginButton}>
                  {isLoading ? <DotLoader /> : 'Get Verification Code'}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
