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

interface ConcessionState {

    reportData: any
    loading: boolean;
    initialLoading: boolean;

}

const useConcessionStore = create<ConcessionState>((set, get) => ({

    reportData: [],
    loading: false,
    initialLoading: false,

    getConcessionReport: async (fromDate: string, toDate: string, academic_year: string, departmentName: string, firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender, initialLoading: firstRender });
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/concession/get-concessions-report` +
                (fromDate ? `&fromDate=${fromDate}` : '') +
                (toDate ? `&toDate=${toDate}` : '') +
                (academic_year ? `?academic_year=${academic_year}` : '') +
                (departmentName ? `&departmentName=${departmentName}` : '');
            const res = await httpRequest('GET', apiUrl);
            console.log(apiUrl, res?.data);

            if (!res.data) return false;
            set({ reportData: res.data });
            return true;
        } catch (error) {
            console.error('Error fetching report data:', error);
            return false;
        } finally {
            set({ loading: false, initialLoading: false });
        }
    }

}));

export default useConcessionStore;
