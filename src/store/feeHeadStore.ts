/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Interface for creating a fee head
export interface createFeeHeadPayloadIF {
  name: string;
  feeHeadCode: string;
  totalSemesters: number | null;
}

// Interface representing the fee head data structure
export interface feeHeadIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  feeHeadCode: string;
  totalSemesters: number;
}

// Interface representing the fee head store state and actions
interface FeeHeadState {
  feeHeads: feeHeadIF[];
  feeHead: feeHeadIF | null;
  loading: boolean;
  createFeeHead: (payload: createFeeHeadPayloadIF) => Promise<boolean>;
  updateFeeHead: (payload: createFeeHeadPayloadIF, id: string) => Promise<boolean>;
  getFeeHeads: () => Promise<boolean>;
  getFeeHead: (id: string) => Promise<boolean>;
  deleteFeeHead: (id: string) => Promise<boolean>;
}

const useFeeHeadStore = create<FeeHeadState>((set, get) => ({
  feeHeads: [],
  feeHead: null,
  loading: false,

  // Create a new fee head
  createFeeHead: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/feeHead/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('FeeHead'));
      await get().getFeeHeads(); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('FeeHead'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing fee head
  updateFeeHead: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/feeHead/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('FeeHead'));
      await get().getFeeHeads(); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('FeeHead'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all fee heads
  getFeeHeads: async () => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/feeHead/`);
      set({ feeHeads: res.data });
      return true;
    } catch (error) {
      set({ feeHeads: [] });
      useToastStore.getState().showToast('error', 'Failed to fetch fee heads.');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a specific fee head by ID
  getFeeHead: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/feeHead/${id}`);
      set({ feeHead: res.data });
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', 'Failed to fetch fee head details.');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Delete a fee head by ID
  deleteFeeHead: async (id) => {
    set({ loading: true });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/feeHead/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('FeeHead'));
      await get().getFeeHeads(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('FeeHead'));
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFeeHeadStore;
