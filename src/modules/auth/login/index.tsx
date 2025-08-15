import Button from '../../../components/button';
import DotLoader from '../../../components/dot-loader';
import FormContainer from '../../../components/form-container';
import TextField from '../../../components/textfield';
import useAuthStore from '../../../store/authStore';
import { LoginFormValuesIF } from '../../../interface';
import { loginValidationSchema } from '../../../validation';
import style from '../layout/layout.module.css';
import { Form, Formik } from 'formik';
import AuthLayout from '../layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, login } = useAuthStore();
  const [email, setEmail] = useState('');

  const initialValues = {
    email: 'vinayak@gmail.com',
    password: 'welcome',
  };

  const onSubmit = async (values: LoginFormValuesIF) => {
    setEmail(values.email);
    const res = await login(values.email, values.password);
    if (res) {
      navigate('/dashboard');
    }
  };

  const redirectToForgotPassword = () => {
    navigate(`/auth/forgot-password/${email ? email : ''}`);
  };

  return (
    <AuthLayout>
      <FormContainer className={style.formContainer} headerText="login">
        <Formik initialValues={initialValues} validationSchema={loginValidationSchema} onSubmit={onSubmit}>
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
                <TextField
                  label="enter password"
                  placeholder="********"
                  type="password"
                  className={style.fieldContainer}
                  {...formik.getFieldProps('password')}
                  error={formik.errors['password'] && formik.touched['password'] ? formik.errors['password'] : ''}
                />
                <div onClick={redirectToForgotPassword} className={style.forgotPasswordText}>
                  Forgot Password?
                </div>
                <Button mt={20} submit large fullWidth className={style.loginButton}>
                  {isLoading ? <DotLoader /> : 'Login'}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </AuthLayout>
  );
};

export default LoginPage;
