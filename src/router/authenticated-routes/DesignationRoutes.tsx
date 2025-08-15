import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const DesignationListPage = lazy(() => import('../../modules/designation/designation-list'));
const CreateDesignationPage = lazy(() => import('../../modules/designation/create-designation'));

const DesignationRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<DesignationListPage />} />
        <Route path="/create" element={<CreateDesignationPage />} />
        <Route path="/update/:id" element={<CreateDesignationPage update />} />
      </Routes>
    </Suspense>
  );
};

export default DesignationRoutes;
