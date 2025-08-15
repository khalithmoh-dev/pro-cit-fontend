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

export interface createSwapPayloadIF {
  name: string;
  description: string;
}

export interface SwapIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  requestBy: {
    _id: string;
    firstName: string;
    employeeCode: string;
  };
  requestTo: {
    _id: string;
    firstName: string;
    employeeCode: string;
  };
  swappingDate: string;
  startTime: string;
  endTime: string;
  accepted: boolean;
}
export interface SwapPayloadIF {
  swappingDate: string;
  startTime: string;
  endTime: string;
  requestBy: string;
  requestTo: string;
  department: string;
  semester: string;
  subject: string;
}
interface UpdateSwapPayloadIF {
  accepted: boolean;
  groupId: string;
  subjectId: string;
}

interface SwapState {
  swaps: SwapIF[];
  swapOptions: SelectOptionIF[];
  swap: SwapIF | null;
  loading: boolean;
  deleting: string;
  createSwap: (payload: SwapPayloadIF) => Promise<boolean>;
  updateSwap: (payload: UpdateSwapPayloadIF, id: string) => Promise<boolean>;
  getSwaps: (query?: any) => Promise<boolean>;
  getSwap: (id: string) => Promise<boolean>;
  deleteSwap: (id: string) => Promise<boolean>;
}

const useSwapStore = create<SwapState>((set) => ({
  swaps: [],
  swapOptions: [],
  swap: null,
  loading: false,
  deleting: '',

  createSwap: async (payload) => {
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/swap/create`, payload);
      useToastStore.getState().showToast('success', 'Request send successfully');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', 'Failed to send Request');
      return false;
    }
  },

  updateSwap: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/swap/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Swap'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Swap'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getSwaps: async (query = {}) => {
    set({ loading: true });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/swap/`, query);

      set({ swaps: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getSwap: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/swap/${id}`);
      set({ swap: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteSwap: async (id) => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/swap/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Swap'));
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Swap'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },
}));

export default useSwapStore;
