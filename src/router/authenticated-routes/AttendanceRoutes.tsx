import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
import DashboardPage from '../../modules/dashboard';
import UpdateAttendancePage from '../../modules/attendence/update-attendance';

const AttendanceListPage = lazy(() => import('../../modules/attendence/attendence-list'));
const MarkAttendancePage = lazy(() => import('../../modules/attendence/mark-attendance'));
const ViewAttendancePage = lazy(() => import('../../modules/attendence/view-attendance'));

const AttendanceRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/mark/:id" element={<MarkAttendancePage />} />
        <Route path="/update/:id" element={<UpdateAttendancePage />} />
        <Route path="/list" element={<AttendanceListPage />} />
        <Route path="/list/:id" element={<AttendanceListPage />} />
        <Route path="/view/:id" element={<ViewAttendancePage />} />
      </Routes>
    </Suspense>
  );
};

export default AttendanceRoutes;
