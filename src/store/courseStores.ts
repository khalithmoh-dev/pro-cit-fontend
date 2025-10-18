import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import httpUploadRequest from '../utils/functions/http-upload-request';

export interface createCoursePayload{
    crsId: string,
    crsNm: string,
    offDept: string,
    crsType: string,
    isSplit:  boolean,
    crdt: number,
    tCrdt?: number,
    pCrdt?: number,
    category?: string,
    subCat?: string,
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
    category?: string,
    subCat?: string,
    isExamCrs: boolean,
}

interface courseCatPayload{
    catId: string,
    catNm: string,
    _id?: string
}

interface courseSubCatPayload{
    catId: string,
    subCatId: string,
    subCatNm: string,
    _id?: string
}

interface CourseState {
    courseList: CourseIF[];
    createCourse: (payload: createCoursePayload) => Promise<boolean>,
    getCourseById: (id: string) => Promise<boolean>,
    getCourses: (firstRender?: boolean) => Promise<object[] | boolean >;
    updateCourse: (payload: createCoursePayload) => Promise<boolean>;
    createCourseCat: (payload: courseCatPayload) => Promise<boolean>,
    updateCourseCat: (payload: courseCatPayload) => Promise<boolean>,
    createCourseSubCat: (payload: courseSubCatPayload) => Promise<boolean>,
    updateCourseSubCat: (payload: courseSubCatPayload) => Promise<boolean>,
}

// Course Store to handle Degree create update get functionalities
const useCourseStore = create<CourseState>((set,get) => ({
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
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/update/${id}`, oPayload);
            return true;
        }catch {
            return false;
        }
    },
    createCourseCat: async(oPayload) => {
        try{
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/cat/create`, oPayload);
            return true
        }catch { 
            return false
        }
    },
    updateCourseCat: async(oPayload) => {
        try{
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/cat/update`, oPayload);
            return true;
        }catch {
            return false;
        }
    },
    createCourseSubCat: async(oPayload) => {
        console.log("oPayload", oPayload)
        try{
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/sub-cat/create`, oPayload);   
            return true
        }catch { 
            return false
        }
    },
    updateCourseSubCat: async(oPayload) => {
        try{
            await httpRequest('POST',`${import.meta.env.VITE_API_URL}/course/sub-cat/update`, oPayload);
            return true;
        }catch {
            return false;
        }
    },

    uploadCourses: async (file: File, departmentId: string) => {
        try {
        const formData = new FormData();
            formData.append("files",file)
console.log([...formData.entries()]);
            await httpUploadRequest("POST", `${import.meta.env.VITE_API_URL}/course/upload`, formData);

            return true;
        } catch (error) {
            return false;
        }
    }
}))
export default useCourseStore;