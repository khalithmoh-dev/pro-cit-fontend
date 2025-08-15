import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const TimeTableListPage = lazy(() => import('../../modules/time-table/time-table-list'));

const TimeTableRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<TimeTableListPage />} />
      </Routes>
    </Suspense>
  );
};

export default TimeTableRoutes;
