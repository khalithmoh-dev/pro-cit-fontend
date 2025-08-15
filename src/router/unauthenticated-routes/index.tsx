import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageLoader from '../../components/page-loader';
import Layout from '../../modules/layout';

const RegisterStudentPage = lazy(() => import('../../modules/admission/invited-student-form'));
const AuthRoutes = lazy(() => import('./AuthRoutes'));

const UnauthenticatedRoutes = () => {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admission/student/update/:id" element={<RegisterStudentPage update />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default UnauthenticatedRoutes;
