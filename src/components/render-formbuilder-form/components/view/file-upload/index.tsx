import React, { useState } from 'react';
import style from './file-upload.module.css';
import { fileUploadErrorHandler } from '../../error-handler';
import { FieldIF } from '../../../../../interface/component.interface';
import httpUploadRequest from '../../../../../utils/functions/http-upload-request';
import httpRequest from '../../../../../utils/functions/http-request';
import PreviewUploadDialog from './preview-dialog';

interface FileUploadPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const FileUpload: React.FC<FileUploadPropsIF> = ({ index, form, setForm }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [s3FileName, setS3FileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const data = [...form];
  let field = data[index];

  const onClickUpload = async (croppedImage: any) => {
    if (!selectedFile) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    try {
      if (['image/png', 'image/jpeg'].includes(selectedFile.type)) {
        const blob: any = await getImageBlob(croppedImage);
        if (blob) {
          blob.originalname = selectedFile.name;
          formData.append('files', blob);
        }
      } else {
        formData.append('files', selectedFile);
      }

      setLoading(true);

      const res = await httpUploadRequest('POST', `${import.meta.env.VITE_API_URL}/form/upload`, formData);

      if (res.success) {
        setOpen(false);
        setS3FileName(res.data.fileName);

        const updatedData = fileUploadErrorHandler(field, res.data.fileName);
        field = updatedData;
        setForm(data);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onBlur = () => {
    const updatedData = fileUploadErrorHandler(field, field.value);
    field = updatedData;
    setForm(data);
  };

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOpen(true);

    try {
      const binaryString = await fileToBinary(file);
      setBase64Data(binaryString);
    } catch (error) {
      console.error('File conversion error:', error);
    }
  };

  const handleDownloadButton = async () => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/get/file`, {
        fileName: s3FileName,
        purpose: 'download',
      });
      window.open(res.data, '_blank');
    } catch (error) {
      console.error('File download error:', error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.fieldContainer}>
        <label className={style.fieldLabel}>{`${field.inputLabel} ${field.settings[0].value ? ' *' : ''}`}</label>
        <div className={`${style.inputWrapper} ${field.errorMessage && style.inputFieldError}`}>
          <input
            onBlur={onBlur}
            onChange={onChangeFile}
            accept={field.settings[1]?.value || ''}
            type="file"
            className={style.textInput}
            // value={field.value}
          />

          {s3FileName ? (
            <span className={style.downloadButton} onClick={handleDownloadButton}>
              Download
            </span>
          ) : (
            <span className={style.uploadIndicator}>{field.value.split('.')[0]}</span>
          )}
        </div>

        {field.errorMessage && <div className={style.fieldError}>{field.errorMessage}</div>}
      </div>

      <PreviewUploadDialog
        onClickUpload={onClickUpload}
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        selectedFile={selectedFile}
        base64Data={base64Data}
      />
    </div>
  );
};

export default FileUpload;

export const fileToBinary = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function extracted outside of the component
export const getImageBlob = (croppedImage: any): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    if (!croppedImage?.crop || !croppedImage?.canvas) {
      return reject('Invalid cropped image');
    }

    croppedImage.canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png', 1);
  });
};
