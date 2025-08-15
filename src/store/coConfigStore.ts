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

export interface createCOConfigPayloadIF {
    subject: SubjectIF;
    internalExamWeightage: number;
    externalExamWeightage: number;
    directCOWeightage: number;
    indirectCOWeightage: number;
    level1Attainment: number;
    level2Attainment: number;
    level3Attainment: number;
}

export interface COConfigIF {
    _id?: string;
    subject: SubjectIF;
    internalExamWeightage: number;
    externalExamWeightage: number;
    directCOWeightage: number;
    indirectCOWeightage: number;
    level1Attainment: number;
    level2Attainment: number;
    level3Attainment: number;
    createdAt: string;
    updatedAt: string;
}


interface COConfigState {
    coConfig: COConfigIF | null;
    getCOConfig: (id: string) => Promise<boolean>;
    createCOConfig: (payload: createCOConfigPayloadIF) => Promise<boolean>;
    updateCOConfig: (id: string, payload: createCOConfigPayloadIF) => Promise<boolean>;
    // getCOConfig: (subjectId: string) => Promise<boolean>;
}

type COConfigPersist = (config: (set: any, get: any) => COConfigState, options: PersistOptions<COConfigState>) => any;

const useCOConfigStore = create<COConfigState>(
  (persist as COConfigPersist)(
    (set, get) => ({
      coConfig: null,

      getCOConfig: async (subjectId: string) => {
        try {
            set({ coConfig: null });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/co-config?subject=${subjectId}`);
            set({ coConfig: res.data[0] });
            // set({ selectedSubject: subjectId });
            return true;
          } catch (error) {
            return false;
          }
      },

      createCOConfig: async (payload) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/co-config/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("CO Config"));
            await get().getCOConfig(payload.subject); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO Config"));
            return false;
        }
      },

      updateCOConfig: async (id, payload) => {
        try {
            await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/co-config/update/${id}`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("CO Config"));
            await get().getCOConfig(payload.subject); // Refresh after creation
            return true;
          } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO Config"));
            return false;
          }
      },
    }),
    {
      name: "coConfigStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        coConfig: state.coConfig,
        createCOConfig: state.createCOConfig,
        updateCOConfig: state.updateCOConfig,
        getCOConfig: state.getCOConfig
      }),
    }
  )
);

export default useCOConfigStore;
