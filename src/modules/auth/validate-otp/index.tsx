import Button from '../../../components/button';
import DotLoader from '../../../components/dot-loader';
import FormContainer from '../../../components/form-container';
import TextField from '../../../components/textfield';
import useAuthStore from '../../../store/authStore';
import AuthLayout from '../layout';
import { verifyOtpValidationSchema } from '../schema';
import style from './validate-otp.module.css';
import { Form, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';

export interface ValidateOtpFormValuesIF {
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

const ValidateOtpPage: React.FC = () => {
  const { isLoading, validateOtp } = useAuthStore();
  const navigate = useNavigate();
  const { email } = useParams();

  const initialValues = {
    verificationCode: '',
    password: '',
    confirmPassword: '',
  };
  const onSubmit = async (values: ValidateOtpFormValuesIF) => {
    const payload = {
      email: email || '',
      verificationCode: values.verificationCode,
      password: values.confirmPassword,
    };
    const res = await validateOtp(payload);
    if (res) {
      navigate(`/login`);
    }
  };

  return (
    <AuthLayout>
      <FormContainer className={style.formContainer} headerText="Validate OTP">
        <Formik initialValues={initialValues} validationSchema={verifyOtpValidationSchema} onSubmit={onSubmit}>
          {(formik) => {
            return (
              <Form>
                <TextField
                  label="enter verificationCode"
                  placeholder="****"
                  className={style.fieldContainer}
                  {...formik.getFieldProps('verificationCode')}
                  error={
                    formik.errors['verificationCode'] && formik.touched['verificationCode']
                      ? formik.errors['verificationCode']
                      : ''
                  }
                />
                <TextField
                  label="enter password"
                  placeholder="********"
                  type="password"
                  className={style.fieldContainer}
                  {...formik.getFieldProps('password')}
                  error={formik.errors['password'] && formik.touched['password'] ? formik.errors['password'] : ''}
                />
                <TextField
                  label="confirm Password"
                  placeholder="********"
                  type="confirmPassword"
                  className={style.fieldContainer}
                  {...formik.getFieldProps('confirmPassword')}
                  error={
                    formik.errors['confirmPassword'] && formik.touched['confirmPassword']
                      ? formik.errors['confirmPassword']
                      : ''
                  }
                />
                <Button mt={20} submit large fullWidth className={style.loginButton}>
                  {isLoading ? <DotLoader /> : 'Validate Verification Code'}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </AuthLayout>
  );
};

export default ValidateOtpPage;
