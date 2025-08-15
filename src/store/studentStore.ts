import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import {
  createErrorMessage,
  createSuccessMessage,
  deleteErrorMessage,
  deleteSuccessMessage,
  updateErrorMessage,
  updateSuccessMessage,
} from '../utils/functions/toast-message';
import { SelectOptionIF } from '../interface/component.interface';

// Interfaces
export interface createStudentPayloadIF {
  name: string;
  studentCode: string;
  department?: string;
  permanentSameAsPresent: boolean;
  permanentAddress: any;
  presentAddress: any;
  semester: number;
  admissionSemester: number;
}

export interface StudentIF {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  usnNumber: string;
  email: string;
  contactNumber: number;
  gender: string;
  bloodGroup: string;
  placeOfBirth: string;
  dateOfJoin: string;
  aadharNumber: number;
  panNumber: string;
  fatherFullName: string;
  motherName: string;
  parentContactNumber: number;
  parentEmail: string;
  guardianName: string;
  guardianContactNumber: number;
  caste: string;
  religion: string;
  nationality: string;
  category: string;
  ruralUrbanStatus: string;
  physicallyChallenged: boolean;
  yearOfAdmission: string;
  admissionSemester: string;
  admissionStatus: string;
  entranceTestMarks: number;
  cetRanking: number;
  hostelRequired: boolean;
  transportRequired: boolean;
  seatType: string;
  admissionType: string;
  semester: number;
  entranceRankList: string;
  profilePhoto: string;
  admissionNumber: string;
  diplomaMarks: string;
  previousEducation: string;
  identificationMark: string;
  motherTongue: string;
  annualIncome: string;
  department: {
    name: string;
    departmentCode: string;
  };
  bankDetails: {
    bankName: string;
    branchAddress: string;
    branchCode: string;
    ifscCode: string;
    micrCode: string;
    accountHolderName: string;
    accountNumber: number;
  };
  presentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
  permanentAddress: {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    city: string;
    pincode: number;
  };
  puOr12thMarks: {
    physics: number;
    mathematics: number;
    biology: number;
    computerScience: number;
    electronics: number;
  };
  documents: {
    sslcMarksCard: string;
    transferCertificate: string;
    photo: string;
    studyCertificate: string;
    aadharCard: string;
    casteIncomeCertificate: string;
    birthCertificateOrRationCard: string;
    ruralCertificate: string;
    kannadaMediumCertificate: string;
    characterCertificate: string;
    migrationCertificate: string;
    accountDetails: string;
    undertakingByStudent: string;
    undertakingByParent: string;
    other: string;
  };
  createdAt: string;
}

interface StudentState {
  students: StudentIF[];
  filteredStudents: StudentIF[];
  filteredByDepartmentStudents: StudentIF[];
  student: StudentIF | null;
  studentOptions: SelectOptionIF[];
  studentOptionsDepartment: SelectOptionIF[];
  loading: boolean;
  deleting: string;
  initialLoading: boolean;
  total: number;
  createStudent: (payload: createStudentPayloadIF) => Promise<boolean>;
  updateStudent: (payload: createStudentPayloadIF, id: string) => Promise<boolean>;
  getStudents: (query?: any, noLoader?: boolean) => Promise<boolean>;
  getFilteredStudents: (query?: any) => Promise<boolean>;
  getStudentsByDepartment: (query?: any) => Promise<boolean>;
  getStudent: (id: string) => Promise<boolean>;
  getStudentDetails: (id: string) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  exportStudents: () => Promise<boolean>;
  emptyStudentOptions: () => void;
  clearStudent: () => void;
}

const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  filteredStudents: [],
  filteredByDepartmentStudents: [],
  studentOptions: [],
  studentOptionsDepartment: [],
  student: null,
  loading: false,
  deleting: '',
  initialLoading: false,
  total: 0,

  // Actions
  createStudent: async (payload) => {
    try {
      set({ loading: true });
      await httpRequest('POST', `${import.meta.env.VITE_API_URL}/student/create`, payload);
      useToastStore.getState().showToast('success', createSuccessMessage('Student'));
      await get().getStudents();
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', createErrorMessage('Student'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateStudent: async (payload, id) => {
    try {
      set({ loading: true });
      await httpRequest('PATCH', `${import.meta.env.VITE_API_URL}/student/update/${id}`, payload);
      useToastStore.getState().showToast('success', updateSuccessMessage('Student'));
      await get().getStudents();
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', updateErrorMessage('Student'));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getStudent: async (id) => {
    try {
      set({ loading: true });
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/student/${id}`);
      set({ student: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getStudentDetails: async (id) => {
    try {
      set({ loading: true });
      const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/student/details/${id}`);
      set({ student: res.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getStudents: async (query = {}, firstRender) => {
    set({ loading: !firstRender, initialLoading: firstRender });
    try {

      const res = await httpRequest("POST", `${import.meta.env.VITE_API_URL}/student/`, query);
      const options = res.data.map((student: StudentIF) => {
        return {
          label: student.firstName,
          value: student._id,
        };
      });
      set({ students: res.data, total: res.total, studentOptions: options });
      return true;
    } catch (error) {
      set({ students: [], total: 0 });
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },


  getStudentsByDepartment: async (query = {}) => {
    const queryParams = new URLSearchParams(query).toString();
    
    try {
            // const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/student/by-department-year`, query);       
      const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/student/by-department-year?${queryParams}`);

      const options = res.data.map((student: StudentIF) => {
        return {
          label: student.firstName,
          value: student._id,
        };
      });
      set({ filteredByDepartmentStudents: res.data, studentOptionsDepartment: options });
      return true;
    } catch (error) {
      set({ studentOptionsDepartment: [] });
      return false;
    } finally {
      set({ loading: false, initialLoading: false });
    }
  },

  deleteStudent: async (id) => {
    try {
      set({ deleting: id });
      await httpRequest('DELETE', `${import.meta.env.VITE_API_URL}/student/${id}`);
      useToastStore.getState().showToast('success', deleteSuccessMessage('Student'));
      await get().getStudents();
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', deleteErrorMessage('Student'));
      return false;
    } finally {
      set({ deleting: '' });
    }
  },

  getFilteredStudents: async (query = {}) => {
    set({ studentOptions: [] });
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/student/`, query);
      if (!res.data.length) {
        useToastStore.getState().showToast('info', 'No student found');
        return true;
      }
      const options = res.data.map((student: StudentIF) => {
        return {
          label: `${student.firstName} ${student.lastName} (${student.usnNumber})`,
          value: student._id,
        };
      });
      set({ filteredStudents: res.data, studentOptions: options });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ loading: false });
    }
  },


  exportStudents: async () => {
    try {
      set({ loading: true });
      const response = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/student/export`, {});
      const csvData = await response.text();
      const now = new Date();
      const filename = `exported-students-${now.toLocaleDateString('en-GB').replace(/\//g, '-')}_${now.toLocaleTimeString('en-GB').replace(/:/g, '-')}.csv`;

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      useToastStore.getState().showToast('error', 'Failed to export students');
      return false;
    } finally {
      set({ loading: false });
    }
  },
  emptyStudentOptions: () => {
    set({ studentOptions: [] });
  },
  clearStudent: () => {
    set({ student: null });
  },
}));

export default useStudentStore;
