import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import {
  deleteErrorMessage,
  deleteSuccessMessage,
  updateErrorMessage,
  updateSuccessMessage,
} from '../utils/functions/toast-message';
import { StudentIF } from './studentStore';

export interface createInvitedStudentPayloadIF {
  name: string;
  invitedStudentCode: string;
  department?: string;
  permanentSameAsPresent: boolean;
  permanentAddress: any;
  presentAddress: any;
  semester: number;
  admissionSemester: number;
  email: string;
}

export interface createInvitePayloadIF {
  name: string;
  email: string;
}

interface InvitedStudentState {
  invitedStudents: StudentIF[];
  invitedStudent: StudentIF | null;
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  total: number;
  createInvite: (payload: createInvitePayloadIF) => Promise<boolean>;
  updateInvitedStudent: (payload: createInvitedStudentPayloadIF, id: string) => Promise<boolean>;
  getInvitedStudents: (query?: any, firstRender?: boolean) => Promise<boolean>;
  getInvitedStudent: (id: string) => Promise<boolean>;
  deleteInvitedStudent: (id: string) => Promise<boolean>;
}

const useInvitedStudentStore = create<InvitedStudentState>((set, get) => ({
  invitedStudents: [],
  invitedStudent: null,
  loading: false,
  deleting: '',
  initialLoading: false,
  total: 0,

  createInvite: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/register/student/create`, payload);
      useToastStore.getState().showToast('success', 'Invite sent successfully');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', 'Failed to send invite request');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateInvitedStudent: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PUT', `${import.meta.env.VITE_API_URL}/register/student/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Invited Student'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Invited Student'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getInvitedStudent: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/register/student/${id}`);
      set({ invitedStudent: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getInvitedStudents: async (query = {}, firstRender) => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/register/student/`, query);
      set({ invitedStudents: res.data, total: res.total });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  deleteInvitedStudent: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/register/student/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Invited Student'));
      await get().getInvitedStudents(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Invited Student'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useInvitedStudentStore;
