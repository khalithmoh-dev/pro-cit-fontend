import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const ModuleListPage = lazy(() => import('../../modules/module/module-list'));
const CreateModulePage = lazy(() => import('../../modules/module/create-module'));

const ModuleRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<ModuleListPage />} />
        <Route path="/create" element={<CreateModulePage />} />
        <Route path="/update/:id" element={<CreateModulePage update />} />
      </Routes>
    </Suspense>
  );
};

export default ModuleRoutes;
