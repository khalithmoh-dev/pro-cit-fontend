import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

// Lazy-loaded components for DepartmentRoutes
const DepartmentListPage = lazy(() => import('../../modules/department/department-list'));
const CreateDepartment = lazy(() => import('../../modules/department/create-department'));

const DepartmentRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<DepartmentListPage />} />
        <Route path="/create" element={<CreateDepartment />} />
        <Route path="/update/:id" element={<CreateDepartment update />} />
      </Routes>
    </Suspense>
  );
};

export default DepartmentRoutes;
