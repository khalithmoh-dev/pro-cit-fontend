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

export interface srchCrsSchdlPyldIF {
  _id?: string;
  insId: String;
  degId: String;
  prgId: String;
  deptId: String;
  semCd: String;
  mandatoryCourses?: [];
  electiveCourses?: [];
}
export interface saveCrsSchdlPyldIF {
  _id?: string;
  insId: String;
  degId: String;
  prgId: String;
  deptId: String;
  semCd: String;
  mandatoryCrs: object[];
  electiveCrs: object[];
}

interface CourseScheduleState {
  searchCourseSchedule: (payload: srchCrsSchdlPyldIF) => Promise<saveCrsSchdlPyldIF | null>
  createCourseSchedule: (payload: saveCrsSchdlPyldIF) => Promise<object[] | boolean>
  searchCoursesByName: (payload: string) => Promise<object[] | boolean>
  updateCourseSchedule: (payload: saveCrsSchdlPyldIF, id: string) => Promise<object[] | boolean>
}

const useCourseScheduleStore = create<CourseScheduleState>((set, get) => ({

  searchCourseSchedule: async (payload) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/course-schedule/search`, payload);
      return res.data || [];
    } catch (err) {
      console.error(err);
    }
  },

  searchCoursesByName: async (payload) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/course-schedule/fetch-course`, { name: payload }, { skipLoader: true });
      return res.data || [];
    } catch (err) {
      console.error(err);
    }
  },

  createCourseSchedule: async (payload) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/course-schedule/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Course Schedule'));
      return res?.data || [];
    } catch (err) {
      useToastStore.getState().showToast('success', createErrorMessage('Course Schedule'));
      console.error(err);
    }
  },

  updateCourseSchedule: async (payload, id) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/course-schedule/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Course Schedule'));
      return res?.data || [];
    } catch (err) {
      useToastStore.getState().showToast('success', updateErrorMessage('Course Schedule'));
      console.error(err);
    }
  }

}));

export default useCourseScheduleStore;
