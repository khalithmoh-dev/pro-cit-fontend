import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createProgramPayload{
  insId: string,
  degId: string,
  prgCd: String,
  prgNm: String,
  desc: String,
  deleted: boolean
}

export interface ProgramIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  insId: String;
  prgCd: String;
  prgNm: String;
  desc: String;
}

interface ProgramState {
    programs: ProgramIF[];
    programData: object,
    createProgram: (payload: createProgramPayload) => Promise<boolean>,
    getProgram: (id: string) => Promise<boolean>,
    getPrograms: () => Promise<[]>;
    updateProgram: (payload: createProgramPayload) => Promise<boolean>
}

// Program Store to handle Program create update get functionalities
const useProgramStore = create<ProgramState>((set,get) => ({
    programs:[],
    programData: {},
    createProgram: async(oPayload = {
        insId: '',
        prgCd: '',
        prgNm: '',
        desc: '',
        deleted: false
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/program/create`,oPayload);
            get().getProgram(data?._id);
            return true
        }catch(err){
            return false
        }
    },
    getProgram: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/program/get-by-id/${id}`))?.data;
       }catch(err){
        return false
       }
    },
    getPrograms: async() => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/program/`))?.data;
       }catch(err){
        return false
       }
    },
    updateProgram: async(oPayload = {
        insId: '',
        prgCd: '',
        prgNm: '',
        desc: '',
        deleted: false
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/program/update`,oPayload);
            get().getProgram(data?._id);
            return true
        }catch(err){
            return false
        }
    }
}))
export default useProgramStore;