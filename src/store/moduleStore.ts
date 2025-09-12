import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createModulePayloadIF {
  name: string;
  moduleCode: string;
  totalSemesters: number | null;
}

export interface ModulePermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface ModuleIF {
  permissions: ModulePermissions;
  key: string;
  name: string;
  path: string;
  menuType: 'mainMenu' | 'subMenu';
  mainMenu: string;
  order: number;
  createdAt: string;
  deleted: boolean;
  _id: string;
  icon?: string;
}

interface ModuleState {
  deleting: string;
  modules: ModuleIF[];
  module: ModuleIF | null;
  loading: boolean;
  createModule: (payload: createModulePayloadIF) => Promise<boolean>;
  updateModule: (payload: createModulePayloadIF, id: string) => Promise<boolean>;
  getModules: (query?: any) => Promise<boolean>;
  getModule: (id: string) => Promise<boolean>;
  deleteModule: (id: string) => Promise<boolean>;
}

const useModuleStore = create<ModuleState>((set, get) => ({
  modules: [],
  module: null,
  loading: false,
  deleting: '',

  // Create a new module
  createModule: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/module/create`, payload);
      await get().getModules();
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing module
  updateModule: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/module/update/${id}`, payload);
      await get().getModules(); // Refresh the module list after update
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get all modules
  getModules: async (query = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/module/`, query);
      set({ modules: res.data });
      return true;
    } catch (error) {
      set({ modules: [] }); // Reset module list in case of error
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get a specific module by ID
  getModule: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/module/${id}`);
      set({ module: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Delete a specific module by ID
  deleteModule: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/module/delete/${id}`);
      await get().getModules(); // Refresh the module list after deletion
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useModuleStore;
