import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createCoursePayload{
    crsId: string,
    crsNm: string,
    offDept: string,
    crsType: string,
    isSplit:  boolean,
    crdt: number,
    tCrdt?: number,
    pCrdt?: number,
    category: string,
    subCat: string,
    isExamCrs: boolean,
    _id?: string
}

interface CourseIF {
   crsId: string,
    crsNm: string,
    offDept: string,
    crsType: string,
    isSplit:  boolean,
    crdt: number,
    tCrdt: number,
    pCrdt: number,
    category: string,
    subCat: string,
    isExamCrs: boolean,
}

interface CourseState {
    courseList: CourseIF[];
    createCourse: (payload: createCoursePayload) => Promise<boolean>,
    getCourseById: (id: string) => Promise<boolean>,
    getCourses: (firstRender?: boolean) => Promise<object[] | boolean >;
    updateCourse: (payload: createCoursePayload) => Promise<boolean>
}

// Course Store to handle Degree create update get functionalities
const useCourseStore = create<CourseState>(() => ({
    courseList:[],
    createCourse: async(oPayload) => {
        try{
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/create`, oPayload);
            return true
        }catch { 
            return false
        }
    },
    getCourseById: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/course/get-by-id/${id}`))?.data
       }catch {
        return false
       }
    },
    getCourses: async() => {
       try{
         const aCourseList = await httpRequest('GET',`${import.meta.env.VITE_API_URL}/course/get-all-courses`);
         return aCourseList?.data;
       }catch {
        return false
       }
    },
    updateCourse: async(oPayload) => {
        try{
            const id = oPayload._id;
            delete oPayload._id
            await httpRequest('PATCH',`${import.meta.env.VITE_API_URL}/course/update/${id}`, oPayload);
            return true;
        }catch {
            return false;
        }
    }
}))
export default useCourseStore;