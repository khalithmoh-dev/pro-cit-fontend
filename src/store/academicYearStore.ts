import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

// Interface Definitions
export interface CreateAcademicYearPayload {
    academicYearCode: string;
    academicYearNm: string;
    startDate: string;
    endDate: string;
    desc?: string;
    _id?: string;
}

export interface AcademicYearIF {
    _id: string;
    insId: string;
    academicYearCode: string;
    academicYearNm: string;
    startDate: string;
    endDate: string;
    desc?: string;
    insName?: string;
}

interface AcademicYearState {
    academicYearList: AcademicYearIF[];
    createAcademicYear: (payload: CreateAcademicYearPayload) => Promise<{ success: boolean; error?: string }>;
    getAcademicYearById: (id: string) => Promise<AcademicYearIF | boolean>;
    getAcademicYears: () => Promise<{ data: AcademicYearIF[] } | boolean>;
    updateAcademicYear: (payload: CreateAcademicYearPayload) => Promise<{ success: boolean; error?: string }>;
}

// Academic Year Store
const useAcademicYearStore = create<AcademicYearState>((set, get) => ({
    academicYearList: [],

    createAcademicYear: async (oPayload) => {
        try {
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/academic-year/create`, oPayload);
            return { success: true };
        } catch (error: any) {
            console.error('Create academic year error:', error);

            // Extract error message from response
            let errorMessage = 'Failed to create academic year';

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    },

    getAcademicYearById: async (id = '') => {
        try {
            return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/academic-year/get-by-id/${id}`))?.data;
        } catch (error: any) {
            console.error('Get academic year by ID error:', error);
            return false;
        }
    },

    getAcademicYears: async () => {
        try {
            const aAcademicYearList = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/academic-year/get-all-academic-years`);
            return aAcademicYearList?.data;
        } catch (error: any) {
            console.error('Get academic years error:', error);
            return false;
        }
    },

    updateAcademicYear: async (oPayload) => {
        try {
            const id = oPayload._id;
            delete oPayload._id;
            await httpRequest('POST', `${import.meta.env.VITE_API_URL}/academic-year/update/${id}`, oPayload);
            return { success: true };
        } catch (error: any) {
            console.error('Update academic year error:', error);

            // Extract error message from response
            let errorMessage = 'Failed to update academic year';

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }
}));

export default useAcademicYearStore;