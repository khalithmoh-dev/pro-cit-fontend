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


export interface createInstallmentPayloadIF {
    name: string;
    fee_structure_id: string;
    student_id: string;
    total_amount: string;
    installment_amount: string;
    due_date: string;
    eligible_students: string;
    status: string;
    payment_date: string;
}

export interface installmentStructuresIF {
    name: string;
    // fee_structure_id: string;
    fee_structure_id: {
        _id: string;
        fee_structure_name: string;
      };
    student_id: {
        _id: string;
        firstName: string;
        middleName: string;
        lastName: string;
    };
    total_amount: string;
    installment_amount: string;
    fee_structure_name: string;
    due_date: string;
    eligible_students: string;
    status: string;
    payment_date: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

interface InstallmentStructuresState {
    installmentStructures: installmentStructuresIF[];
    installmentStructure: installmentStructuresIF | null;
    installmentData: installmentStructuresIF[];
    loading: boolean;
    createInstallment: (
        payload: createInstallmentPayloadIF
    ) => Promise<boolean>;
    updateInstallmentMark: (
        payload: createInstallmentPayloadIF,
        id: string
    ) => Promise<boolean>;
    updateInstallment: (
        payload: createInstallmentPayloadIF,
        id: string
    ) => Promise<boolean>;
    getInstallmentFeesStructure: (query?: any) => Promise<boolean>;
    deleteInstallment: (id: string) => Promise<boolean>;
}

export const accessToken = window.sessionStorage.getItem("accessToken");

export const jsonHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${accessToken || ""}`,
};

const useInstallmentStore = create<InstallmentStructuresState>((set, get) => ({
    installmentStructures: [],
    installmentData: [],
    installmentStructure: null,
    loading: false,



    createInstallment: async (payload) => {
        set({ loading: true });
        try {
            await httpRequest(
                "POST",
                `${import.meta.env.VITE_API_URL}/installment`,
                payload
            );
            useToastStore
                .getState()
                .showToast("success", createSuccessMessage("Installment"));
            await get().getInstallmentFeesStructure();
            return true;
        } catch (error) {
            useToastStore
                .getState()
                .showToast("error", createErrorMessage("Installment"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateInstallmentMark: async (payload, id) => {
        set({ loading: true });
        try {
            await httpRequest(
                "PATCH",
                `${import.meta.env.VITE_API_URL}/installment/mark-paid/${id}`,
                payload
            );
            useToastStore
                .getState()
                .showToast("success", updateSuccessMessage("Installment"));
            await get().getInstallmentFeesStructure();
            return true;
        } catch (error) {
            useToastStore
                .getState()
                .showToast("error", updateErrorMessage("Installment"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateInstallment: async (payload, id) => {
        set({ loading: true });
        try {
            await httpRequest(
                "PATCH",
                `${import.meta.env.VITE_API_URL}/installment/${id}`,
                payload
            );
            useToastStore
                .getState()
                .showToast("success", updateSuccessMessage("Installment"));
            await get().getInstallmentFeesStructure();
            return true;
        } catch (error) {
            useToastStore
                .getState()
                .showToast("error", updateErrorMessage("Installment"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getInstallmentFeesStructure: async (query = {}) => {
        const queryParams = new URLSearchParams(query).toString();
        set({ loading: true });

        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/installment/fee-structure?${queryParams}`);
            set({ installmentData: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteInstallment: async (id) => {
        set({ loading: true });
        try {
            await httpRequest(
                "DELETE",
                `${import.meta.env.VITE_API_URL}/installment/${id}`
            );
            useToastStore
                .getState()
                .showToast("success", deleteSuccessMessage("Installment"));
            await get().getInstallmentFeesStructure();
            return true;
        } catch (error) {
            useToastStore
                .getState()
                .showToast("error", deleteErrorMessage("Installment"));
            return false;
        } finally {
            set({ loading: false });
        }
    },


}));

export default useInstallmentStore;
