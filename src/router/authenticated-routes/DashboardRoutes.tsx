import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const DashboardPage = lazy(() => import('../../modules/dashboard'));

const DashboardRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Suspense>
  );
};

export default DashboardRoutes;
