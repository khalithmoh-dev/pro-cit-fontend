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

export interface createDesignationPayloadIF {
  name: string;
  description: string;
}

export interface DesignationIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

interface DesignationState {
  designations: DesignationIF[];
  designationOptions: SelectOptionIF[];
  designation: DesignationIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  createDesignation: (payload: createDesignationPayloadIF) => Promise<boolean>;
  updateDesignation: (payload: createDesignationPayloadIF, id: string) => Promise<boolean>;
  getDesignations: () => Promise<boolean>;
  getDesignation: (id: string) => Promise<boolean>;
  deleteDesignation: (id: string) => Promise<boolean>;
}

const useDesignationStore = create<DesignationState>((set, get) => ({
  designations: [],
  designationOptions: [],
  designation: null,
  loading: false,
  deleting: '',
  initialLoading: false,

  createDesignation: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/designation/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Designation'));
      await get().getDesignations(); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Designation'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateDesignation: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/designation/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Designation'));
      await get().getDesignations(); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Designation'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getDesignations: async () => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/designation/`);
      if (!res.data.length) return true;
      const options = res.data.map((designation: DesignationIF) => {
        return {
          label: designation.name,
          value: designation._id,
        };
      });
      set({ designations: res.data, designationOptions: options });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getDesignation: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/designation/${id}`);
      set({ designation: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteDesignation: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/designation/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Designation'));
      await get().getDesignations(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Designation'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useDesignationStore;
