import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const FormListPage = lazy(() => import('../../modules/form-builder/form-list'));
const CreateFormPage = lazy(() => import('../../modules/form-builder/create-form'));

const FormbuilderRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<FormListPage />} />
        <Route path="/create" element={<CreateFormPage />} />
        <Route path="/update/:formId" element={<CreateFormPage update />} />
      </Routes>
    </Suspense>
  );
};

export default FormbuilderRoutes;
