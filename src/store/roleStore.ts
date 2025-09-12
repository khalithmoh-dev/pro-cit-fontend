import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { ModuleIF, ModulePermissions } from './moduleStore';
import { SelectOptionIF } from '../interface/component.interface';
import { MainMenuItem } from './authStore';
// import { transformNavData } from '../modules/layout/sidebar';

export interface roleIF {
  _id: string;
  name: string;
  description: string;
  modules: ModuleIF[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface createRolePayloadIF {
  name: string;
  description: string;
  modules: ModuleIF[];
}

interface RoleState {
  roles: roleIF[];
  // sidebarNavItems: MainMenuItem[];
  roleOptions: SelectOptionIF[];
  permissions: { [key: string]: ModulePermissions } | null;
  role: roleIF | null;
  userRole: roleIF | null;
  deleting: string;
  loading: boolean;
  initialLoading: boolean;
  createRole: (payload: createRolePayloadIF) => Promise<boolean>;
  updateRole: (payload: createRolePayloadIF, id: string) => Promise<boolean>;
  getRoles: () => Promise<boolean>;
  getRole: (id: string) => Promise<boolean>;
  getUserRole: (id: string) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  setPermissions: (modules: { [key: string]: ModulePermissions }) => void;

}

const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  roleOptions: [],
  role: null,
  userRole: null,
  deleting: '',
  loading: false,
  initialLoading: false,
  sidebarNavItems: [], // Initialize with an empty array or default structure
  permissions: {}, // Initialize with an empty object or default structure

  createRole: async (payload) => {
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/role/create`, payload);
      return true;
    } catch (error) {
      console.log("🚀 ~ createRole: ~ error:", error)
      return false;
    }
  },
  updateRole: async (payload, id) => {
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/role/update/${id}`, payload);
      return true;
    } catch (error) {
      console.log("🚀 ~ updateRole: ~ error:", error)
      return false;
    }
  },
  getRoles: async () => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/role/`);
      if (!res.data.length) return true;
      const options = res.data.map((role: roleIF) => {
        return {
          label: role.name,
          value: role._id,
        };
      });
      set({ roles: res.data, roleOptions: options });
      return true;
    } catch (error) {
      console.log("🚀 ~ getRoles: ~ error:", error)
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getRole: async (id) => {
    try {
      set({ role: null });
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/role/${id}`);
      set({ role: res.data });
      return true;
    } catch (error) {
      console.log("🚀 ~ getRole: ~ error:", error)
      return false;
    }
  },
  getUserRole: async (id) => {
    try {
      const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/role/${id}`);
      console.log(res?.data, "res?.datares?.data");
      // const transformedData = transformNavData(res?.data?.modules);
      const permissionsObject: { [key: string]: ModulePermissions } = {};
      res?.data.modules?.forEach((module: ModuleIF) => {
        permissionsObject[module.key] = module.permissions;
      });
      set({
        userRole: res.data,
        permissions: permissionsObject,
        // sidebarNavItems: transformedData,
      });
      
      return true;
    } catch (error) {
      console.log("🚀 ~ getUserRole: ~ error:", error)
      return false;
    }
  },

  setPermissions: (modules) => {
    set({ permissions: modules });
  },
  deleteRole: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/role/delete/${id}`);
      return true;
    } catch (error) {
      console.log("🚀 ~ deleteRole: ~ error:", error)
      return false;
    } finally {
      set({ deleting: id });
    }
  },
}));


export default useRoleStore;
