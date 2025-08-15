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
import { DepartmentIF } from './departmentStore';
import { SelectOptionIF } from '../interface/component.interface';

export interface createSubjectPayloadIF {
  name: string;
  subjectCode: string;
  department?: string;
}

export interface SubjectIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  subjectCode: string;
  department: DepartmentIF;
  shortName: string;
  semester: number;
  totalBatches: number;
  type: string;
}

interface SubjectState {
  subjects: SubjectIF[];
  filteredSubjects: SubjectIF[];
  subject: SubjectIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  subjectOptions: SelectOptionIF[];
  total: number;
  createSubject: (payload: createSubjectPayloadIF) => Promise<boolean>;
  updateSubject: (payload: createSubjectPayloadIF, id: string) => Promise<boolean>;
  getSubjects: (query?: any, noLoader?: boolean) => Promise<boolean>;
  getSubject: (id: string) => Promise<boolean>;
  deleteSubject: (id: string) => Promise<boolean>;
  getFilteredSubjects: (query?: any) => Promise<boolean>;
  getUserSubjects: (subjectId: string) => Promise<SelectOptionIF[]>;
}

const useSubjectStore = create<SubjectState>((set, get) => ({
  subjects: [],
  filteredSubjects: [],
  subject: null,
  loading: false,
  deleting: '',
  initialLoading: false,
  total: 0,
  subjectOptions: [],

  createSubject: async (payload) => {
    try {
      set({ loading: true });
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/subject/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Subject'));
      await get().getSubjects(); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Subject'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateSubject: async (payload, id) => {
    try {
      set({ loading: true });
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/subject/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Subject'));
      await get().getSubjects(); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Subject'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getSubjects: async (query = {}, noLoader) => {
    set({ loading: noLoader ? false : true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/subject/`, query);
      set({ subjects: res.data, total: res.total });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getFilteredSubjects: async (query = {}) => {
    set({ filteredSubjects: [], subjectOptions: [], loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/subject/`, query);
      if (!res.data.length) {
        useToastStore.getState().showToast('info', 'No subject found');
        return true;
      }
      const options = res.data.map((subject: SubjectIF) => {
        return {
          label: subject.shortName,
          value: subject._id,
        };
      });
      set({ filteredSubjects: res.data, subjectOptions: options });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getSubject: async (id) => {
    try {
      set({ loading: true });
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/subject/${id}`);
      set({ subject: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteSubject: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/subject/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Subject'));
      await get().getSubjects(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Subject'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
  getUserSubjects: async (subjectId) => {
    try {
      set({ loading: true });
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/subject/user`, { subjectId: subjectId });
      const options = res.data.map((data: any) => {
        const source = data.subject._id === subjectId ? 'others' : 'yours';
        return {
          label: `${data.subject.shortName} - ${data.subject.type} - ${data.batch} - ${source}`,
          value: `${data._id}_${data.subject._id}`,
        };
      });
      return options;
    } catch (error) {
      return [];
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSubjectStore;
