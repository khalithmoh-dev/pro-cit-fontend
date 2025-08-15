import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const FeeHeadListPage = lazy(() => import('../../modules/fee-head/fee-head-list'));
const CreateFeeHeadPage = lazy(() => import('../../modules/fee-head/create-fee-head'));

const FeeHeadRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<FeeHeadListPage />} />
        <Route path="/create" element={<CreateFeeHeadPage />} />
        <Route path="/update/:formId" element={<CreateFeeHeadPage update />} />
      </Routes>
    </Suspense>
  );
};

export default FeeHeadRoutes;
