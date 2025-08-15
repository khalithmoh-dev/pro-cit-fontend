import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const LoginPage = lazy(() => import('../../modules/auth/login'));
const ForgotPasswordPage = lazy(() => import('../../modules/auth/forgot-password'));
const ValidateOtpPage = lazy(() => import('../../modules/auth/validate-otp'));

const AuthRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/:email" element={<ForgotPasswordPage />} />
        <Route path="/validate-otp/:email" element={<ValidateOtpPage />} />
        <Route path="/*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
