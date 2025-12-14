import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';

const LocationForm = lazy(() => import('../../modules/enterprise/location/LocationForm'));
const LocationList = lazy(() => import('../../modules/enterprise/location/list'));

const LocationRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/list" element={<LocationList />} />
        <Route path="/form/:id?" element={<LocationForm />} />
      </Routes>
    </Suspense>
  );
};

export default LocationRoutes;
