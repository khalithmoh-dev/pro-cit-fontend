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
import { COIF } from "./co.store";

export interface Question {
    [x: string]: any;
    questionNumber: string;
    question: string;
    co: COIF[];
    maxMarks: number;
}

export interface CreateQuestionPaperPayloadIF {
    exam: string;
    description: string;
    startYear: number;
    endYear: number;
    questions: Question[];
}

export interface QuestionPaperIF {
    exam: string;
    description: string;
    questions: Question[];
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface QuestionPaperState {
    questionPapers: QuestionPaperIF[];
    questionPaper: QuestionPaperIF | null;
    createQuestionPaper: (payload: CreateQuestionPaperPayloadIF) => Promise<boolean>;
    updateQuestionPaper: (id: string, payload: CreateQuestionPaperPayloadIF) => Promise<boolean>;
    deleteQuestionPaper: (id: string, examId: string) => Promise<boolean>;
    getQuestionPaper: (id: string) => Promise<boolean>;
    getQuestionPapers: (query: Record<string, string>) => Promise<boolean>;
}


type COPersist = (config: (set: any, get: any) => QuestionPaperState, options: PersistOptions<QuestionPaperState>) => any;

const useQuestionPaperStore = create<QuestionPaperState>(
  (persist as COPersist)(
    (set, get) => ({
      questionPaper: null,
      questionPapers: [],
      getQuestionPapers: async (query: Record<string, string>) => {
        try {
            set({ questionPapers: [] });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/question-paper?exam=${query.exam}`);
            set({ questionPapers: res.data });
            return true;
          } catch (error) {
            return false;
          }
      },

      getQuestionPaper: async (id: string) => {
        try {
            set({ questionPaper: null });
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/question-paper/${id}`);
            set({ questionPaper: res.data });
            return true;
          } catch (error) {
            return false;
          }
      },

      createQuestionPaper: async (payload) => {
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/question-paper/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Question Paper"));
            const query = {
                exam: payload.exam
            };
            await get().getQuestionPapers(query); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO"));
            return false;
        }
      },

      updateQuestionPaper: async (id, payload) => {
        try {
            await httpRequest("PUT", `${import.meta.env.VITE_API_URL}/question-paper/update/${id}`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Question Paper"));
            const query = {
                exam: payload.exam
            };
            await get().getQuestionPapers(query); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("CO"));
            return false;
        }
      },

      deleteQuestionPaper: async (id, examId) => {
        try {
            const res = await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/question-paper/delete/${id}`);
            useToastStore.getState().showToast("success", createSuccessMessage("Question Paper"));
            const query = {
                exam: examId
            };
            await get().getQuestionPapers(query); // Refresh after creation
            return true;
          } catch (error) {
            return false;
          }
      }
    }),
    {
      name: "questionPaperStore", // Unique name for localStorage
      // Correct the Category for partialize
      partialize: (state) => ({
        questionPapers: state.questionPapers,
        questionPaper: state.questionPaper,
        createQuestionPaper: state.createQuestionPaper,
        updateQuestionPaper: state.updateQuestionPaper,
        deleteQuestionPaper: state.deleteQuestionPaper,
        getQuestionPaper: state.getQuestionPaper,
        getQuestionPapers: state.getQuestionPapers,
      }),
    }
  )
);

export default useQuestionPaperStore;
