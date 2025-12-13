import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// Lazy-loaded components for CourseScheduleRoutes
const CourseSchedulePage = lazy(() => import('../../modules/enterprise/course-schedule'));

const CourseScheduleRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/form" element={<CourseSchedulePage />} />
      </Routes>
    </Suspense>
  );
};

export default CourseScheduleRoutes;
