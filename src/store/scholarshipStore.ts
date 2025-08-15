import { create } from "zustand";
import httpRequest from "../utils/functions/http-request";
import { createErrorMessage, createSuccessMessage, deleteErrorMessage, deleteSuccessMessage, updateErrorMessage, updateSuccessMessage } from "../utils/functions/toast-message";
import { useToastStore } from "./toastStore";




export interface createScholarshipsPayloadIf {
    name: string;
    student: string;
    amount: number;
    description: string;
}


export interface ScholarshipsIF {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    amount: string;
    description: number;
}


interface ScholarshipState {
    scholarships: ScholarshipsIF[];
    scholarship: ScholarshipsIF | null;
    loading: boolean,
    createScholarship: (payload: createScholarshipsPayloadIf) => Promise<boolean>
    updateScholarship: (payload: createScholarshipsPayloadIf, id: string) => Promise<boolean>
    getScholarships: () => Promise<boolean>
    getScholarship: (id: string) => Promise<boolean>
    deleteScholarship: (id: string) => Promise<boolean>
}



const useScholarshipStore = create<ScholarshipState>((set, get) => ({
    scholarships: [],
    scholarship: null,
    loading: false,

    createScholarship: async (payload) => {
        set({ loading: true })
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/scholarship/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Scholarships"));
            await get().getScholarships(); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Scholarships"));
            return false;
        } finally {
            set({ loading: false });
        }
    },
    updateScholarship: async (payload, id) => {
        set({ loading: true });
        try {
            await httpRequest("PATCH", `${import.meta.env.VITE_API_URL}/scholarships/update/${id}`, payload);
            useToastStore.getState().showToast("success", updateSuccessMessage("Scholarships"));
            await get().getScholarships(); // Refresh after update
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", updateErrorMessage("Scholarships"));
            return false;
        } finally {
            set({ loading: false });
        }
    },
    getScholarships: async () => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/scholarships/`);
            if (!res.data.length) return true

            set({ scholarships: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getScholarship: async (id) => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/scholarships/${id}`);
            set({ scholarship: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteScholarship: async (id) => {
        set({ loading: true });
        try {
            await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/scholarships/${id}`);
            useToastStore.getState().showToast("success", deleteSuccessMessage("Scholarships"));
            await get().getScholarships(); // Refresh after deletion
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", deleteErrorMessage("Scholarships"));
            return false;
        } finally {
            set({ loading: false });
        }
    },
}))

export default useScholarshipStore