import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import { updateErrorMessage, updateSuccessMessage } from '../utils/functions/toast-message';

// Interface for the fee category data structure
export interface feeStructuresIF {
    map(arg0: (feeStructure: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    length: number;
    _id: string;
    department_id: {
        _id: string;
        name: string;
        departmentCode: string;
    };
    course_id: {
        _id: string;
        course_name: string;
        duration: number;
    };
    eligible_students: {
        _id: string;
        firstName: string;
    };
    fees: [
        {
            category_name: string;
            amount: number;
            duration_type: string;
            is_mandatory: boolean;
            applicable_semesters: number[];
            applicable_year: number[];
            _id: string;
        }
    ];
    fee_structure_name: string;
    course_year: string;
    admission_mode: string;
    total_fee: number;
    createdAt: string;
    updatedAt: string;
}

interface FeeStructuresState {
    getAllFeeStructure(id: string, title: string, facility: string): unknown;
    feeStructures: feeStructuresIF[];
    feeStructure: feeStructuresIF | null;
    studentfeestructure: any,
    loading: boolean;
    createFeeAddStructure: any
    deleteFeeCategory: any
    createFeeCategoryUpdate: any
    getFeeStructure: (id?: string) => Promise<boolean>;
}

const useFeeStructuresStore = create<FeeStructuresState>((set, get) => ({
    feeStructures: [],
    feeStructure: null,
    studentfeestructure: null,
    loading: false,


    getFeeStructure: async (id?: string) => {
        set({ loading: true });
        try {
            let url = `${import.meta.env.VITE_API_URL}/department`; // Default URL
            if (id) {

                url = `${url}/${id}`;
            }

            const res = await httpRequest("GET", url);
            set({ feeStructure: res.data });
            return true;
        } catch (error) {
            console.error("Error fetching fee structure:", error);
            return false;
        } finally {
            set({ loading: false });
        }
    },
    getAllFeeStructure: async (id?: string, title?: string, facility?: string) => {
        set({ loading: true });
        try {
            let url = `${import.meta.env.VITE_API_URL}/student-fee-structure?title=${title}&facility=${facility}`;
            if (id) {

                url = `${import.meta.env.VITE_API_URL}/student-fee-structure/${id}`;
            }

            const res = await httpRequest("GET", url);
            set({ studentfeestructure: res.data });
            return true;
        } catch (error) {
            console.error("Error fetching fee structure:", error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createFeeStructure: async (data: any) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/student-fee-structure/create`;
            const response = await httpRequest('POST', url, data);

            if (response.success === true) {
                console.log('Fee structure created successfully:', response.data);
                await get().getAllFeeStructure('', '', '');
                useToastStore.getState().showToast('success', 'Fee Structure Create successfully');

                return true;
            } else {
                console.error('Failed to create fee structure:', response.data);
                useToastStore.getState().showToast('error', 'Fee Structure Create failed');
                return false;
            }
        } catch (error) {
            console.error('Error creating fee structure:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },


    updateFeeStructure: async (payload: Record<string, any>) => {
        set({ loading: true });
        try {
            await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/fee-structure/${payload.id}`, payload);
            useToastStore.getState().showToast('success', updateSuccessMessage('Fee Structure'));
            await get().getAllFeeStructure('', '', ''); // Refresh after update
            return true;
        } catch (error) {
            useToastStore.getState().showToast('error', updateErrorMessage('Fee Structure'));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createFeeAddStructure: async (id: any, data: any) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/student-fee-structure/${id}/fee-category`;

            // Assuming `data` contains the fee category information you need to send in the POST request.
            const response = await httpRequest('POST', url, data);

            if (response.success === true) {
                await get().getAllFeeStructure('', '', '');
                useToastStore.getState().showToast('success', 'Fee Structure Create successfully');// Refresh fee structures list
                return true;
            } else {
                console.error('Failed to add fee category:', response.data);
                useToastStore.getState().showToast('error', 'Fee Structure Create failed');
                return false;
            }
        } catch (error) {
            console.error('Error adding fee category:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createFeeCategoryUpdate: async (feeStructureId: string, categoryName: string, data: any) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/student-fee-structure/${feeStructureId}/fee-category/${categoryName}`;
            const response = await httpRequest('PATCH', url, data);
            if (response.success === true) {
                console.log('Fee category updated successfully:', response.data);
                await get().getAllFeeStructure('', '', '');  // Refresh fee structure list after update
                useToastStore.getState().showToast('success', 'Fee Category Update successfully')
                return true;
            } else {
                console.error('Failed to update fee category:', response.data);
                useToastStore.getState().showToast('error', 'Fee Category Update failed');
                return false;
            }
        } catch (error) {
            console.error('Error updating fee category:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteFeeCategory: async (_id: string, categoryName: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/student-fee-structure/${_id}/fee-category/${categoryName}`;
            const response = await httpRequest('DELETE', url);
            if (response.success === true) {
                console.log(`Fee category '${categoryName}' deleted successfully.`);
                await get().getAllFeeStructure('', '', '');
                await get().getFeeStructure();
                useToastStore.getState().showToast('success', 'Fee Category Delete successfully')
                return true;
            } else {
                console.error(`Failed to delete fee category '${categoryName}':`, response.data);
                useToastStore.getState().showToast('error', 'Fee Category Delete failed');
                return false;
            }
        } catch (error) {
            console.error('Error deleting fee category:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteFeeStructure: async (id: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/student-fee-structure/${id}`; // Delete URL with dynamic ID
            const response = await httpRequest('DELETE', url);

            if (response.success === true) {
                console.log(`Fee structure with ID ${id} deleted successfully.`);
                await get().getAllFeeStructure('', '', '');
                useToastStore.getState().showToast('success', 'Fee Structure Delete successfully')
                return true; // Successfully deleted
            } else {
                console.error(`Failed to delete fee structure with ID ${id}:`, response.data);
                useToastStore.getState().showToast('error', 'Fee Structure Delete failed');
                return false;
            }
        } catch (error) {
            console.error('Error deleting fee structure:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));



export default useFeeStructuresStore;
