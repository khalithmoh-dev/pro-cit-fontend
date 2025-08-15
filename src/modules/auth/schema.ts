import * as Yup from 'yup';
export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Please enter valid email').max(255).required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email('Please enter valid email').max(255).required('email is required'),
});
export const verifyOtpValidationSchema = Yup.object({
  verificationCode: Yup.string().required('OTP is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], "Confirm password didn't match")
    .required('Confirm password is required'),
});
