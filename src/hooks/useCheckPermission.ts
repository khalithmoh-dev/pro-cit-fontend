import React from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import useAuthStore from '../store/authStore';

type PermissionType = 'view' | 'edit' | 'delete' | 'create';

const useCheckPermission = (
  permissionType: PermissionType,
  routeName?: string // 👈 optional route override
): boolean => {
  const authStore = useAuthStore();
  const location = useLocation();
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (authStore?.permissions) {
      // 🧭 Determine which route to use
      const currentPath = routeName || location.pathname;

      // 🧩 Handle dynamic routes (like /degree/form/:id)
      const match = matchPath(`${currentPath}/:id`, location.pathname);
      const basePath = match?.pathnameBase || currentPath;
console.log('basePath',basePath)
      // 🔐 Fetch permissions
      const screenPermissions = authStore.permissions[basePath];
      if (!screenPermissions) {
        setHasPermission(false);
        return;
      }

      let allowed = false;

      switch (permissionType) {
        case 'create':
          allowed = !!screenPermissions.create;
          break;
        case 'edit':
          allowed = !!screenPermissions.update
          break;
        case 'delete':
          allowed = !!screenPermissions.delete;
          break;
        case 'view':
          // 👇 Hierarchical rule: create/update implies view
          allowed =
            !!screenPermissions.create ||
            !!screenPermissions.update ||
            !!screenPermissions.read;
          break;
        default:
          allowed = false;
      }

      setHasPermission(allowed);
    } else {
      setHasPermission(false);
    }
  }, [authStore?.permissions, location.pathname, permissionType, routeName]);

  return hasPermission;
};

export default useCheckPermission;
