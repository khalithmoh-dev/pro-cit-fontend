import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const CalendarComponent = lazy(() => import('../../modules/calendar'));

const CalendarRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/view" element={<CalendarComponent />} />
        <Route path="/view/:id" element={<CalendarComponent />} />
      </Routes>
    </Suspense>
  );
};

export default CalendarRoutes;
