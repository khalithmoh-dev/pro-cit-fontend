import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const AcademicYearForm = lazy(() => import('../../modules/enterprise/academic-year/form'));
const AcademicYearList = lazy(() => import('../../modules/enterprise/academic-year/list'));

const AcademicYearRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<AcademicYearList />} />
        <Route path="/form/:id?" element={<AcademicYearForm />} />
      </Routes>
    </Suspense>
  );
};

export default AcademicYearRoutes;