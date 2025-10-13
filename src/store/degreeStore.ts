import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';
import {
  updateErrorMessage,
} from '../utils/functions/toast-message';

export interface createDegreePayload {
  insId: string,
  degCd: String,
  degNm: String,
  desc: String,
  _id?: '',
  deleted: boolean;
}

export interface DegreeIF {
  _id: string;
  createdAt: string;
  updatedAt: string;
  insId: String;
  degreeId: String;
  degreeName: String;
  description: String;
}

interface DegreeState {
  degrees: DegreeIF[];
  degreeData: object,
  createDegree: (payload: createDegreePayload) => Promise<boolean>,
  getDegree: (id: string) => Promise<boolean>,
  getDegrees: (firstRender?: boolean) => Promise<object[] | boolean>;
  updateDegree: (payload: createDegreePayload) => Promise<boolean>
}

// Degree Store to handle Degree create update get functionalities
const useDegreeStore = create<DegreeState>((set, get) => ({
  degrees: [],
  degreeData: {},
  createDegree: async (oPayload = {
    insId: '',
    degCd: '',
    degNm: '',
    desc: '',
    deleted: false
  }) => {
    try {
      const { data } = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/degree/create`, oPayload);
      get().getDegree(data?._id);
      return true
    } catch (err) {
      useToastStore.getState().showToast('error', updateErrorMessage());
      return false
    }
  },
  getDegree: async (id = '') => {
    try {
      return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/degree/get-by-id/${id}`))?.data;
    } catch (err) {
      return false
    }
  },
  getDegrees: async () => {
    try {
      return (await httpRequest('GET', `${import.meta.env.VITE_API_URL}/degree/`))?.data;
    } catch (err) {
      return false
    }
  },
  updateDegree: async (oPayload = {
    insId: '',
    degCd: '',
    degNm: '',
    desc: '',
    _id: '',
    deleted: false
  }) => {
    try {
      const { data } = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/degree/update/${oPayload._id}`, oPayload);
      get().getDegree(data?._id);
      return true
    } catch (err) {
      return false
    }
  }
}))
export default useDegreeStore;