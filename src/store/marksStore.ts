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

export interface MarksIF {
    question: string;
    obtainedMarks: string;
}

export interface CreateMarksPayloadIF {
    questionPaper: string;
    student: string;
    isAbsent: boolean;
    marks: MarksIF[];
}

export interface MarksIF {
    _id: string;
    questionPaper: string;
    student: string;
    isAbsent: boolean;
    marks: MarksIF[];
    createdAt: string;
    updatedAt: string;
}

interface MarksState {
    marks: MarksIF[];
    mark: MarksIF | null;
    getMarksTemplate: (filter: Record<string, unknown>) => Promise<boolean>;
    getMarks: (filter: Record<string, unknown>) => Promise<boolean>;
    getMark: (id: string) => Promise<boolean>;
    createMark: (payload: CreateMarksPayloadIF[]) => Promise<boolean>;
    deleteMark: (id: string, filter: Record<string, unknown>) => Promise<boolean>;
    updateMark: (id: string, payload: CreateMarksPayloadIF[]) => Promise<boolean>;
}

type COPersist = (config: (set: any, get: any) => MarksState, options: PersistOptions<MarksState>) => any;

const useMarksStore = create<MarksState>(
  (persist as COPersist)(
    (set, get) => ({
      mark: null,
      marks: [],
      getMarks: async (filter: Record<string, unknown>) => {
        set({ marks: [] });
        const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/marks`, filter);
        set({ marks: res.data });
        return true;
      },

      getMarksTemplate: async (filter: Record<string, unknown>) => {
        set({ marks: [] });
        console.log("filter", filter);
        const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/marks/template?questionPaperId=${filter.questionPaper}`, filter);
        set({ marks: res.data });
        const file = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Create a download link
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = 'marks_report.xlsx';
        
        // Append link, trigger click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Revoke the object URL after download
        window.URL.revokeObjectURL(link.href);
        return true;
      },

      getMark: async (id: string) => {
        set({ mark: null });
        const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/marks/${id}`);
        set({ mark: res.data });
        return true;
      },

      createMark: async (payload: CreateMarksPayloadIF[]) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/marks/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Exam"));
            const filter = {
                questionPaper: payload[0].questionPaper
            }
            await get().getMarks(filter); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Exam"));
            return false;
        }
      },

      updateMark: async (id, payload) => {
        try {
            await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/co/${id}`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Exam"));
            const filter = {
                questionPaper: payload[0].questionPaper
            }
            await get().getMarks(filter); // Refresh after creation
            return true;
          } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Exam"));
            return false;
          }
      },

      deleteMark: async (id, filter) => {
        try {
            const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/mark/${id}`);
            useToastStore.getState().showToast("success", createSuccessMessage("Mark"));
            await get().getMark(filter); // Refresh after creation
            return true;
          } catch (error) {
            return false;
          }
      },
    }),
    {
      name: "marksStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        mark: state.mark,
        marks: state.marks,
        getMark: state.getMark,
        getMarks: state.getMarks,
        updateMark: state.updateMark,
        deleteMark: state.deleteMark,
        createMark: state.createMark,
        getMarksTemplate: state.getMarksTemplate
      }),
    }
  )
);

export default useMarksStore;
