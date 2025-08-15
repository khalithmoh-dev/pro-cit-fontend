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
import { SelectOptionIF } from "../interface/component.interface";

export interface createCategoryPayloadIF {
    name: string;
    description: string;
}

export interface CategoriesIF {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
}

interface CategoryState {
    categories: CategoriesIF[];
    categoriesOptions: SelectOptionIF[];
    category: CategoriesIF | null;
    deleting: string;
    loading: boolean;
    initialLoading: boolean;
    createCategory: (payload: createCategoryPayloadIF) => Promise<boolean>;
    updateCategory: (payload: createCategoryPayloadIF, id: string) => Promise<boolean>;
    getAllCategories: (firstRender?: boolean) => Promise<boolean>;
    getCategory: (id: string) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
}

const useCategoriesStore = create<CategoryState>((set, get) => ({
    categories: [],
    categoriesOptions: [],
    category: null,
    deleting: "",
    loading: false,
    initialLoading: false,

    createCategory: async (payload) => {
        set({ loading: true });
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/category/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Category"));
            await get().getAllCategories(); // Refresh after creation
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Category"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateCategory: async (payload, id) => {
        set({ loading: true });
        try {
            await httpRequest("PATCH", `${import.meta.env.VITE_API_URL}/category/update/${id}`, payload);
            useToastStore.getState().showToast("success", updateSuccessMessage("Category"));
            await get().getAllCategories(); // Refresh after update
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", updateErrorMessage("Category"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getAllCategories: async (firstRender) => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/category`);
            if (!res.data.length) return true;
            const options = res.data.map((category: CategoriesIF) => {
                return {
                    label: category.name,
                    value: category._id,
                };
            });
            set({ categories: res.data, categoriesOptions: options });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getCategory: async (id) => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/category/${id}`);
            set({ category: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteCategory: async (id) => {
        set({ deleting: id });
        try {
            await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/category/delete/${id}`);
            useToastStore.getState().showToast("success", deleteSuccessMessage("Category"));
            await get().getAllCategories(); // Refresh after deletion
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", deleteErrorMessage("Category"));
            return false;
        } finally {
            set({ deleting: "" });
        }
    },
}));

export default useCategoriesStore;
