import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// const DegreeListPage = lazy(() => import('../../modules/basic-config/Institute-config/list'));
const ManageInstitute = lazy(() => import('../../modules/basic-config/Institute-config/form'));

const InstituteRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* <Route path="/list" element={<DegreeListPage />} /> */}
        <Route path="/form" element={<ManageInstitute />} />
      </Routes>
    </Suspense>
  );
};

export default InstituteRoutes;