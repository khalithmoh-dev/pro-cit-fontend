import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import {
  createSuccessMessage,
  deleteErrorMessage,
  deleteSuccessMessage,
  updateSuccessMessage,
} from '../utils/functions/toast-message';
import { SelectOptionIF } from '../interface/component.interface';

export interface createEmployeePayloadIF {
  name: string;
  employeeCode: string;
  department: string;
  otherDepartments: any[];
  permanentSameAsPresent: boolean;
  presentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
  permanentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
}

export interface employeeIF {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  designation: {
    _id: string;
    name: string;
  };
  biometricId: string;
  employeeCode: string;
  bloodGroup: string;
  contactNumber: number;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  dateOfJoin: string;
  dateOfRelieve: string;
  department: {
    _id: string;
    name: string;
    departmentCode: string;
  };
  otherDepartments: {
    _id: string;
    name: string;
    departmentCode: string;
  }[];
  academicBranch: any[];
  salutation: string;
  emergencyContactNumber: number;
  termsAndConditions: boolean;
  permanentSameAsPresent: boolean;
  presentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
  permanentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
  bankDetails: {
    bankName: string;
    branchAddress: string;
    branchCode: string;
    accountHolderName: string;
    accountNumber: number;
  };
  employmentType: string;
  aadharNumber: number;
  panNumber: string;
  qualification: string;
  profilePhoto: string;
  lastLogin: string;
  modules: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface EmployeeState {
  employees: employeeIF[];
  allTeacherOptions: SelectOptionIF[];
  availableTeachers: SelectOptionIF[];
  filteredEmployees: employeeIF[];
  employee: employeeIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  total: number;
  createEmployee: (payload: createEmployeePayloadIF) => Promise<boolean>;
  updateEmployee: (payload: createEmployeePayloadIF, id: string) => Promise<boolean>;
  getEmployees: (query?: any, firstRender?: boolean) => Promise<boolean>;
  getEmployee: (id: string) => Promise<boolean>;
  getEmployeeWithPopulate: (id: string) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  getFilteredEmployees: (query?: any) => Promise<boolean>;
  getAvailableTeachers: (query?: any) => Promise<boolean>;
  getAllTeacherList: (query?: any) => Promise<boolean>;
  clearEmployee: () => void;
  getStfsForSrch: (req:string)=> Promise<object[] | boolean>;
  getStfsByIds: (req:string)=> Promise<object[] | boolean>;
}

const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  allTeacherOptions: [],
  availableTeachers: [],
  filteredEmployees: [],
  employee: null,
  loading: false,
  deleting: '',
  initialLoading: false,
  total: 0,

  createEmployee: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Employee'));
      await get().getEmployees(); // Refresh after creation
      return true;
    } catch (error: any) {
      useToastStore.getState().showToast('error', error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/user/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Employee'));
      await get().getEmployees(); // Refresh after update
      return true;
    } catch (error: any) {
      useToastStore.getState().showToast('error', error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getEmployees: async (query = {}, firstRender) => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/`, query);
      set({ employees: res.data, total: res.total, employee: null });
      return true;
    } catch (error) {
      set({ employees: [], total: 0 });
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getEmployee: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/user/${id}`);
      set({ employee: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getEmployeeWithPopulate: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/single`, { _id: id });
      set({ employee: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/user/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Employee'));
      await get().getEmployees(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Employee'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  getFilteredEmployees: async (query = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/`, query);
      set({ filteredEmployees: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getAvailableTeachers: async (query: any = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/available`, query);
      const options = res.data.map((employee: employeeIF) => {
        return {
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee._id,
        };
      });
      set({ availableTeachers: options });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getAllTeacherList: async (query: any = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/user/teachers`, query);
      const options = res.data.map((employee: employeeIF) => {
        const { _id, firstName, lastName, employeeCode, department } = employee;
        return {
          label: `${firstName} ${lastName} - ${employeeCode} (${department?.departmentCode}) `,
          value: _id,
        };
      });
      set({ allTeacherOptions: options });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  clearEmployee: () => {
    set({ employee: null });
  },
  getStfsForSrch: async(aReq) => {
    try{
      const res = await httpRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/employee/get-by-name`,
        {aRqstdFlds: aReq},
        { skipLoader: true }
      );
      return res?.data;
    }catch(err){
      return false;
    }
  },
  getStfsByIds: async(aReq) => {
    try{
      const res = await httpRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/employee/get-by-ids`,
        {aRqstdFlds: aReq}
      );
      return res?.data;
    }catch(err){
      return false;
    }
  }
}));

export default useEmployeeStore;
