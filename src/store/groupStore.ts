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

export interface createGroupPayloadIF {
  name: string;
  groupCode: string;
  students: SelectOptionIF[] | string[];
  subject: string;
  subjectName: string;
  description: string;
}

export interface teachersIF {
  _id: string,
  firstName: string,
  middleName: string,
  lastName: string,
  employeeCode: string,
  role: string,
  department: string
}

export interface groupIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  groupCode: string;
  totalSemesters: number;
  semester: number;
  batch: number;
  department: {
    departmentCode: string;
    _id: string;
  };
  subject: {
    name: string;
    _id: string;
  };
  students: string[];
  teachers: teachersIF[];
  description: string;
}

interface GroupState {
  groups: groupIF[];
  filteredGroups: groupIF[];
  group: groupIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  total: number;
  createGroup: (payload: createGroupPayloadIF) => Promise<boolean>;
  updateGroup: (payload: createGroupPayloadIF, id: string) => Promise<boolean>;
  getGroups: (query?: any, noLoader?: boolean) => Promise<boolean>;
  getGroup: (id: string) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  getFilteredGroups: (query: any) => Promise<boolean>;
}

const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  filteredGroups: [],
  group: null,
  loading: false,
  deleting: '',
  initialLoading: false,
  total: 0,

  createGroup: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/group/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Group'));
      await get().getGroups(); // Refresh groups after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Group'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateGroup: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/group/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Group'));
      await get().getGroups(); // Refresh groups after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Group'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getGroups: async (query = {}, noLoader) => {
    set({ loading: noLoader ? false : true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/group/`, query);
      set({ groups: res.data, total: res.total });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getGroup: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/group/${id}`);
      set({ group: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteGroup: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/group/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Group'));
      await get().getGroups(); // Refresh groups after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Group'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  getFilteredGroups: async (query: any = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/group/`, query);
      set({ filteredGroups: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useGroupStore;
