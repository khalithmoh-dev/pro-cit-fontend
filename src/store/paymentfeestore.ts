import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { Department } from './feePaymentStore';
import { ReactNode } from 'react';
import { useToastStore } from './toastStore';


export interface StudentQuickCollect {
    id: string;
    firstName: string;
    lastName: string;
    fatherFullName: string;
    motherName: string;
    stream: string;
    group: string;
    department?: Department;
    admissionNumber: string;
    contact: string;
    contactNumber: string;
    usnNumber: string;
    semester: string;
    display_name: string;
    facility: string;
    fee_structure_title: string;
    [key: string]: ReactNode | Department | string | number | undefined;
}

interface FeePaymentData {
    amount: number; // Adjust this as per the real structure of `paymentData`
    paymentMethod: string; // Example, add other fields as necessary
    student_id: string,
    fee_structure_id: string,
    mode: string,
    bank_account: string | number,
    payment_date: number,
    transaction: number,
    receipt_series: string,
    receipt_no: number,
    refund_amount: number,
    payment: number,
    remark: string,
    // Define any other necessary properties here
}

interface FeeStructuresState {
    getRedundPayment(studentId: string): unknown;
    deleteFeeRefund(studentId: any): unknown;
    getChallanData(studentId: string, feeStructureId: string): unknown;
    createRefundPayment(paymentData: FeePaymentData,studentId: string, feeStructureId: string): unknown;
    deleteChallen(paymentId: string, studentId: any, feeStructureId: any): unknown;
    getFeePayment(studentId: string, feeStructureId: string): void;
    deleteFeePayment(paymentId: string, studentId: string, feeStructureId: string): Promise<boolean>;
    loading: boolean;
    createFeePayment: any;
    selectedFeeStructure: StudentQuickCollect[];
    challanData: any
    selectedRedundStructure: any
    selectedFeeReceipt: any,
    getallstudent: (params: {
        firstName: string;
        lastName: string;
        email: string;
        admissionNumber: any;


        contactNumber: string;
    }) => Promise<void>;
    students: StudentQuickCollect[];
}

