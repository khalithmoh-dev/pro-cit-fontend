import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { ReactNode } from 'react';
import { useToastStore } from './toastStore';

// Define the structure of a single student
export interface Department {
  name: string;
  // Add other properties as needed
}

export interface StudentQuickCollect {
  id: string;
  firstName: string;
  lastName: string;
  fatherFullName: string;
  motherName: string;
  stream: string;
  group: string;
  department?: Department;
  admissionNumber: any;
  contact: string;
  email: any;
  contactNumber: string;
  usnNumber: string;
  semester: string;
  display_name: string
  facility: string
  // name: any;
  // Any other properties you might need
  [key: string]: ReactNode | Department | string | number | undefined;
  fee_structure_title: string;
}

// Define the structure of the store
interface QuickCollectStore {
  students: StudentQuickCollect[]; 
  selectedFeeReceipt:[] // Updated to be typed properly
  selectedFeeStructure: StudentQuickCollect[];
  Department:any,
  ParentHead:any,  // Updated to be typed properly
  loading: boolean;
  getallstudent: (params: {
    firstName: string;
    lastName: string;
    email: string;
    admissionNumber: any;


    contactNumber: string;
  }) => Promise<void>;
  getfeesrurture: () => Promise<void>;
  getStudentFeeStructure: (_id: string) => Promise<void>;
  assignFeeStructureToStudent: (studentId: string, feeStructureId: string, academicYear: string | number) => Promise<void>;
  createConcession: (
    feeStructureId: string,
    feeCategoryId: string,
    studentId: string,
    concession: any, // refined type
    remark: string,
    attachments: string[]
  ) => Promise<void>;


}

const useQuickCollectStore = create<QuickCollectStore>((set, get) => ({
  students: [], // Array of StudentQuickCollect objects
  selectedFeeStructure: [], 
  ParentHead:[],
  Department:[],// Array of StudentQuickCollect objects
  loading: false,
  selectedFeeReceipt:[],

  // Updated function to accept parameters and handle empty ones


  getfeesrurture: async () => {
    set({ loading: true });
    try {
      // Make the GET request for fee structure
      const res = await httpRequest(
        'GET',
        `${import.meta.env.VITE_API_URL}/student-fee-structure`
      );


      set({ students: res.data }); // Replace with actual state that represents the fee structure
    } catch (error) {
      console.error('Error fetching fee structure:', error);
    } finally {
      set({ loading: false });
    }
  },

  getFeeReceipt: async (selectreciept: string,) => {
    set({ loading: true });
    try {

      const url = `${import.meta.env.VITE_API_URL}/fee-payment/${selectreciept}`;
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



  getStudentFeeStructure: async (_id: string) => {
    set({ loading: true });
    try {
      // Make the GET request for specific student's fee structure
      const res = await httpRequest(
        'GET',
        `${import.meta.env.VITE_API_URL}/student-fee-structure/${_id}`
      );

      // You can store this data in a separate state or handle it accordingly
      set({ selectedFeeStructure: res.data }); // Replace with actual state that represents the fee structure
      console.log('Fee structure for student:', res.data);
    } catch (error) {
      console.error('Error fetching student fee structure:', error);
    } finally {
      set({ loading: false });
    }
  },

 getDepartment: async (firstRender = false): Promise<boolean> => {
        set({ loading: !firstRender,  });
        try {
            const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/department`);
            if (!res.data.length) return true;

            set({ Department: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false, });
        }
    },

    getParentHead: async (status: string, firstRender = false): Promise<boolean> => {
      set({ loading: !firstRender, });
      try {
        const res = await httpRequest('GET',  `${import.meta.env.VITE_API_URL}/parent-head?status=${status || ''}`);
        if (!res.data.length) return true;
        console.log('res.data :>> ', res);
        set({ ParentHead: res.data });
        return true;
      } catch (error) {
        return false;
      } finally {
        set({ loading: false, });
      }
    },
  assignFeeStructureToStudent: async (
    studentId: string,
    feeStructureId: string,
    academicYear: string | number // Accept both string and number
  ) => {
    set({ loading: true });
    try {
      // Prepare the body for the POST request
      const body = {
        studentId,
        feeStructureId,
        academicYear
      };

      // Make the POST request to assign fee structure to the student
      const res = await httpRequest(
        'POST',
        `${import.meta.env.VITE_API_URL}/student/assign-fee-structures`,
        body
      );

      console.log('Assigned fee structure:', res.data);

      // Refresh the list of all students
      await get().getallstudent({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        admissionNumber: ''
      });  // Call without parameters to fetch all students

    } catch (error) {
      console.error('Error assigning fee structure:', error);
    } finally {
      set({ loading: false });
    }
  },
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

  createConcession: async (feeStructureId: string, feeCategoryId: string, studentId: string, concession: any[], remark: string, attachments: string[]) => {
    set({ loading: true });
    try {
      const body = {
        fee_structure_id: feeStructureId,
        fee_category_id: feeCategoryId,
        student_id: studentId,
        concession: concession,
        remark: remark,
        attachments: attachments
      };

      // Call the POST API to create a concession
      const res = await httpRequest(
        'POST',
        `${import.meta.env.VITE_API_URL}/concession/create`,
        body
      );

      console.log('Concession created successfully:', res.data);
      await get().getallstudent({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        admissionNumber: ''
      });
      useToastStore.getState().showToast('success', ' Create Concession successfully');

    } catch (error) {
      console.error('Error creating concession:', error);
      useToastStore.getState().showToast('error', 'Create Concession failed');

    } finally {
      set({ loading: false });
    }
  }

}));





export default useQuickCollectStore;
