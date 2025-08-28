import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const DegreeListPage = lazy(() => import('../../modules/degree/degree-list'));
const CreateDegreePage = lazy(() => import('../../modules/degree/create-degree'));

const DegreeRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<DegreeListPage />} />
        <Route path="/create" element={<CreateDegreePage />} />
      </Routes>
    </Suspense>
  );
};

export default DegreeRoutes;