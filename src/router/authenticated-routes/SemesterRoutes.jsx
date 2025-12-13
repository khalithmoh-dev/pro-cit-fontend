import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// const InstiteConfig = lazy(() => import('../../modules/enterprise/institute/form'));
const CreateSemesterPage = lazy(() => import('../../modules/enterprise/semester/create-semester'));
const SemesterListPage = lazy(() => import('../../modules/enterprise/semester/list-semester'));


const SemesterRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SemesterListPage />} />
        <Route path="/form/:id?" element={<CreateSemesterPage />} />
      </Routes>
    </Suspense>
  );
};

export default SemesterRoutes;



