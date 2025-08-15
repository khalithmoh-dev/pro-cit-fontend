import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const GroupListPage = lazy(() => import('../../modules/group/group-list'));
const CreateGroupPage = lazy(() => import('../../modules/group/create-group'));
const UpdateGroupPage = lazy(() => import('../../modules/group/update-group'));

const GroupRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<GroupListPage />} />
        <Route path="/create" element={<CreateGroupPage />} />
        <Route path="/update/:id" element={<UpdateGroupPage />} />
      </Routes>
    </Suspense>
  );
};

export default GroupRoutes;
