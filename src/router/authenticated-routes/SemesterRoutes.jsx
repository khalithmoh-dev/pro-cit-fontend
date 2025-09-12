import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// const InstiteConfig = lazy(() => import('../../modules/basic-config/Institute-config/form'));
const CreateSemesterPage = lazy(() => import('../../modules/semester/create-semester'));
const SemesterListPage = lazy(() => import('../../modules/semester/list-semester'));


const SemesterRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SemesterListPage />} />
        <Route path="/create" element={<CreateSemesterPage />} />
        <Route path="/update/:id" element={<CreateSemesterPage />} />
      </Routes>
    </Suspense>
  );
};

export default SemesterRoutes;



