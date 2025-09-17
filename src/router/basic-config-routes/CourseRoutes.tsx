import React, { Suspense, lazy } from 'react';
import { Routes, Route, } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
const CourseForm = lazy(() => import('../../modules/basic-config/course-config/CourseForm/index'));
const CourseList = lazy(() => import('../../modules/basic-config/course-config/list/index'));

const CourseRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/form/:id?" element={<CourseForm />} />
        <Route path="/list" element={<CourseList />} />
      </Routes>
    </Suspense>
  );
};

export default CourseRoutes;
