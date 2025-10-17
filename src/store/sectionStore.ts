import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createSectionPayload{
  insId: String,
  sectionCode: String,
  sectionName: String,
  description: String,
  _id?: String,
  deleted: boolean;
}

export interface SectionIF {
  createdAt: string;
  updatedAt: string;
  insId: String;
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
        insId: '',
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
            throw err
        }
    },
    getSection: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/section/get-by-id/${id}`))?.data;
       }catch(err){
        throw err
       }
    },
    getSections: async() => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/section/`))?.data;
       }catch(err){
        throw err
       }
    },
    updateSection: async(oPayload = {
        insId: '',
        sectionCode: '',
        sectionName: '',
        description: '',
        _id: '',
        deleted: false
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/section/update/${oPayload._id}`,oPayload);
            get().getSection(data?._id);
            return true
        }catch(err){
            throw err
        }
    }
}))
export default useSectionStore;