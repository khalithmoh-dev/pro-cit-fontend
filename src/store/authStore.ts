import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useToastStore } from './toastStore';
import { ModuleIF, ModulePermissions } from './moduleStore';
import httpRequest from '../utils/functions/http-request';

export interface MainMenuItem {
  key: string;
  name: string;
  path: string;
  subMenuItems: {
    key: string;
    name: string;
    path: string;
  }[];
}

// Define the types for the auth state
interface User {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    role: {
      name: string;
      _id: string;
    };
    email: string;
    mobileNumber: string;
    designation: string;
    department: {
      _id: string;
      departmentCode: string;
    };
    insId: string;
  };
  role: {
    modules: ModuleIF[];
    _id: string;
  };
}

interface VaidateOtpPayloadIF {
  email: string;
  verificationCode: string;
  password: string;
}

interface RouteDetails {
  icon: string,
  name: string
}

interface InstituteDetails {
  _id: string,
  insname: string
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: { [key: string]: ModulePermissions } | null;
  user: User | null;
  academicYear: string;
  routeInfo: Record<string,RouteDetails>; 
  instituteDtls: InstituteDetails;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setPermissions: (modules: { [key: string]: ModulePermissions }) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  validateOtp: (payload: VaidateOtpPayloadIF) => Promise<boolean>;
  setAcademicYear: (academicYear: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
      isAuthenticated: false,
      isLoading: false,
      permissions: null,
      error: null,
      user: null,
      // sidebarNavItems: [],
      academicYear: '2024-2025',
      instituteDtls: {
        _id: '',
        insname: '',
        insCode: '',
      },
      routeInfo: {},
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data: any = await response.json();
          useToastStore.getState().showToast('success', 'Logged in successfully');
          window?.sessionStorage?.setItem('accessToken', JSON.stringify(data?.data?.accessToken));
          // const transformedData = transformNavData(data.data.role.modules);
          const permissionsObject: { [key: string]: ModulePermissions } = {};
          const pathDtls: Record<string, RouteDetails> = {};
          data.data.role.modules.forEach((module: ModuleIF) => {
            permissionsObject[module.key] = module.permissions;
            if(!module.deleted){
              const currentPath = module.path
              console.log('currentPath',currentPath)
              pathDtls[currentPath]= {icon: module.icon, name: module.name};
            }
          });
          set({
            isAuthenticated: true,
            user: data.data,
            permissions: permissionsObject,
            // sidebarNavItems: transformedData,
            isLoading: false,
            routeInfo: pathDtls,
            instituteDtls: data.data?.user?.institutes
          });
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          useToastStore.getState().showToast('error', err.message);
          return false;
        }
      },

      logout: () => {
        useToastStore.getState().showToast('success', 'Logged out successfully');
        set({ isAuthenticated: false, user: null });
        window.sessionStorage.clear();
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          const res = await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/user/password/forgot`, {
            email,
          });
          console.log("🚀 ~ forgotPassword: ~ res:", res);
          useToastStore.getState().showToast('success', 'Verification code sent successfully');
          return true;
        } catch (error: any) {
          // Type assertion: assuming error is an instance of Error
          useToastStore.getState().showToast('error', (error as Error).message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      changePassword: async (email) => {
        set({ isLoading: true });
        try {
          const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/password/change`, {
            email,
          });
          console.log("🚀 ~ changePassword: ~ res:", res)
          useToastStore.getState().showToast('success', 'Password changed successfully');
          return true;
        } catch (error: any) {
          useToastStore.getState().showToast('error', error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      validateOtp: async (payload: VaidateOtpPayloadIF) => {
        set({ isLoading: true });
        try {
          const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/verify`, payload);
          console.log('See http response---->', res);
          useToastStore.getState().showToast('success', 'Verified success');
          return true;
        } catch (error: any) {
          useToastStore.getState().showToast('error', error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      setPermissions: (modules) => {
        set({ permissions: modules });
      },
      setAcademicYear: (academicYear) => {
        set({ academicYear: academicYear });
      },
    }),
    {
      name: 'authStore',
      storage: createJSONStorage(() => sessionStorage), // <==  pay attention
    },
  ),
);

export default useAuthStore;
