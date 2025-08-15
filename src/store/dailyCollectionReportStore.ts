import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

import { Key, ReactNode } from 'react';

export interface CreateParentHeadPayloadIF {
    name: string;
    departmentCode: string;
    totalSemesters: number | null;
}

export interface DepartmentIF {
    head_group_name: ReactNode;
    id: Key | null | undefined;
    status: ReactNode;
    parent_head_name: ReactNode;
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    departmentCode: string;
    totalSemesters: number;
}

interface DepartmentState {

    ReceiptSeriesget: any
    getDepartment: any,
    Department: any,
    PaymentModewise:any,
    Facility:any,
    Individualstudents:any,
    getReceiptSeries: any,
    PaymentMode: any,
    FeeHead: any,
    reportData: any,
    yearwisefeeheadwise: any,
    HeadwiseDaily: any,
    DateWiseHeadwise: any,
    Parentgroupget: any,
    AcademicYearWise: any,
    RefundExcessReport: any,
    ParentHead: any,
    loading: boolean;
    initialLoading: boolean;

}

const useDepartmentStore = create<DepartmentState>((set, get) => ({

    ReceiptSeriesget: [],
    Department: [],
    PaymentMode: [],
    ParentHead: [],
    Individualstudents:[],
    Facility:[],
    PaymentModewise:[],
    FeeHead: [],
    yearwisefeeheadwise: [],
    reportData: [],
    DateWiseHeadwise: [],
    RefundExcessReport: [],
    Parentgroupget: [],
    AcademicYearWise: [],
    HeadwiseDaily: [],
    loading: false,
    initialLoading: false,


    getReceiptSeries: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/receipt-series`);
            if (!res.data.length) return true;

            set({ ReceiptSeriesget: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getDepartment: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department`);
            if (!res.data.length) return true;

            set({ Department: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getPaymentMode: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/payment-mode`);
            if (!res.data.length) return true;

            set({ PaymentMode: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getFeeHead: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/fee-head`);
            if (!res.data.length) return true;

            set({ FeeHead: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getReportData: async (fromDate: string, toDate: string, academicYear: string, receiptSeries: string, mode: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/daily-collection-report?fromDate=${fromDate}&toDate=${toDate}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ reportData: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getHeadwiseDaily: async (fromDate: string, toDate: string, academicYear: string, receiptSeries: string, mode: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/payment-by-fee-head-report?fromDate=${fromDate}&toDate=${toDate}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ HeadwiseDaily: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getDateWiseHeadwise: async (month: string, year: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/date-wise-fee-head-collection-report?month=${month}&year=${year}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ DateWiseHeadwise: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getRefundExcessReport: async (selectedYear: string, apiParams: any, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const departmentName = apiParams.departmentName;  // Don't encode this
            const yearGroup = apiParams.yearGroup
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-refund/get-refund-excess-report?academic_year=${selectedYear}&departmentName=${departmentName}&yearGroup=${yearGroup}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ RefundExcessReport: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },
    getParentHead: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/parent-head`);
            if (!res.data.length) return true;

            set({ ParentHead: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getParentgroup: async (selectedYear: string, departmentName: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-refund/get-refund-report?academic_year=${selectedYear}&departmentName=${departmentName}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ Parentgroupget: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getAcademicYearWiseFee: async (selectedYear: string, startDate: string, endDate: string, feeHead: string, mode: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/academic-yearwise-fee-analysis-report?academic_year=${selectedYear}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ AcademicYearWise: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },



    getyearwisefeeheadwise: async (selectedYear: string, apiParams: any, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const departmentName = apiParams.departmentName;  // Don't encode this
            const yearGroup = apiParams.yearGroup
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/yearwise-fee-headwise-report?academic_year=${selectedYear}&departmentName=${departmentName}&yearGroup=${yearGroup}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ yearwisefeeheadwise: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getPaymentModewise: async (selectedYear: string, startDate: string, endDate: string, feeHead: string, mode: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/payment-modewise-collection-report?fromDate=${startDate}&toDate=${endDate}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ PaymentModewise: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getFacility: async (selectedYear: string, selectFacility: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/facilitywise-balance-report?academic_year=${selectedYear}&facility=${selectFacility}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ Facility: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },

    getIndividualstudents: async (selectedYear: string, selectedDepartment: string, selectgroup: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/fee-payment/individual-students-fee-summary-report?academic_year=${selectedYear}&department_name=${selectedDepartment}&year_group=${selectgroup}`;
            const res = await httpRequest('GET', apiUrl);
            if (!res.data) return false;
            set({ Individualstudents: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    },





}));

export default useDepartmentStore;
