import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import {
  createErrorMessage,
  createSuccessMessage,
  deleteErrorMessage,
  deleteSuccessMessage,
  updateErrorMessage,
  updateSuccessMessage,
} from '../utils/functions/toast-message';
import { SelectOptionIF } from '../interface/component.interface';

export interface createDepartmentPayloadIF {
  name: string;
  departmentCode: string;
  description: String;
  maxmStgth: number | null;
  hod: string | null;
}

export interface DepartmentIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  departmentCode: string;
  description: String;
  maxmStgth: number | null;
  hod: string | null;
  totalSemesters: number;
}

interface DepartmentState {
  departments: DepartmentIF[];
  departmentOptions: SelectOptionIF[];
  department: DepartmentIF | null;
  deleting: string;
  loading: boolean;
  initialLoading: boolean;
  createDepartment: (payload: createDepartmentPayloadIF) => Promise<boolean>;
  updateDepartment: (payload: createDepartmentPayloadIF, id: string) => Promise<boolean>;
  getDepartments: (firstRender?: boolean) => Promise<object[] |boolean>;
  getDepartment: (id: string) => Promise<object | boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;
}

const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  departmentOptions: [],
  department: null,
  deleting: '',
  loading: false,
  initialLoading: false,

  createDepartment: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/department/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Department'));
      await get().getDepartments(); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Department'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateDepartment: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/department/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Department'));
      await get().getDepartments(); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Department'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getDepartments: async (firstRender) => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department/`);
      return res?.data;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getDepartment: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department/${id}`);
      set({ department: res.data });
      return res?.data;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteDepartment: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/department/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Department'));
      await get().getDepartments(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Department'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useDepartmentStore;
