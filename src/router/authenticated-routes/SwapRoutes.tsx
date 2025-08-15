import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const SwapList = lazy(() => import('../../modules/swap'));

const SwapRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<SwapList />} />
      </Routes>
    </Suspense>
  );
};

export default SwapRoutes;
