import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
import ProtectedRoute from './ProtectedRoute';

const CreateProgramPage = lazy(() => import('../../modules/program/create-program'));
const ProgramListPage = lazy(() => import('../../modules/program/program-list'));

const ProgramRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={
          // <ProtectedRoute permissionType="view">
            <ProgramListPage />
          // </ProtectedRoute>
        } />
        <Route path="/form/:id?" element={
          // <ProtectedRoute permissionType="update">
            <CreateProgramPage />
          // </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  );
};

export default ProgramRoutes;