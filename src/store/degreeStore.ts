import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';

export interface createDegreePayload{
  institutionName: String,
  degreeId: String,
  degreeName: String,
  description: String
}

export interface DegreeIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  institutionName: String;
  degreeId: String;
  degreeName: String;
  description: String;
}

interface DegreeState {
    degrees: DegreeIF[];
    degreeData: object,
    createDegree: (payload: createDegreePayload) => Promise<boolean>,
    getDegree: (id: string) => Promise<boolean>,
    getDegrees: (firstRender?: boolean) => Promise<boolean>;
    updateDegree: (payload: createDegreePayload) => Promise<boolean>
}

// Degree Store to handle Degree create update get functionalities
const useDegreeStore = create<DegreeState>((set,get) => ({
    degrees:[],
    degreeData: {},
    createDegree: async(oPayload = {
        institutionName: '',
        degreeId: '',
        degreeName: '',
        description: ''
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/degree/create`,oPayload);
            get().getDegree(data?._id);
            return true
        }catch(err){
            return false
        }
    },
    getDegree: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/degree/get-by-id/${id}`))?.data;
       }catch(err){
        return false
       }
    },
    getDegrees: async() => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/degree/`))?.data;
       }catch(err){
        return false
       }
    },
    updateDegree: async(oPayload = {
        institutionName: '',
        degreeId: '',
        degreeName: '',
        description: ''
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/degree/update`,oPayload);
            get().getDegree(data?._id);
            return true
        }catch(err){
            return false
        }
    }
}))
export default useDegreeStore;