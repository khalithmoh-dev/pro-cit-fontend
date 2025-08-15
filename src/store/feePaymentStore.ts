import { create } from "zustand";
import httpRequest from "../utils/functions/http-request";
import { useToastStore } from "./toastStore";
import {
    createErrorMessage,
    createSuccessMessage,
} from "../utils/functions/toast-message";

// Interface for creating a fee category
export interface createFeePay {
    feeStructureId: string,
    studentId: string,
    payments: { categoryName: string; amount: number }[];


}

// Interface for the fee category data structure
export interface feePaymentIF {
    feeStructure: any;
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
    student: any;
}
export interface PaymentData {
    categoryName: string;
    amount: number;
}


export interface Address {
    address: string;
    country: string;
    state: string;
    district: string;
    taluk: string;
    pincode?: string;
}

export interface BankDetails {
    bankName: string;
    branchAddress: string;
    branchCode?: string;
    accountHolderName: string;
    accountNumber: number;
    ifscCode?: string;
}

export interface PuOr12thMarks {
    physics: number;
    chemistry: number;
    mathematics: number;
    biology?: number | null;
    computerScience?: number | null;
    electronics?: number | null;
    english?: number | null;
    [key: string]: number | null | undefined; // For any additional subjects
}

export interface Department {
    _id: string;
    name: string;
    departmentCode: string;
    totalSemesters: number;
    createdAt: string;
}

export interface StudentData {
    aadharNumber: number;
    accessForWebsite: boolean;
    active: boolean;
    admissionNumber: string;
    admissionSemester: string;
    admissionStatus: string;
    admissionType: string;
    annualIncome: string;
    appDownloaded: boolean;
    bankDetails: BankDetails;
    bloodGroup: string;
    caste: string;
    category: string;
    cetRanking?: number | null;
    clubs: string[];
    contactNumber: number;
    createdAt: string;
    dateOfJoin: string;
    department: Department;
    diplomaMarks?: number | null;
    discountOrScholarship?: number | null;
    documents: string;
    email: string;
    entranceTestMarks?: number | null;
    fatherFullName: string;
    feeStructure: string;
    feesPaid: boolean;
    firstName: string;
    guardianContactNumber?: number | null;
    guardianName: string;
    gender: string;
    hostelRequired: boolean;
    hyderabadKarnataka: boolean;
    identificationMark: string;
    kannadaMedium: boolean;
    lastName?: string;
    middleName?: string;
    motherName: string;
    motherTongue: string;
    nationality: string;
    panNumber: string;
    parentContactNumber: number;
    parentEmail: string;
    password: string;
    permanentAddress: Address;
    permanentSameAsPresent: boolean;
    physicallyChallenged: boolean;
    placeOfBirth: string;
    presentAddress: Address;
    previousEducation: string;
    profilePhoto: string;
    puOr12thMarks: PuOr12thMarks;
    registered: boolean;
    religion: string;
    ruralUrbanStatus: string;
    seatType: string;
    semester: string;
    transportRequired: boolean;
    updatedAt: string;
    usnNumber: string;
    yearOfAdmission: string;
    _id: string;
}


export interface FeeCategory {
    feeStructure: {
        _id: string;
        fee_structure_name: string;
        fees: {
            category_name: string;
            amount: number;
            duration_type: string;
            is_mandatory: boolean;
            applicable_semesters: string[];
            applicable_year: number[];
        }[];
        total_fee: number;
        createdAt: string;
    };
    paymentHistories?: {
        category_name: string;
        is_mandatory: boolean;
        applicable_semesters: string[];
        applicable_year: number[];
        amount_paid: number;
        remaining_balance: number;
        payment_date: string;
        createdAt: string;
        expand: string
    }[];
    status?: string; // Add this line if status can be a string

}

export interface PaymentInput {
    categoryName: string;
    amount: number;
}

export interface Student {
    firstName: string;
    lastName: string;
    email: string;
};

// Interface representing the shape of the fee category store
interface FeePaymentState {
    feePayHistory: feePaymentIF[];
    loading: boolean;
    createFeePayment: (
        payload: createFeePay
    ) => Promise<boolean>;

    getFeePayHistory: () => Promise<boolean>;
}

type FeeCategorySelectedStudent = {
    student: {
        _id: string; // Add other student properties as needed
        name: string; // Example property
    };
    feeStructures: any; // Adjust this type to match the actual structure of fee structures
} | null;

const useFeePaymentStore = create<FeePaymentState>((set, get) => ({
    feePayHistory: [],
    loading: false,

    // Create a new fee category
    createFeePayment: async (payload) => {
        set({ loading: true });
        try {
            await httpRequest(
                "POST",
                `${import.meta.env.VITE_API_URL}/payment-history/pay`,
                payload
            );
            useToastStore
                .getState()
                .showToast("success", createSuccessMessage("FeePayment"));
            await get().getFeePayHistory(); // Refresh fee category list after creation
            return true;
        } catch (error) {
            useToastStore
                .getState()
                .showToast("error", createErrorMessage("FeePayment"));
            return false;
        } finally {
            set({ loading: false });
        }
    },


    getFeePayHistory: async () => {
        set({ loading: true });
        try {
            const res = await httpRequest(
                "GET",
                `${import.meta.env.VITE_API_URL}/payment-history/all`
            );

            set({ feePayHistory: res.data });
            return true;
        } catch (error) {
            set({ feePayHistory: [] });
            return false;
        } finally {
            set({ loading: false });
        }
    },


}));

export default useFeePaymentStore;
