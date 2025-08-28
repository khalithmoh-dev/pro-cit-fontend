import { create } from "zustand";
import httpUploadRequest from "../utils/functions/http-upload-request";

interface UploadedFile {
  fileName: string;
  url: string;
}

interface BaseState {
  handleCloudUpload: (formData: FormData) => Promise<boolean>;
  parseFormDataAndUpload: (files: File[]) => Promise<object | boolean>;
  upldedRec: UploadedFile | UploadedFile[] | null;
}

const useBaseRoutes = create<BaseState>((set, get) => ({
  upldedRec: {url:'', fileName: ''},

  parseFormDataAndUpload: async (files) => {
   try {
        const formData = new FormData();
        console.log('filesssssssss', files);

        // Iterate over the File objects directly
        for (const eachFile of files ?? []) {
            // The File object already contains the name and content
            formData.append("files", eachFile); 
        }
        
        console.log('formDataformData', formData);
        await get().handleCloudUpload(formData);
        return true;
    } catch (err) {
        return false;
    }
  },
  handleCloudUpload: async (formData) => {
    try {
      const uploadedDtl = await httpUploadRequest(
        "POST",
        `${import.meta.env.VITE_API_URL}/form/upload`,
        formData
      );
      set({ upldedRec: uploadedDtl.data });
      return true;
    } catch (err) {
      return false;
    }
  }
}));

export default useBaseRoutes;



// getImageBlob = (croppedImage: any): Promise<Blob | null> => {
//   return new Promise((resolve, reject) => {
//     if (!croppedImage?.crop || !croppedImage?.canvas) {
//       return reject('Invalid cropped image');
//     }

//     croppedImage.canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png', 1);
//   });
// };