const paymentfeestore = create<FeeStructuresState>((set, get) => ({
    loading: false,
    selectedFeeStructure: [],
    selectedRedundStructure: [],
    selectedFeeReceipt: [],
    challanData: [],
    students: [],

    getallstudent: async ({ firstName, lastName, email, contactNumber, admissionNumber }) => {
        set({ loading: true });
        try {
            // Construct query string, only include non-empty parameters
            const queryParams: { [key: string]: string } = {};

            if (firstName) queryParams.firstName = firstName;
            if (lastName) queryParams.lastName = lastName;
            if (email) queryParams.email = email;
            if (contactNumber) queryParams.contactNumber = contactNumber;
            if (admissionNumber) queryParams.admissionNumber = admissionNumber

            // Construct the query string from the filtered parameters
            const queryString = new URLSearchParams(queryParams).toString();

            const res = await httpRequest(
                'GET',
                `${import.meta.env.VITE_API_URL}/student/get-all-students?${queryString}`
            );

            // Assuming `res.data` is an array of `StudentQuickCollect`
            set({ students: res.data });
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            set({ loading: false });
        }
    },

    getFeePayment: async (studentId: string, feeStructureId: string) => {
        console.log("studentIdstudentId", studentId, feeStructureId);

        set({ loading: true });
        try {

            const url = `${import.meta.env.VITE_API_URL}/fee-payment?student_id=${studentId}&fee_structure_id=${feeStructureId}`;

            const res = await httpRequest('GET', url);

            if (res.data) {
                set({ selectedFeeStructure: res.data });
                console.log('Challan data fetched successfully', res.data);
            } else {
                console.error('Unexpected response format:', res.data);
            }
        } catch (error) {
            console.error('Error fetching challan data:', error);
        } finally {
            set({ loading: false });
        }
    },
    getFeeReceipt: async (selectedId: string,) => {
        set({ loading: true });
        try {

            const url = `${import.meta.env.VITE_API_URL}/fee-payment/${selectedId}`;
            const res = await httpRequest('GET', url);

            if (res.data) {
                set({ selectedFeeReceipt: res.data });
                console.log('Challan data fetched successfully', res.data);
            } else {
                console.error('Unexpected response format:', res.data);
            }
        } catch (error) {
            console.error('Error fetching challan data:', error);
        } finally {
            set({ loading: false });
        }
    },

    getRefundReceipt: async (selectedRefundId: string,) => {
        set({ loading: true });
        try {

            const url = `${import.meta.env.VITE_API_URL}/fee-refund/${selectedRefundId}`;
            const res = await httpRequest('GET', url);

            if (res.data) {
                set({ selectedFeeReceipt: res.data });
                console.log('Challan data fetched successfully', res.data);
            } else {
                console.error('Unexpected response format:', res.data);
            }
        } catch (error) {
            console.error('Error fetching challan data:', error);
        } finally {
            set({ loading: false });
        }
    },

    // selectedFeeStructure
    getRedundPayment: async () => {
        set({ loading: true });
        try {
            const res = await httpRequest(
                'GET',
                `${import.meta.env.VITE_API_URL}/fee-refund`
            );

            if (Array.isArray(res.data)) {
                set({ selectedRedundStructure: res.data });
            } else {
                console.error('Unexpected response format:', res.data);
            }
        } catch (error) {
            console.error('Error fetching student fee structure:', error);
        } finally {
            set({ loading: false });
        }
    },

    getChallanData: async (studentId: string, selectedFeeStructureId: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/challan?student_id=${studentId}&fee_structure_id=${selectedFeeStructureId}`;
            const res = await httpRequest('GET', url);

            if (res.data) {
                set({ challanData: res.data });
                console.log('Challan data fetched successfully', res.data);
            } else {
                console.error('Unexpected response format:', res.data);
            }
        } catch (error) {
            console.error('Error fetching challan data:', error);
        } finally {
            set({ loading: false });
        }
    },

    updateChallanData: async (challanNumber: string, updatedData: any, studentId: string, selectedFeeStructureId: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/challan/${challanNumber}/verify`;
            const response = await httpRequest('PATCH', url, updatedData);

            if (response.success) {
                await get().getChallanData(studentId, selectedFeeStructureId);
                useToastStore.getState().showToast('success', 'Update Challan successfully');
                console.log('Challan updated successfully');
                return true;
            } else {
                console.error('Failed to update challan:', response.data);
                useToastStore.getState().showToast('error', 'Update Challan failed');
                return false;
            }
        } catch (error) {
            console.error('Error updating challan:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createFeePayment: async (paymentData: FeePaymentData, studentId: string, feeStructureId: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/fee-payment/create`;

            // Ensure httpRequest returns a Promise that resolves to the response
            const response = await httpRequest('POST', url, paymentData);

            if (response.success === true) {
                get().getFeePayment(studentId, feeStructureId);
                await get().getallstudent({
                    firstName: '',
                    lastName: '',
                    email: '',
                    contactNumber: '',
                    admissionNumber: ''
                });
                console.log('Fee payment created successfully');
                useToastStore.getState().showToast('success', 'Fee Payment created successfully');
                return true;
            } else {
                console.error('Error creating fee payment:', response.message);
                useToastStore.getState().showToast('error', 'Fee Payment creation failed');
                return false;
            }
        } catch (error) {
            console.error('Error creating fee payment:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    }

    ,
    createRefundPayment: async (paymentData: FeePaymentData, studentId: string, feeStructureId: string) => {
        set({ loading: true });
        console.log(paymentData, "paymentData in createRefundPayment");
        try {
            const url = `${import.meta.env.VITE_API_URL}/fee-refund/create`;
            const response = await httpRequest('POST', url, paymentData);
            console.log(response, "response in createRefundPayment");

            if (response.success === true) {
                get().getFeePayment(studentId, feeStructureId);
                await get().getallstudent({
                    firstName: '',
                    lastName: '',
                    email: '',
                    contactNumber: '',
                    admissionNumber: ''
                });
                useToastStore.getState().showToast('success', response.message);
                console.log('Fee refund created successfully');
                return true;
            } else {
                console.error('Failed to create fee refund:', response.message);
                useToastStore.getState().showToast('error', response.message);
                return false;
            }
        } catch (error) {
            console.error('Error creating fee refund:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    // Create a challan payment for the student
    createChallenPayment: async (paymentData: FeePaymentData, studentId: string, selectedFeeStructureId: string) => {
        set({ loading: true });
        console.log(paymentData, "paymentData in createChallenPayment");
        try {
            const url = `${import.meta.env.VITE_API_URL}/challan/create`;
            const response = await httpRequest('POST', url, paymentData);
            if (response.success === true) {
                useToastStore.getState().showToast('success', 'challan create successfully');
                await get().getChallanData(studentId, selectedFeeStructureId);
                console.log('Fee challan created successfully');
                return true;
            } else {
                console.error('Failed to create fee challan:', response.data);
                useToastStore.getState().showToast('error', 'Challan Create failed');
                return false;
            }
        } catch (error) {
            console.error('Error creating fee challan:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteFeeRefund: async (studentId: string,) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/fee-refund/${studentId}`;
            const response = await httpRequest('DELETE', url);
            if (response.success === true) {

                await get().getRedundPayment(studentId);
                useToastStore.getState().showToast('success', 'Fee Payment Delete Successfully');
                console.log('Fee payment deleted successfully');
                return true;
            } else {
                console.error('Failed to delete fee payment:', response.data);
                useToastStore.getState().showToast('error', 'Fee Payment Delete failed');
                return false;
            }
        } catch (error) {
            console.error('Error deleting fee payment:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },
    deleteFeePayment: async (paymentId: string, studentId: string, feeStructureId: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/fee-payment/${paymentId}`;
            const response = await httpRequest('DELETE', url);
            if (response.success === true) {

                get().getFeePayment(studentId, feeStructureId);
                useToastStore.getState().showToast('success', 'Fee Payment Delete Successfully');
                console.log('Fee payment deleted successfully');
                return true;
            } else {
                console.error('Failed to delete fee payment:', response.data);
                useToastStore.getState().showToast('error', 'Fee Payment Delete failed');
                return false;
            }
        } catch (error) {
            console.error('Error deleting fee payment:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    },
    deleteChallen: async (paymentId: string, studentId: string, selectedFeeStructureId: string) => {
        set({ loading: true });
        try {
            const url = `${import.meta.env.VITE_API_URL}/challan/${paymentId}`;
            const response = await httpRequest('DELETE', url);
            if (response.success === true) {
                await get().getChallanData(studentId, selectedFeeStructureId);
                useToastStore.getState().showToast('success', 'Challen Delete Successfully');
                console.log('Fee payment deleted successfully');
                return true;
            } else {
                console.error('Failed to delete fee payment:', response.data);
                useToastStore.getState().showToast('error', 'Challen Delete failed');
                return false;
            }
        } catch (error) {
            console.error('Error deleting fee payment:', error);
            return false;
        } finally {
            set({ loading: false });
        }
    }
}));

export default paymentfeestore;


