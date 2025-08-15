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
import { PeriodStudentsIF } from './timeTableStore';

export interface CreateAttendancePayloadIF {
  date: string;
  week: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: string;
  teacher: string;
  subject: string;
  students: PeriodStudentsIF[];
}
export interface UpdateAttendancePayloadIF {
  students: PeriodStudentsIF[];
}

export interface AttendanceIF {
  _id: string;
  date: string; // or Date if you plan to parse it as a Date object
  department: {
    departmentCode: string;
  };
  subject: {
    _id: string;
    name: string;
    shortName: string;
    subjectCode: string;
  };
  week: string;
  batch: string;
  startTime: string;
  endTime: string;
  semester: string;
  teacher: {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
  };
  students: {
    _id: string;
    present: boolean;
    firstName: string;
    lastName: string;
    usnNumber: string;
  }[];
  createdAt: string; // or Date if you plan to parse it as a Date object
  updatedAt: string; // or Date if you plan to parse it as a Date object
  __v: number;
}

interface AttendanceState {
  attendance: AttendanceIF | null;
  attendances: AttendanceIF[];
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  total: number;
  createAttendance: (payload: CreateAttendancePayloadIF) => Promise<boolean>;
  updateAttendance: (payload: UpdateAttendancePayloadIF, id: string) => Promise<boolean>;
  getAttendances: (query?: any, firstRender?: boolean) => Promise<boolean>;
  getAttendance: (id: string) => Promise<boolean>;
  deleteAttendance: (id: string) => Promise<boolean>;
}

const useAttendanceStore = create<AttendanceState>((set) => ({
  loading: false,
  deleting: '',
  initialLoading: false,
  attendance: null,
  attendances: [],
  total: 0,

  createAttendance: async (payload) => {
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/attendance/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Attendance'));
      return true;
    } catch (error: any) {
      useToastStore.getState().showToast('error', error.message);
      return false;
    }
  },

  updateAttendance: async (payload, id) => {
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/attendance/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Attendance'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Attendance'));
      return false;
    }
  },

  getAttendances: async (query = {}, firstRender) => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/attendance/`, query);
      set({ attendances: res.data, total: res.total });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getAttendance: async (id) => {
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/attendance/${id}`);
      set({ attendance: res.data });
      return true;
    } catch (error) {
      return false;
    }
  },

  deleteAttendance: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/attendance/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Attendance'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Attendance'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useAttendanceStore;
