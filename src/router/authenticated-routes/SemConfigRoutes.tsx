import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const SemConfigList = lazy(() => import('../../modules/enterprise/semester-config/list'));

const SemConfigRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SemConfigList />} />
      </Routes>
    </Suspense>
  );
};

export default SemConfigRoutes;