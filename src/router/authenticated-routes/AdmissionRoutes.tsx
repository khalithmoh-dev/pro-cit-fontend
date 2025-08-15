import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const CreateInvitePage = lazy(() => import('../../modules/admission/create-invite'));
const RegisterStudentPage = lazy(() => import('../../modules/admission/invited-student-form'));
const InvitedStudentListPage = lazy(() => import('../../modules/admission/Invited-student-list'));
const ViewInvitedStudentPage = lazy(() => import('../../modules/admission/view-student'));
const ApproveInvitedStudentPage = lazy(() => import('../../modules/admission/approve-student'));

const AdmissionRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/invite" element={<CreateInvitePage />} />
        <Route path="/register" element={<RegisterStudentPage />} />
        <Route path="/student/list" element={<InvitedStudentListPage />} />
        <Route path="/student/update/:id" element={<RegisterStudentPage update />} />
        <Route path="/student/details/:id" element={<ViewInvitedStudentPage />} />
        <Route path="/student/approve/:id" element={<ApproveInvitedStudentPage />} />
      </Routes>
    </Suspense>
  );
};

export default AdmissionRoutes;
