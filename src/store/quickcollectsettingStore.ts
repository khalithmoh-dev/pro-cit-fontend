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
import { Key, ReactNode } from 'react';

export interface CreateParentHeadPayloadIF {
  name: string;
  departmentCode: string;
  totalSemesters: number | null;
}

export interface DepartmentIF {
  head_group_name: ReactNode;
  id: Key | null | undefined;
  status: ReactNode;
  parent_head_name: ReactNode;
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  departmentCode: string;
  totalSemesters: number;
}

interface DepartmentState {
  getfeefine: any;
  getScholarshipHead: any// Replace 'any' with a more specific type based on the response
  getHeadGroup: any;
  getPaymentMode: any;
  departments: DepartmentIF[];
  feefine: any,
  getfeeHead: any,
  feeHead: any,
  ScholarshipHead: any;
  BankAccount: any
  getReceiptSeries: any;
  ParentHead: any;
  concessionget: any;
  departmentOptions: SelectOptionIF[];
  department: DepartmentIF | null;
  deleting: string;
  getconcession: any,
  ReceiptSeries: any,
  getBankAccount: any,
  PaymentMode: any,
  loading: boolean;
  initialLoading: boolean;
  createParentHead: (payload: CreateParentHeadPayloadIF) => Promise<boolean>;
  updateConcessiion: any;
  getParentHead: (status: string, firstRender?: boolean) => Promise<boolean>;
  getDepartment: (id: string) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;
}

const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  ParentHead: [],
  concessionget: [],
  ReceiptSeries: [],
  BankAccount: [],
  ScholarshipHead: [],
  feefine: [],
  feeHead: [],
  departmentOptions: [],
  PaymentMode: [],
  department: null,
  deleting: '',
  loading: false,
  initialLoading: false,

  createParentHead: async (payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/parent-head/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Parent Head'));
      await get().getParentHead(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Parent Head'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createHeadGroup: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/fee-head/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage(' Head Group'));
      await get().getHeadGroup(); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage(' Head Group'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createconcession: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/concession-type/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Head Group'));
      await get().getconcession(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Head Group'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createFeeHead: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/fine-head/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Fine Head'));
      await get().getfeefine(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Fine Head'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createFineHead: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/fee-head-category/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Fine Head'));
      await get().getfeeHead(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Fine Head'));
      return false;
    } finally {
      set({ loading: false });
    }
  },
  createScholarshipHead: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/scholarship-head/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Scholarship Head'));
      await get().getScholarshipHead(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Scholarship Head'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createPaymentMode: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/payment-mode/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Payment Mode'));
      await get().getPaymentMode(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Payment Mode'));
      return false;
    } finally {
      set({ loading: false });
    }
  },
  createReceiptSeries: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/receipt-series/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Receipt Series'));
      await get().getReceiptSeries(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Receipt Series'));
      return false;
    } finally {
      set({ loading: false });
    }
  },
  createBankAccount: async (payload: Record<string, any> | undefined): Promise<boolean> => {
    set({ loading: true });
    try {
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/bank-account/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Bank Account'));
      await get().getBankAccount(''); // Refresh after creation
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Bank Account'));
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateConcessiion: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      // Make sure you use the correct API URL
      const apiUrl = `${import.meta.env.VITE_API_URL}/concession-type/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Consession Type')); // Show success message
      await get().getconcession(''); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Consession Type')); // Show error message
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },
  updateReceiptSeries: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      // Make sure you use the correct API URL
      const apiUrl = `${import.meta.env.VITE_API_URL}/receipt-series/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Receipt Series')); // Show success message
      await get().getReceiptSeries(''); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Receipt Series')); // Show error message
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },

  updateBankAccount: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/bank-account/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Bank Account')); // Show success message
      await get().getBankAccount(''); // Refresh after update
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Bank Account')); // Show error message
      return false;
    } finally {
      set({ loading: false }); // Reset loading state
    }
  },
  updatePaymentMode: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/payment-mode/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Payment Mode')); // Show success message
      await get().getPaymentMode('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Payment Mode')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateFeeHead: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/fee-head/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Head Group')); // Show success message
      await get().getHeadGroup('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Head Group')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateFeesHead: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/fee-head-category/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Fee Head')); // Show success message
      await get().getfeeHead('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Fee Head')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateParentHead: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/parent-head/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Parent Head')); // Show success message
      await get().getParentHead('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Parent Head')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateScholarshipHead: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/scholarship-head/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Scholarship Head')); // Show success message
      await get().getScholarshipHead('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Scholarship Head ')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateFineHead: async (id: string, payload: CreateParentHeadPayloadIF): Promise<boolean> => {
    set({ loading: true });
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/fine-head/${id}`; // Use the correct endpoint
      await httpRequest('PUT', apiUrl, payload); // Sending the request
      useToastStore.getState().showToast('success', updateSuccessMessage('Fine Head')); // Show success message
      await get().getfeefine('');
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Fine Head')); // Show error message
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getBankAccount: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/bank-account?status=${status}`);
      if (!res.data.length) return true;

      set({ BankAccount: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getScholarshipHead: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/scholarship-head?status=${status}`);
      if (!res.data.length) return true;

      set({ ScholarshipHead: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getReceiptSeries: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/receipt-series?status=${status}`);
      if (!res.data.length) return true;

      set({ ReceiptSeries: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },


  getfeeSturatureReceiptSeries: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/receipt-series`);
      if (!res.data.length) return true;

      set({ ReceiptSeries: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },
  getPaymentMode: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/payment-mode?status=${status}`);
      if (!res.data.length) return true;

      set({ PaymentMode: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },
  getParentHead: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET',  `${import.meta.env.VITE_API_URL}/parent-head?status=${status || ''}`);
      if (!res.data.length) return true;
      console.log('res.data :>> ', res);
      set({ ParentHead: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getconcession: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/concession-type?status=${status}`);
      if (!res.data.length) return true;

      set({ concessionget: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getfeefine: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/fine-head?status=${status}`);
      if (!res.data.length) return true;

      set({ feefine: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getfeeHead: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/fee-head-category?status=${status}`);
      if (!res.data.length) return true;

      set({ feeHead: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getHeadGroup: async (status: string, firstRender = false): Promise<boolean> => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/fee-head?status=${status}`);
      if (!res.data.length) return true;

      set({ departments: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  getDepartment: async (id: string): Promise<boolean> => {
    set({ loading: true });
    try {
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department/${id}`);
      set({ department: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteDepartment: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/department/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Department'));
      await get().getParentHead(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Department'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deleteBankAccount: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/bank-account/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Bank Account'));
      await get().getBankAccount(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Bank Account'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deletePaymentMode: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/payment-mode/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Payment Mode'));
      await get().getPaymentMode(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Payment Mode'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deletefeereceipt: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/receipt-series/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Receipt Series'));
      await get().getReceiptSeries(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Receipt Series'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deleteFeeHead: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/fee-head/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Head Group'));
      await get().getHeadGroup(); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Head Group'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deleteParentHead: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/parent-head/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Parent Head'));
      await get().getParentHead(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Parent Head'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deleteConsessionType: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/concession-type/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Consession Type'));
      await get().getconcession(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Consession Type'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deletefeeHead: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/fee-head-category/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Fee Head'));
      await get().getfeeHead(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Fee Head'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  deleteFineHead: async (id: string): Promise<boolean> => {
    set({ deleting: id });
    try {
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/fine-head/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Fee Head'));
      await get().getfeefine(''); // Refresh after deletion
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Fee Head'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

}));

export default useDepartmentStore;
