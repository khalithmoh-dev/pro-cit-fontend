import { ModuleIF, ModulePermissions } from '../../store/moduleStore';
import { RouteDetails } from '../../store/authStore';


// set user details after login
export const setUserDetails = (data, set) => {
    window?.sessionStorage?.setItem('accessToken', JSON.stringify(data?.accessToken));
    // const transformedData = transformNavData(data.role.modules);
    const permissionsObject: { [key: string]: ModulePermissions } = {};
    const pathDtls: Record<string, RouteDetails> = {};
    (data.user?.modules ?? []).forEach((module: ModuleIF) => {
        if (!module.deleted) {
            const currentPath = module.path
            permissionsObject[currentPath] = module.permissions;
            pathDtls[currentPath] = { icon: module.icon, name: module.name };
        }
    });
    set({
        isAuthenticated: true,
        user: data,
        oEnterprises: data.oEnterpriseValues,
        permissions: permissionsObject,
        isLoading: false,
        routeInfo: pathDtls,
        instituteDtls: data?.user?.institutes
    });
};