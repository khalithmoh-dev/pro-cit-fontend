import React from 'react';
import useAuthStore from '../store/authStore';
import AuthenticatedRoutes from './authenticated-routes';
import UnauthenticatedRoutes from './unauthenticated-routes';

const IndexRouter: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

export default IndexRouter;
