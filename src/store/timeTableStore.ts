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

export interface createTimeTablePayloadIF {
  _id: string;
  week: string;
  startTime: string;
  endTime: string;
  department: {
    departmentCode: string;
  };
  semester: string;
  group: {
    name: string;
    batch: string;
    semester: string;
    students: string[]; // Assuming student IDs are strings
    subject: string;
    subjectName: string;
  };
  teacher: {
    firstName: string;
    lastName: string;
  };
  roomNumber: string;
  createdAt: string;
}

export interface TimeTableIF {
  _id: string;
  week: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: number;
  group: string;
  teacher: string;
  roomNumber: string;
  subject: string;
}

export interface PeriodStudentsIF {
  firstName: string;
  lastName: string;
  usnNumber: string;
  present: boolean;
  _id: string;
}

export interface PeriodIF {
  _id: string;
  week: string;
  startTime: string;
  endTime: string;
  department: {
    _id: string,
    departmentName: string,
    departmentCode: string
  };
  departmentName: string;
  semester: number;
  group: {
    _id: string;
    semester: string;
    batch: string;
  };
  roomNumber: string;
  subject: {
    _id: string;
    shortName: string;
  };
  departmentCode: string;

  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  students: PeriodStudentsIF[];
  createdAt: string;
}

interface TimeTableEventsIF {
  date: string;
  subject: string;
  startTime: string;
  endTime: string;
}
export interface DeleteTimeTableBodyIF {
  id?: string;
  week: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: string;
  batch: string;
  subject: string;
  group: string;
  teacher?: string;
}
interface UpdateTimeTablePayloadIF {
  updatedValue: TimeTableIF;
  oldValue: DeleteTimeTableBodyIF;
}

interface TimeTableState {
  timeTables: PeriodIF[];
  timeTableEvents: TimeTableEventsIF[];
  timeTable: PeriodIF | null;
  period: PeriodIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  createTimeTable: (payload: TimeTableIF) => Promise<boolean>;
  updateTimeTable: (payload: UpdateTimeTablePayloadIF) => Promise<boolean>;
  getTimeTables: (query?: any) => Promise<boolean>;
  getTimeTableEvents: (query?: any) => Promise<boolean>;
  getPeriod: (id: string) => Promise<boolean>;
  getTimeTable: (id: string) => Promise<boolean>;
  deleteTimeTable: (body: DeleteTimeTableBodyIF) => Promise<boolean>;
  clearTimeTableList: () => void;
}

const useTimeTableStore = create<TimeTableState>((set) => ({
  timeTables: [],
  timeTableEvents: [],
  timeTable: null,
  period: null,
  loading: false,
  deleting: '',
  initialLoading: false,

  createTimeTable: async (payload) => {
    set({ loading: true }); // Set loading state
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('TimeTable'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('TimeTable'));
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  updateTimeTable: async (payload) => {
    set({ loading: true }); // Set loading state
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/time-table/update`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('TimeTable'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('TimeTable'));
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  getTimeTables: async (query: any = {}) => {
    set({ loading: true }); // Set loading state
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/`, query);
      set({ timeTables: res.data });
      return true;
    } catch (error) {
      set({ timeTables: [] }); // Reset time tables on error
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  getTimeTableEvents: async (query: any = {}) => {
    set({ loading: true }); // Set loading state
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/events`, query);
      set({ timeTableEvents: res.data });
      return true;
    } catch (error) {
      set({ timeTableEvents: [] }); // Reset events on error
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  getPeriod: async (id) => {
    set({ loading: true }); // Set loading state
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/period/${id}`);
      set({ period: res.data[0] });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },
  getTimeTable: async (id) => {
    set({ loading: true }); // Set loading state
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/time-table/${id}`);
      set({ timeTable: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  deleteTimeTable: async (data) => {
    set({ deleting: data.id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/time-table/delete`, data);
      useToastStore.getState().showToast('success', deleteSuccessMessage('TimeTable'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('TimeTable'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
  clearTimeTableList: () => {
    set({ timeTables: [] });
  },
}));

export default useTimeTableStore;
