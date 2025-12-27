import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';

import {
    createErrorMessage,
    createSuccessMessage,
    updateErrorMessage,
    updateSuccessMessage,
} from '../utils/functions/toast-message';

// Interface Definitions
export interface SemesterConfigFilterIF {
    insId: string;
    degId: string;
    prgId: string;
    acYr: string;
}

export interface CreateSemesterConfigPayload {
    insId: string;
    degId: string;
    prgId: string;
    acYr: string
    semId: string
    startDate: string
    endDate: string
    desc?: string;
    _id?: string;
}

export interface SemesterConfigIF {
    _id: string;
    insId: string;
    degId: string;
    prgId: string;
    semesterId: string;
    insName: string;
    degreeNm: string;
    programNm: string;
    academicYearNm: string;
    semesterNm: string;
    semesterCode: string;
    startDate: string;
    endDate: string;
    desc?: string;
    acYr: string;
    semId: string;
}

interface SemesterConfigState {
    semesterConfigList: SemesterConfigIF[];
    getSemesterConfigurations: (filters: SemesterConfigFilterIF) => Promise<{ data: SemesterConfigIF[] } | boolean>;
    createSemesterConfig: (payload: CreateSemesterConfigPayload) => Promise<{ success: boolean; error?: string }>;
    updateSemesterConfig: (payload: CreateSemesterConfigPayload) => Promise<{ success: boolean; error?: string }>;
    createOrUpdateSemConfig: (payload: CreateSemesterConfigPayload[]) => Promise<{ success: boolean }>;
}

// Semester Configuration Store
const useSemesterConfigStore = create<SemesterConfigState>((set, get) => ({
    semesterConfigList: [],

    getSemesterConfigurations: async (filters) => {
        try {
            const response = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/semester-config/get-semester-configurations`, filters);
            set({ semesterConfigList: response?.data?.data || [] });
            return response?.data;
        } catch (error: any) {
            console.error('Get semester configurations error:', error);
            return false;
        }
    },

    createSemesterConfig: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/semester-config/create`, oPayload);
            useToastStore.getState().showToast('success', createSuccessMessage('Semester Configuration'));
            return { success: true };
        } catch (error: any) {
            useToastStore.getState().showToast('error', createErrorMessage('Semester Configuration'));

            return {
                success: false
            };
        }
    },

    updateSemesterConfig: async (oPayload) => {
        try {
            const id = oPayload._id;
            delete oPayload._id;
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/semester-config/update/${id}`, oPayload);
            useToastStore.getState().showToast('success', updateSuccessMessage('Semester Configuration'));
            return { success: true };
        } catch (error: any) {
            useToastStore.getState().showToast('error', updateErrorMessage('Semester Configuration'));
            return {
                success: false
            };
        }
    },

    createOrUpdateSemConfig: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/semester-config/create-update-sem-config`, oPayload);
            useToastStore.getState().showToast('success', 'Semester Configuration Apply to all the semesters successfully');
            return { success: true };
        } catch (error: any) {
            useToastStore.getState().showToast('error', 'Failed to Apply Semester Configuration to all the semesters');
            return {
                success: false
            };
        }
    },
}));

export default useSemesterConfigStore;
