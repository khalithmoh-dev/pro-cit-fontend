import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const EmployeeListPage = lazy(() => import('../../modules/employee/employee-list'));
const CreateEmployeePage = lazy(() => import('../../modules/employee/create-employee'));

const EmployeeRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<EmployeeListPage />} />
        <Route path="/create" element={<CreateEmployeePage />} />
        <Route path="/update/:id" element={<CreateEmployeePage update />} />
      </Routes>
    </Suspense>
  );
};

export default EmployeeRoutes;
