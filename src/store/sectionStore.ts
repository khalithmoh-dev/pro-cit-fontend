import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createSectionPayload{
  institutionName: String,
  sectionCode: String,
  sectionName: String,
  description: String,
  deleted: boolean;
}

export interface SectionIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  institutionName: String;
  sectionCode: String;
  sectionName: String;
  description: String;
}

interface SectionState {
    sections: SectionIF[];
    sectionData: object,
    createSection: (payload: createSectionPayload) => Promise<boolean>,
    getSection: (id: string) => Promise<boolean>,
    getSections: (firstRender?: boolean) => Promise<object[] | boolean >;
    updateSection: (payload: createSectionPayload) => Promise<boolean>
}

// Section Store to handle Section create update get functionalities
const useSectionStore = create<SectionState>((set,get) => ({
    sections:[],
    sectionData: {},
    createSection: async(oPayload = {
        institutionName: '',
        sectionCode: '',
        sectionName: '',
        description: '',
        deleted: false
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/section/create`,oPayload);
            get().getSection(data?._id);
            return true
        }catch(err){
            return false
        }
    },
    getSection: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/section/get-by-id/${id}`))?.data;
       }catch(err){
        return false
       }
    },
    getSections: async() => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/section/`))?.data;
       }catch(err){
        return false
       }
    },
    updateSection: async(oPayload = {
        institutionName: '',
        sectionCode: '',
        sectionName: '',
        description: '',
        deleted: false
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/section/update`,oPayload);
            get().getSection(data?._id);
            return true
        }catch(err){
            return false
        }
    }
}))
export default useSectionStore;