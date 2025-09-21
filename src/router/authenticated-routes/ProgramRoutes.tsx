import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
 
const CreateProgramPage = lazy(() => import('../../modules/program/create-program'));
const ProgramListPage = lazy(() => import('../../modules/program/program-list'));

const ProgramRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<ProgramListPage />} />
        <Route path="/create" element={<CreateProgramPage />} />
        <Route path="/update/:id" element={<CreateProgramPage />} />
      </Routes>
    </Suspense>
  );
};

export default ProgramRoutes;