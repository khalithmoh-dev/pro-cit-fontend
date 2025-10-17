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
import { useTranslation } from 'react-i18next';
import { SelectOptionIF } from '../interface/component.interface';
const {showToast} = useToastStore.getState();
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
  getDepartments: (page?:number,limit?:number,searchTerm?:string) => Promise<object[] | boolean>;
  getDepartment: (id: string) => Promise<object | boolean>;
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
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateDepartment: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/department/update/${id}`, payload);
      await get().getDepartments(); // Refresh after update
      return true;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getDepartments: async (page,limit,searchTerm) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department/?page=${page}&limit=${limit}&search=${searchTerm}`);
      return res?.data;
    } catch (error) {
      useToastStore.getState().showToast('error', "Unknown error occured");
      return false;
    } finally {
      set({ loading: false });
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
  }
}));

export default useDepartmentStore;
