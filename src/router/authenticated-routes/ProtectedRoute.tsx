import React from 'react';
import { Navigate } from 'react-router-dom';
import useCheckPermission from '../../hooks/useCheckPermission';
import LoadingOverlay from "../../components/LoadingOverlay";

interface ProtectedRouteProps {
    permissionType?: 'view' | 'update' | 'delete' | 'create';
    routeName?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    permissionType = 'view',
    routeName,
    children,
}) => {
    const { hasPermission, isReady } = useCheckPermission(permissionType, routeName);

    if(!isReady) {
        return <LoadingOverlay />; 
    }
    if (hasPermission) {
        return <>{children}</>;
    } else {
        return <Navigate to="/forbidden" replace />;
    }
};

export default ProtectedRoute;