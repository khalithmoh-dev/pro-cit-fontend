import React from 'react';
import { Navigate } from 'react-router-dom';
import useCheckPermission from '../../hooks/useCheckPermission';

interface ProtectedRouteProps {
    permissionType?: 'view' | 'update' | 'delete' | 'create';
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    permissionType = 'view',
    children,
}) => {
    const hasPermission = useCheckPermission(permissionType);


    if (hasPermission) {
        return <>{children}</>;
    } else {
        return <Navigate to="/forbidden" replace />;
    }
};

export default ProtectedRoute;