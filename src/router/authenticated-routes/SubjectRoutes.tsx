import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const SubjectListPage = lazy(() => import('../../modules/subject/subject-list'));
const CreateSubjectPage = lazy(() => import('../../modules/subject/create-subject'));

const SubjectRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SubjectListPage />} />
        <Route path="/create" element={<CreateSubjectPage />} />
        <Route path="/update/:id" element={<CreateSubjectPage update />} />
      </Routes>
    </Suspense>
  );
};

export default SubjectRoutes;
