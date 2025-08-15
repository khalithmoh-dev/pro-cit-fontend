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

export interface CreateExamPayloadIF {
    startYear: number;
    endYear: number;
    term: string;
    totalMarks: string;
    name: string;
    subject: string;
}

export interface ExamIF {
    startYear: number;
    name: string;
    endYear: number;
    _id: string;
    term: string;
    totalMarks: string;
    subject: SubjectIF;
    createdAt: string;
    updatedAt: string;
}

interface ExamState {
    exams: ExamIF[];
    exam: ExamIF | null;
    selectedExam: ExamIF | null;
    setSelectedExam: (exam: ExamIF) => boolean;
    getExams: (filter: Record<string, unknown>) => Promise<boolean>;
    getExam: (id: string) => Promise<boolean>;
    createExam: (payload: CreateExamPayloadIF) => Promise<boolean>;
    deleteExam: (id: string, filter: Record<string, unknown>) => Promise<boolean>;
    updateExam: (id: string, payload: CreateExamPayloadIF) => Promise<boolean>;
}

type COPersist = (config: (set: any, get: any) => ExamState, options: PersistOptions<ExamState>) => any;

const useExamStore = create<ExamState>(
  (persist as COPersist)(
    (set, get) => ({
      exams: [],
      selectedExam: null,
      exam: null,
      setSelectedExam: (exam: ExamIF) => {
        set({ selectedExam: exam });
        return true;
      },

      getExams: async (filter: Record<string, unknown>) => {
        set({ exams: [] });
        const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/exam`, filter);
        set({ exams: res.data });
        return true;
      },

      getExam: async (id: string) => {
        set({ exam: null });
        const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/exam/${id}`);
        set({ exam: res.data });
        return true;
      },

      createExam: async (payload: CreateExamPayloadIF) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/exam/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Exam"));
            const filter = {
                startYear: payload.startYear,
                endYear: payload.endYear,
                subject: payload.subject
            }
            await get().getExams(filter); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Exam"));
            return false;
        }
      },

      updateExam: async (id, payload) => {
        try {
            await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/exam/update/${id}`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Exam"));
            const filter = {
                startYear: payload.startYear,
                endYear: payload.endYear,
                subject: payload.subject
            }
            //await get().getCO(filter); // Refresh after creation
            return true;
          } catch (error) {
            console.log("errr", error)
            useToastStore.getState().showToast("error", createErrorMessage("Exam"));
            return false;
          }
      },

      deleteExam: async (id, filter) => {
        try {
            const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/exam/${id}`);
            useToastStore.getState().showToast("success", createSuccessMessage("Exam"));
            await get().getCO(filter); // Refresh after creation
            return true;
          } catch (error) {
            return false;
          }
      },
    }),
    {
      name: "examStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        exams: state.exams,
        selectedExam: state.selectedExam,
        exam: null,
        getExam: state.getExam,
        setSelectedExam: state.setSelectedExam,
        getExams: state.getExams,
        createExam: state.createExam,
        deleteExam: state.deleteExam,
        updateExam: state.updateExam
      }),
    }
  )
);

export default useExamStore;
