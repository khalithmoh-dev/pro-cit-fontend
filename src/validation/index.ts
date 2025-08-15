import * as Yup from 'yup';
export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Please enter valid email').max(255).required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email('Please enter valid email').max(255).required('email is required'),
});
export const verifyOtpValidationSchema = Yup.object({
  otp: Yup.number().required('OTP is required'),
});
