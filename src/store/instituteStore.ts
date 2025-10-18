import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import useAuthStore from './authStore';
interface createInstitutePayload{
    insname: string,
    insCode: string,
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

interface InstituteDetails {
  _id: string,
  insname: string
}
interface InstituteState {
    insData: object,
    getInstitute: (id: string) => Promise<boolean>,
    updateInstitute: (payload: createInstitutePayload) => Promise<boolean>
    getLogInIns: () => InstituteDetails
}

// Institute Store to handle institution create update get functionalities
const useInstituteStore = create<InstituteState>((set,get) => ({
    insData: {},
    getInstitute: async(id = '') => {
       try{
         return (await httpRequest('GET',`${import.meta.env.VITE_API_URL}/institute/get-by-id/${'68c2d50407f3ff56fed55b21'}`))?.data;
       }catch(err){
        return false
       }
    },
    getLogInIns: () => {
        return useAuthStore.getState().instituteDtls;
    },
    updateInstitute: async(oPaylaod = {
        insname: '',
        insCode: ''
    }) => {
        try{
            const {data} = await httpRequest('POST',`${import.meta.env.VITE_API_URL}/institute/update`,oPaylaod);
            get().getInstitute(data?._id);
            return true
        }catch(err){
            return false
        }
    }
}))
export default useInstituteStore;