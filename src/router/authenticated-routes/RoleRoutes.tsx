import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const RoleListPage = lazy(() => import('../../modules/role/role-list'));
const CreateRole = lazy(() => import('../../modules/role/create-role'));

const RoleRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<RoleListPage />} />
        <Route path="/create" element={<CreateRole />} />
        <Route path="/update/:id" element={<CreateRole update />} />
      </Routes>
    </Suspense>
  );
};

export default RoleRoutes;
