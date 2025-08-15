import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
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
import { DepartmentIF } from "./departmentStore";

export interface CreatePOPayload {
  ID: string;
  id?: string;
  outcome: string;
  orderNumber: number;
  isPSO: boolean;
  startYear: number;
  endYear: number;
}

export interface PO {
    _id: string;
    ID: string;
    outcome: string;
    orderNumber: number;
    isPSO: boolean;
    startYear: number;
    endYear: number;
}



export interface CreatePEOPayload {
    id?: string;
    ID: string;
    objective: string;
    orderNumber: number;
}

export interface PEO {
    _id: string;
    ID: string;
    objective: string;
    orderNumber: number;
}

export interface OutcomeCount {
    department: DepartmentIF;
    PO: number;
    PSO: number;
    PEO: number;
}


interface OutcomeState {
  outcomeCount: OutcomeCount[];
  PO: PO[];
  selectedPO: PO | null;
  selectedPEO: PEO | null;
  PEO: PEO[];
  createPO: (payload: CreatePOPayload, departmentId: string, startYear: number, endYear: number) => Promise<boolean>;
  createPEO: (payload: CreatePEOPayload, departmentId: string) => Promise<boolean>;
  getPOById: (id: string) => Promise<boolean>;
  getPEOById: (id: string) => Promise<boolean>;
  updatePO: (payload: CreatePOPayload, id: string, departmentId: string, startYear: number, endYear: number) => Promise<boolean>;
  updatePEO: (payload: CreatePEOPayload, id: string, departmentId: string) => Promise<boolean>;
  getOutcomeCount: (startYear: number, endYear: number) => Promise<boolean>;
  getPO: (id: string, startYear: number, endYear: number) => Promise<boolean>;
  getPEO: (id: string) => Promise<boolean>;
  deletePO: (id: string, departmentId: string, startYear: number, endYear: number) => Promise<boolean>;
  deletePEO: (id: string, departmentId: string) => Promise<boolean>;
}

type OutcomePersist = (
  config: (set: any, get: any) => OutcomeState,
  options: PersistOptions<OutcomeState>
) => any;

const useOutcomeStore = create<OutcomeState>(
  (persist as OutcomePersist)(
    (set, get) => ({
      outcomeCount: [],
      PO: [],
      PEO: [],
      selectedPEO: null,
      selectedPO: null,

      getPOById: async (id: string) => {
        try {
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/outcome/PO/${id}`);
          console.log("res", res.data);
          set({ selectedPO: res.data });
          return true;
        } catch (error) {
          return false;
        }
      },

      getPEOById: async (id: string) => {
        try {
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/outcome/PEO/${id}`);
          console.log("res", res.data);
          set({ selectedPEO: res.data });
          return true;
        } catch (error) {
          return false;
        }
      },

      createPO: async (payload: CreatePOPayload, departmentId: string, startYear: number, endYear: number) => {
        try {
          await httpRequest("POST", `${import.meta.env.VITE_API_URL}/outcome/create/PO`, payload);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          
          await get().getPO(departmentId, startYear, endYear); // Refresh after creation
          return true;
        } catch (error) {
          useToastStore.getState().showToast("error", createErrorMessage("Department"));
          return false;
        }
      },
      createPEO: async (payload, departmentId) => {
        try {
          await httpRequest("POST", `${import.meta.env.VITE_API_URL}/outcome/create/PEO`, payload);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          await get().getPEO(departmentId); // Refresh after creation
          return true;
        } catch (error) {
          useToastStore.getState().showToast("error", createErrorMessage("Department"));
          return false;
        }
      },
      updatePO: async (payload, id, departmentId, startYear, endYear) => {
        try {
          await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/outcome/update/PO/${id}`, payload);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          await get().getPO(departmentId, startYear, endYear); // Refresh after creation
          return true;
        } catch (error) {
          useToastStore.getState().showToast("error", createErrorMessage("Department"));
          return false;
        }
      },
      updatePEO: async (payload, id, departmentId) => {
        try {
          await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/outcome/update/PEO/${id}`, payload);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          await get().getPEO(departmentId); // Refresh after creation
          return true;
        } catch (error) {
          useToastStore.getState().showToast("error", createErrorMessage("Department"));
          return false;
        }
      },
      getOutcomeCount: async (startYear: number, endYear: number) => {
        try {
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/outcome/count?startYear=${startYear}&endYear=${endYear}`);
          set({ outcomeCount: res.data });
          return true;
        } catch (error) {
          return false;
        }
      },
      getPO: async (id: string, startYear: number, endYear: number) => {
        try {
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/outcome/PO?department=${id}&startYear=${startYear}&endYear=${endYear}`);
          console.log("res", res.data);
          set({ PO: res.data });
          return true;
        } catch (error) {
          return false;
        }
      },
      getPEO: async (id: string) => {
        try {
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/outcome/PEO?department=${id}`);
          console.log("PEO res", res.data);
          set({ PEO: res.data });
          return true;
        } catch (error) {
          return false;
        }
      },
      deletePO: async (id: string, departmentId: string, startYear: number, endYear: number) => {
        try {
          const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/outcome/delete/PO/${id}`);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          await get().getPO(departmentId, startYear, endYear); // Refresh after creation
          return true;
        } catch (error) {
          return false;
        }
      },
      deletePEO: async (id: string, departmentId: string) => {
        try {
          const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/outcome/delete/PEO/${id}`);
          useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
          await get().getPEO(departmentId); // Refresh after creation
          return true;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: "outcomeStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        outcomeCount: state.outcomeCount,
        PO: [],
        PEO: [],
        selectedPO: state.selectedPO,
        selectedPEO: state.selectedPEO,
        createPO: state.createPO,
        createPEO: state.createPEO,
        updatePO: state.updatePO,
        updatePEO: state.updatePEO,
        getOutcomeCount: state.getOutcomeCount,
        getPO: state.getPO,
        getPEO: state.getPEO,
        deletePO: state.deletePO,
        deletePEO: state.deletePEO,
        getPOById: state.getPEOById,
        getPEOById: state.getPEOById
      }),
    }
  )
);

export default useOutcomeStore;
