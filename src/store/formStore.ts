import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createFormPayloadIF {
  name: string;
  description: string;
  form: any[];
}

export interface formIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  form: any[];
}

interface FormState {
  forms: formIF[];
  form: formIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  createForm: (payload: createFormPayloadIF) => Promise<boolean>;
  updateForm: (payload: createFormPayloadIF, id: string) => Promise<boolean>;
  getForms: () => Promise<boolean>;
  getForm: (id: string) => Promise<boolean>;
  deleteForm: (id: string) => Promise<boolean>;
}

const useFormStore = create<FormState>((set, get) => ({
  forms: [],
  form: null,
  loading: false,
  deleting: '',
  initialLoading: false,

  // Create a new form
  createForm: async (payload) => {
    set({ loading: true }); // Set loading state before API call
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/create`, payload);
      await get().getForms(); // Refresh the form list after creation
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false }); // Reset loading state after API call
    }
  },

  // Update an existing form
  updateForm: async (payload, id) => {
    set({ loading: true }); // Set loading state before API call
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/form/update/${id}`, payload);
      await get().getForms(); // Refresh the form list after update
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false }); // Reset loading state after API call
    }
  },

  // Get all forms
  getForms: async () => {
    set({ loading: true }); // Set loading state before API call
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/`);
      set({ forms: res.data });
      return true;
    } catch (error) {
      set({ forms: [] }); // Reset form list in case of error
      return false;
    } finally {
      set({ loading: false }); // Reset loading state after API call
    }
  },

  // Get a specific form by ID
  getForm: async (id) => {
    set({ loading: true }); // Set loading state before API call
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/form/${id}`);
      set({ form: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false }); // Reset loading state after API call
    }
  },

  // Delete a specific form by ID
  deleteForm: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/form/${id}`);
      await get().getForms(); // Refresh the form list after deletion
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useFormStore;
