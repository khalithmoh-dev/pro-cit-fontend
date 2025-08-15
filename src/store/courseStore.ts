import { create } from "zustand";
import httpRequest from "../utils/functions/http-request";
import { useToastStore } from "./toastStore";
import { createErrorMessage, createSuccessMessage, deleteErrorMessage, deleteSuccessMessage, updateErrorMessage, updateSuccessMessage } from "../utils/functions/toast-message";
import { SelectOptionIF } from "../interface/component.interface";



export interface createCoursePayloadIF {
    course_name: string;
    duration: number;
    department: string;
}

export interface courseIF {
    _id: string;
    course_name: string;
    duration: number;
    department: string;
    department_id:{
        _id:string;
        name:string;
    };
    createdAt: string;
    updatedAt: string;
}


// Interface representing the shape of the course store
interface CourseState {
    courses: courseIF[];
    allCourses: courseIF[];
    course: courseIF | null;
    courseOptions: SelectOptionIF[];
    loading: boolean;
    createCourse: (payload: createCoursePayloadIF, departmentId: string) => Promise<boolean>;
    updateCourse: (payload: createCoursePayloadIF, id: string, departmentId: string) => Promise<boolean>;
    getCourses: (id: string) => Promise<boolean>;
    getCourse: (id: string) => Promise<boolean>;
    getAllCourse: () => Promise<boolean>;
    deleteCourse: (id: string, departmentId: string) => Promise<boolean>;
}


const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],
    allCourses: [],
    courseOptions: [],
    course: null,
    loading: false,

    // Create a new course
    createCourse: async (payload, departmentId) => {
        set({ loading: true });
        try {
            await httpRequest("POST", `${import.meta.env.VITE_API_URL}/course/create`, payload);
            useToastStore.getState().showToast("success", createSuccessMessage("Course"));
            await get().getCourses(departmentId);
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", createErrorMessage("Course"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateCourse: async (payload, id, departmentId) => {
        set({ loading: true });
        try {
            await httpRequest("PATCH", `${import.meta.env.VITE_API_URL}/course/update/${id}`, payload);
            useToastStore.getState().showToast("success", updateSuccessMessage("Course"));
            await get().getCourses(departmentId); // Refresh course list after update
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", updateErrorMessage("Course"));
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getCourses: async (id) => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/course/get-course-based-department/${id}`);
            if (!res.data.length) return true
            const options = res.data.map((department: courseIF) => {
                return {
                    label: department.course_name,
                    value: department._id,
                };
            });
            set({ courses: res.data, courseOptions: options });
            return true;
        } catch (error) {
            set({ courses: [] });
            return false;
        } finally {
            set({ loading: false });
        }
    },
    
    getAllCourse: async () => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/course`);
            if (!res.data.length) return true
            set({ allCourses: res.data });
            return true;
        } catch (error) {
            set({ allCourses: [] });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getCourse: async (id) => {
        set({ loading: true });
        try {
            const res = await httpRequest("GET", `${import.meta.env.VITE_API_URL}/course/${id}`);

            set({ course: res.data });
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteCourse: async (id, departmentId) => {
        set({ loading: true });
        try {
            await httpRequest("DELETE", `${import.meta.env.VITE_API_URL}/course/${id}`);
            useToastStore.getState().showToast("success", deleteSuccessMessage("Course"));
            await get().getCourses(departmentId); 
            return true;
        } catch (error) {
            useToastStore.getState().showToast("error", deleteErrorMessage("Course"));
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useCourseStore;
