import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
 
const CreateSectionPage = lazy(() => import('../../modules/section/create-section'));
const SectionListPage = lazy(() => import('../../modules/section/section-list'));

const SectionRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SectionListPage />} />
        <Route path="/create" element={<CreateSectionPage />} />
        <Route path="/update/:id" element={<CreateSectionPage />} />
      </Routes>
    </Suspense>
  );
};

export default SectionRoutes;