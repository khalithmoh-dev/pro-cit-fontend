import { create } from "zustand";
import httpRequest from "../utils/functions/http-request";
import { useToastStore } from "./toastStore";
import {
  createErrorMessage,
  createSuccessMessage,
  deleteErrorMessage,
  deleteSuccessMessage,
  updateErrorMessage,
  updateSuccessMessage,
} from "../utils/functions/toast-message";

export interface Discount {
    discount_name: string;
    discount_type: string;
    value: number;
    applicable_course_id: string;
    applicable_department_id: string;
    applicable_category: string;
    description: string;
}


// Interface for creating a discount category
export interface createDiscountPayloadIF {
  name: string;
  discountStructuresCode: string;
  totalSemesters: number | null;
  discount: Discount[];
  student_category: string;
  course_year: string;
  admission_mode: string;
  department_id: string;
  course_id: string;
  eligible_students: string;
  value:string;
}

// Interface for the discount category data structure
export interface discountStructuresIF {
    discount_name: string;      
    discount_type: string;       
    value: number;               
    applicable_course_id: string; 
    applicable_department_id: string; 
    applicable_category: string; 
    eligible_students: string[]; 
    description: string;         
    _id: string;               
    createdAt: string;         
    updatedAt: string;          
}

// Interface representing the shape of the discount category store
interface DiscountStructuresState {
    discountStructures: discountStructuresIF[];
  discountStructure: discountStructuresIF | null;
  loading: boolean;
  createDiscount: (
    payload: createDiscountPayloadIF
  ) => Promise<boolean>;
  updateDiscount: (
    payload: createDiscountPayloadIF,
    id: string
  ) => Promise<boolean>;
  getDiscounts: () => Promise<boolean>;
  getDiscount: (id: string) => Promise<boolean>;
  deleteDiscount: (id: string) => Promise<boolean>;
}

const useDiscountStore = create<DiscountStructuresState>((set, get) => ({
    discountStructures: [],
  discountStructure: null,
  loading: false,

  // Create a new discount category
  createDiscount: async (payload) => {
    set({ loading: true });
    try {
      await httpRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/discount/create`,
        payload
      );
      useToastStore
        .getState()
        .showToast("success", createSuccessMessage("DiscountStructures"));
      await get().getDiscounts(); // Refresh discount category list after creation
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", createErrorMessage("DiscountStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing discount category
  updateDiscount: async (payload, id) => {
    set({ loading: true });
    try {
      await httpRequest(
        "PATCH",
        `${import.meta.env.VITE_API_URL}/discount/update/${id}`,
        payload
      );
      useToastStore
        .getState()
        .showToast("success", updateSuccessMessage("DiscountStructures"));
      await get().getDiscounts(); // Refresh discount category list after update
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", updateErrorMessage("DiscountStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get the list of all discount categories
  getDiscounts: async () => {
    set({ loading: true });
    try {
      const res = await httpRequest(
        "GET",
        `${import.meta.env.VITE_API_URL}/discount`
      );
      set({ discountStructures: res.data });
      return true;
    } catch (error) {
      set({ discountStructures: [] });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Get a specific discount category by its ID
  getDiscount: async (id) => {
    set({ loading: true });
    try {
      const res = await httpRequest(
        "GET",
        `${import.meta.env.VITE_API_URL}/discount/${id}`
      );
      set({ discountStructure: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Delete a specific discount category by its ID
  deleteDiscount: async (id) => {
    set({ loading: true });
    try {
      await httpRequest(
        "DELETE",
        `${import.meta.env.VITE_API_URL}/discount/${id}`
      );
      useToastStore
        .getState()
        .showToast("success", deleteSuccessMessage("DiscountStructures"));
      await get().getDiscounts(); // Refresh discount category list after deletion
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .showToast("error", deleteErrorMessage("DiscountStructures"));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  
}));

export default useDiscountStore;
