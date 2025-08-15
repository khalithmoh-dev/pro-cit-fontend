import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const StudentListPage = lazy(() => import('../../modules/student/student-list'));
const CreateStudentPage = lazy(() => import('../../modules/student/create-student'));
const ViewStudentPage = lazy(() => import('../../modules/student/view-student'));

const StudentRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<StudentListPage />} />
        <Route path="/create" element={<CreateStudentPage />} />
        <Route path="/update/:id" element={<CreateStudentPage update />} />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
