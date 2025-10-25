import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createSemesterPayload{
    insId: string,
    degId: string,
    prgCd: string,
    semId: string,
    semNm: string,
    desc:  string,
    _id?: string
}

interface SemesterIF {
    insId: string,
    degId: string,
    prgCd: string,
    semId: string,
    semNm: string,
    desc:  string
}

interface SemesterState {
    semesterList: SemesterIF[];
    degreeData: object,
    createSemester: (payload: createSemesterPayload) => Promise<boolean>,
    getSemesterById: (id: string) => Promise<boolean>,
    getSemester: (firstRender?: boolean) => Promise<object[] | boolean >;
    updateSemester: (payload: createSemesterPayload) => Promise<boolean>;
    getSemesterGroup: (firstRender?: boolean) => Promise<object[] | boolean >;
    createSemesterGroup: (payload) => Promise<boolean>,
    semesterGroupList: object[];
}

// Degree Store to handle Degree create update get functionalities
const useDegreeStore = create<SemesterState>((set,get) => ({
    semesterList:[],
    degreeData: {},
    semesterGroupList: [],
    createSemester: async(oPayload = {
        insId: '',
        degId: '',
        prgCd: '',
        semId: '',
        semNm: '',
        desc: ''
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/semester/create`,oPayload);
            get().getSemester();
            return true
        }catch(err){
            throw err;
        }
    },
    getSemesterById: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/semester/get-by-id/${id}`))?.data
       }catch(err){
        return false
       }
    },
    getSemester: async() => {
       try{
         const aSemesterList = await httpRequest('GET',`${import.meta.env.VITE_API_URL}/semester/get-all-Semester`);
         return aSemesterList?.data;
       }catch(err){
        return false
       }
    },
    updateSemester: async(oPayload = {
        insId: '',
        degId: '',
        prgCd: '',
        semId: '',
        semNm: '',
        desc: '',
        _id: ""
    }) => {
        try{
            const id = oPayload._id;
            delete oPayload._id
            const {data} = await httpRequest('PATCH',`${import.meta.env.VITE_API_URL}/semester/update/${id}`,oPayload);
            get().getSemester(data?._id);
            return true
        }catch(err){
            throw err;
        }
    },
    createSemesterGroup: async(oPayload) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/semester/create-semester-group`,oPayload);
            get().getSemesterGroup();
            return true
        }catch(err){
            return false
        }
    },
    getSemesterGroup: async() => {
       try{
         const aSemesterGroupList = await httpRequest('GET',`${import.meta.env.VITE_API_URL}/semester/get-all-semester-group`);
         set({semesterGroupList: aSemesterGroupList?.data});
         return aSemesterGroupList?.data;
       }catch(err){
        return false
       }
    },
}))
export default useDegreeStore;