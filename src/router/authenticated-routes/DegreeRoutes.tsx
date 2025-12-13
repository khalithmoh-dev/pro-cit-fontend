import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const CreateDegreePage = lazy(() => import('../../modules/enterprise/degree/create-degree'));
const DegreeListPage = lazy(() => import('../../modules/enterprise/degree/degree-list'));

const DegreeRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<DegreeListPage />} />
        <Route path="/form/:id?" element={<CreateDegreePage />} />
      </Routes>
    </Suspense>
  );
};

export default DegreeRoutes;