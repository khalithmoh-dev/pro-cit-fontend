import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import useAuthStore from './authStore';
import { setUserDetails } from '../utils/functions/helper';
interface createInstitutePayload{
    insName: string,
    insCode: string,
    _id?: string,
    insLogo?: [],
    acrtdBy?: string,
    insDesc?: string,
    addr1?: string,
    addr2?: string,
    addr3?: string,
    pnCd?: string,
    cntctNum?: string,
    email?: string,
    webSt?: string,
    billCntctNm?: string,
    billCntctNum?: string,
    billCntctMail?: string,
    admCntctNm?: string,
    admCntctNum?: string,
    admCntctMail?: string,
    xmCntctNm?: string,
    xmCntctNum?: string,
    xmCntctMail?: string,
    gnCntctNm?: string,
    gnCntctNum?: string,
    gnCntctMail?: string,
    wrkDys?: string[],
    smsUrl?: string,
    smsPwd?: string,
    smsUsrId?: string,
    smsSndrId?: string,
    smsApiKey?: string,
    isAbsNtf?: boolean,
    absntTmplt?: string,
    bDayTmplt?: boolean,
    isBdayMsg?: string
}

export interface InstituteDetails {
  _id: string,
  orgId?: string,
  insName: string,
  insCode: string
}

export interface getInstitutePayload {
    orgId?: string;
    isFromOrg?: boolean;
    insId?: string;
}

interface InstituteState {
    insData: object,
    getInstitute: (id: string) => Promise<createInstitutePayload>,
    updateInstitute: (payload: createInstitutePayload) => Promise<boolean>
    getLogInIns: () => InstituteDetails
    createChildInstitute: (payload: createInstitutePayload) => Promise<boolean>
    getChildInstitutes: (payload: getInstitutePayload) => Promise<createInstitutePayload[]>
    switchInstitute: (payload: getInstitutePayload) => Promise<boolean>
}

// Institute Store to handle institution create update get functionalities
const useInstituteStore = create<InstituteState>((set,get) => ({
    insData: {},
    getInstitute: async() => {
       try{
            const instId = useAuthStore.getState().instituteDtls._id;
           const instData = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/institute/get-by-id/${instId}`);
           if(instData?.data){
            useAuthStore.setState({instituteDtls: {_id:instData?.data?._id, insName: instData?.data?.insName, insCode: instData?.data?.insCode}});
           }
           return instData?.data;
       }catch(err){
        return false
       }
    },
    getLogInIns: () => {
        return useAuthStore.getState().instituteDtls;
    },
    updateInstitute: async(oPaylaod = {
        insName: '',
        insCode: ''
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/institute/update`,oPaylaod);
            get().getInstitute(data?._id);
            return true
        }catch(err){
            return false
        }
    },
    createChildInstitute: async(oPayload = {
        insName: '',
        insCode: ''
    }) => {
        const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/institute/create`,oPayload);
        get().getInstitute(data?._id);
        return true;
    },

    getChildInstitutes: async (payload) => {
        try {
            const instData = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/institute/get-by-orgid`, payload);
            const aChildInst = instData?.data?.filter(inst => inst?._id !== payload?.orgId) || [];
            return aChildInst;
        } catch (err) {
            return [];
        }
    },

    switchInstitute: async (payload) => {
        try {
            const instData = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/institute/switch-institute`, payload);
            if (instData?.data) {
                setUserDetails(instData.data, useAuthStore.setState);
            }
            return true;
        } catch (err) {
            return false;
        }
    }
}))
export default useInstituteStore;