import { create } from "zustand";
import httpUploadRequest from "../utils/functions/http-upload-request";
import useInstituteStore from "./instituteStore";
import httpRequest from '../utils/functions/http-request';

interface UploadedFile {
  fileName: string;
  url: string;
}

export interface BaseData {
  degree: string[];
  program: string[];
  department?: string[];
  semester?: string[];
}

interface BaseState {
  handleCloudUpload: (formData: FormData) => Promise<boolean>;
  parseFormDataAndUpload: (files: File[]) => Promise<object | boolean>;
  getBaseData: (arr: string[]) => Promise<BaseData>;
  upldedRec: UploadedFile | UploadedFile[] | null;
}


const useBaseStore = create<BaseState>((set, get) => ({
  upldedRec: {url:'', fileName: ''},
  getBaseData: async(aReq) => {
    try{
      const oInstDtls = useInstituteStore.getState().getLogInIns();
      if(!oInstDtls?._id){
        throw 'invalid req'
      }
      return await httpRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/basedata/get-base-data-by-insid`,
        {aRqstdFlds: aReq}
      );
    }catch(err){
      return {degree: [], program:[]};
    }
  },
  parseFormDataAndUpload: async (files) => {
   try {
        const formData = new FormData();

        // Iterate over the File objects directly
        for (const eachFile of files ?? []) {
            // The File object already contains the name and content
            formData.append("files", eachFile); 
        }

        const upldData = await get().handleCloudUpload(formData);
        return upldData;
    } catch (err) {
        throw err;
    }
  },
  handleCloudUpload: async (formData) => {
    try {
      const uploadedDtl = await httpUploadRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/form/upload`,
        formData
      );
      return uploadedDtl.data;
    } catch (err) {
      throw err;
    }
  }
}));

export default useBaseStore;



// getImageBlob = (croppedImage: any): Promise<Blob | null> => {
//   return new Promise((resolve, reject) => {
//     if (!croppedImage?.crop || !croppedImage?.canvas) {
//       return reject('Invalid cropped image');
//     }

//     croppedImage.canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png', 1);
//   });
// };