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

export interface COAttainment {
    [key: string]: number;
}

export interface POAttainment {
    [key: string]: number;
}

interface AttainmentState {
    subjectWiseCoAttainment: COAttainment | null;
    examWiseCoAttainment: COAttainment | null;
    subjectWisePoPsoAttainment: POAttainment | null;
    getSubjectWiseCoAttainment: (subjectId: string) => Promise<boolean>;
    getExamWiseCoAttainment: (subjectId: string) => Promise<boolean>;
    getSubjectWisePoPsoAttainment: (subjectId: string) => Promise<boolean>;
}

type COPersist = (config: (set: any, get: any) => AttainmentState, options: PersistOptions<AttainmentState>) => any;

const useAttainmentStore = create<AttainmentState>(
  (persist as COPersist)(
    (set, get) => ({
        examWiseCoAttainment: null,
        subjectWiseCoAttainment: null,
        subjectWisePoPsoAttainment: null,
        getMarks: async (filter: Record<string, unknown>) => {
            set({ marks: [] });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/marks`, filter);
            set({ marks: res.data });
            return true;
        },

        getSubjectWiseCoAttainment: async (subjectId: string) => {
            set({ subjectWiseCoAttainment: null });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/attainment/co/subject?subjectId=${subjectId}`);
            set({ subjectWiseCoAttainment: res.data });
            return true;
        },

        getExamWiseCoAttainment: async (examId: string) => {
            set({ examWiseCoAttainment: null });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/attainment/co/exam?examId=${examId}`);
            set({ examWiseCoAttainment: res.data });
            return true;
        },

        getSubjectWisePoPsoAttainment: async (subjectId: string) => {
            set({ subjectWisePoPsoAttainment: null });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/attainment/po?subjectId=${subjectId}`);
            set({ subjectWisePoPsoAttainment: res.data });
            return true;
        },
    }),
    {
      name: "marksStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        subjectWiseCoAttainment: state.subjectWiseCoAttainment,
        examWiseCoAttainment: state.examWiseCoAttainment,
        subjectWisePoPsoAttainment: state.subjectWisePoPsoAttainment,
        getExamWiseCoAttainment: state.getExamWiseCoAttainment,
        getSubjectWiseCoAttainment: state.getSubjectWiseCoAttainment,
        getSubjectWisePoPsoAttainment: state.getSubjectWisePoPsoAttainment
      }),
    }
  )
);

export default useAttainmentStore;
