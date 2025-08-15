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
import { SubjectIF } from "./subjectStore";
import { PO } from "./outcomeStore";

export interface createCOPayloadIF {
    co_id: string;
    description: string;
    subject: string;
} 

export interface RatingsIF {
    _id: string;
    co: COIF;
    po: PO;
    rating: number;
    justification: string;
}

export interface COIF {
    _id: string;
    co_id: string;
    description: string;
    subject: string;
    matrixEntries: RatingsIF[];
    createdAt: string;
    updatedAt: string;
}

export interface addRatingsPayloadIF {
    co: string;
    po: string;
    rating: number;
}

interface COState {
    COs: COIF[];
    selectedCO: COIF | null;
    getCOById: (id: string) => Promise<boolean>;
    selectedSubject: SubjectIF | null; 
    setSelectedSubject: (subject: SubjectIF) => boolean;
    createCO: (payload: createCOPayloadIF, selectedSubject: string) => Promise<boolean>;
    deleteCO: (id: string, selectedSubject: string) => Promise<boolean>;
    updateCO: (id: string, payload: createCOPayloadIF, selectedSubject: string) => Promise<boolean>;
    addRatings: (ratings: addRatingsPayloadIF, selectedSubject: string) => Promise<boolean>;
    getCO: (subjectId: string) => Promise<boolean>;
}

type COPersist = (config: (set: any, get: any) => COState, options: PersistOptions<COState>) => any;

const useCOStore = create<COState>(
  (persist as COPersist)(
    (set, get) => ({
      COs: [],
      selectedSubject: null, 
      selectedCO: null,

      getCOById: async (id: string) => {
        try {
          set({ selectedCO: null });
          const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/co/${id}`);
          set({ selectedCO: res.data });
          // set({ selectedSubject: subjectId });
          return true;
        } catch (error) {
          return false;
        }
      },

      setSelectedSubject: (subject: SubjectIF) => {
        set({ selectedSubject: subject });
        console.log(subject);
        return true;
      },

      getCO: async (subjectId) => {
        try {
            set({ COs: [] });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/co/ratings?subject=${subjectId}`);
            set({ COs: res.data });
            // set({ selectedSubject: subjectId });
            return true;
          } catch (error) {
            return false;
          }
      },
      
      createCO: async (payload, selectedSubject) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/co/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("CO"));
            await get().getCO(selectedSubject); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO"));
            return false;
        }
      },

      deleteCO: async (id, selectedSubject) => {
        try {
            const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/co/${id}`);
            useToastStore.getState().showToast("success", createSuccessMessage("Outcome"));
            await get().getCO(selectedSubject); // Refresh after creation
            return true;
          } catch (error) {
            return false;
          }
      },

      updateCO: async (id, payload, selectedSubject) => {
        try {
            await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/co/update/${id}`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("CO"));
            await get().getCO(selectedSubject); // Refresh after creation
            return true;
          } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO"));
            return false;
          }
      },

      addRatings: async (payload, selectedSubject) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/co-po-pso-matrix/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("CO"));
            await get().getCO(selectedSubject); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO"));
            return false;
        }
      }
    }),
    {
      name: "coStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        COs: state.COs,
        selectedSubject: null,
        setSelectedSubject: state.setSelectedSubject,
        createCO: state.createCO,
        deleteCO: state.deleteCO,
        updateCO: state.updateCO,
        addRatings: state.addRatings,
        getCO: state.getCO,
        selectedCO: state.selectedCO,
        getCOById: state.getCOById
      }),
    }
  )
);

export default useCOStore;
