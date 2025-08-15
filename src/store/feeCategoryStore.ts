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
} from "../utils/functions/toast-message";
import { installmentStructuresIF } from "./installmentStore";
import { SelectOptionIF } from "../interface/component.interface";

export interface Fee {
  category_name: string;
  amount: string;
  duration_type: string;
  is_mandatory: boolean;
  applicable_semesters: number[];
  applicable_year: number[];
}


// Interface for creating a fee category
export interface createFeeStructuresPayloadIF {
  name: string;
  feeStructuresCode: string;
  fee_structure_name: string;
  totalSemesters: number | null;
  fees: Fee[];
  course_year: string;
  admission_mode: string;
  // department_id: string;
  // course_id: string;
  department_id: {
    _id: string;
    name: string;
    departmentCode: string;
  };
  course_id: {
    _id: string;
    course_name: string;
    duration: number;
  };
  eligible_students: string;
  _id: string;
}

// Interface for the fee category data structure
export interface feeStructuresIF {
  _id: string;
  department_id: {
    _id: string;
    name: string;
    departmentCode: string;
  };
  course_id: {
    _id: string;
    course_name: string;
    duration: number;
  };
  eligible_students: {
    _id: string;
    firstName: string;
  };
  fees: [
    {
      category_name: string;
      amount: number;
      duration_type: string;
      is_mandatory: boolean;
      applicable_semesters: number[];
      applicable_year: number[];
      _id: string;
    }
  ];
  fee_structure_name: string;
  course_year: string;
  admission_mode: string;
  total_fee: number;
  createdAt: string;
  updatedAt: string;
}



interface PaymentHistory {
  _id: string;
  fee_structure_id: string;
  student_id: string;
  category_name: string;
  amount_paid: number;
  remaining_balance: number;
  payment_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaymentStatus {
  feeStructure: feeStructuresIF;
  paymentHistories: PaymentHistory[];
  status: string;
}

// Interface representing the shape of the fee category store
interface FeeStructuresState {
  feeStructures: feeStructuresIF[];
  feeStructure: feeStructuresIF | null;
  feeStructureStudent: PaymentStatus | null;
  feeStructuresOptions: SelectOptionIF[];
  loading: boolean;
  createFeeStructures: (
    payload: createFeeStructuresPayloadIF
  ) => Promise<boolean>;
  updateFeeStructures: (
    payload: createFeeStructuresPayloadIF,
    id: string
  ) => Promise<boolean>;
  getFeeStructures: () => Promise<boolean>;
  getFeeStructure: (id: string) => Promise<boolean>;
  // getFeeStructureByStudent: (id: string) => Promise<boolean>;
  getFeeStructureByStudent: (query?: any) => Promise<boolean>;
  deleteFeeStructures: (id: string) => Promise<boolean>;
}

const useFeeStructuresStore = create<FeeStructuresState>((set, get) => ({
  feeStructures: [],
  feeStructure: null,
  feeStructureStudent: null,
  feeStructuresOptions: [],
  loading: false,

  // Create a new fee category
  createFeeStructures: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/fee-structure/create`,
        payload
      );
      useToastStore
        .getState()
        .showToast("success", createSuccessMessage("FeeStructures"));
      await get().getFeeStructures(); // Refresh fee category list after creation
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", createErrorMessage("FeeStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing fee category
  updateFeeStructures: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest(
        "PATCH",
        `${import.meta.env.VITE_API_URL}/fee-structure/${id}`,
        payload
      );
      useToastStore
        .getState()
        .showToast("success", updateSuccessMessage("FeeStructures"));
      await get().getFeeStructures(); // Refresh fee category list after update
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", updateErrorMessage("FeeStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get the list of all fee categories
  getFeeStructures: async () => {
    set({ loading: true });
    try {
      const res = await httpRequest(
        "GET",
        `${import.meta.env.VITE_API_URL}/fee-structure`
      );
      const options = res.data.map((category: installmentStructuresIF) => {
        return {
          label: category.fee_structure_name,
          value: category._id,
        };
      });
      set({ feeStructures: res.data, feeStructuresOptions: options });
      return true;
    } catch (error) {
      set({ feeStructures: [] });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get a specific fee category by its ID
  getFeeStructure: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest(
        "GET",
        `${import.meta.env.VITE_API_URL}/fee-structure/${id}`
      );
      set({ feeStructure: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getFeeStructureByStudent: async (query = {}) => {
    const queryParams = new URLSearchParams(query).toString();

    set({ loading: true });
    try {
      const res = await httpRequest(
        "GET",
        `${import.meta.env.VITE_API_URL}/fee-structure/student-fee-structures?${queryParams}`
      );
      set({ feeStructureStudent: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Delete a specific fee category by its ID
  deleteFeeStructures: async (id) => {
    set({ loading: true });
    try {
      await httpRequest(
        "DELETE",
        `${import.meta.env.VITE_API_URL}/fee-structure/${id}`
      );
      useToastStore
        .getState()
        .showToast("success", deleteSuccessMessage("FeeStructures"));
      await get().getFeeStructures(); // Refresh fee category list after deletion
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", deleteErrorMessage("FeeStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFeeStructuresStore;
