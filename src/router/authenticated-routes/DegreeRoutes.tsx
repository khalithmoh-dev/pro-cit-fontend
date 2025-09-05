import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// const InstiteConfig = lazy(() => import('../../modules/basic-config/Institute-config/form'));
const CreateDegreePage = lazy(() => import('../../modules/degree/create-degree'));
const DegreeListPage = lazy(() => import('../../modules/degree/degree-list'));

const DegreeRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<DegreeListPage />} />
        {/* <Route path="/list" element={<InstiteConfig />} /> */}
        <Route path="/create" element={<CreateDegreePage />} />
      </Routes>
    </Suspense>
  );
};

export default DegreeRoutes;