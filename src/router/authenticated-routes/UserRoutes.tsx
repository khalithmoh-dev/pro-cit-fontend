import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const ChangePasswordPage = lazy(() => import('../../modules/user/change-password'));

const GroupRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </Suspense>
  );
};

export default GroupRoutes;
