import React, { useState } from 'react';
import style from './preview.module.css';
import DialogTitle from '../../../../../dialog/dialog-title';
import DialogBody from '../../../../../dialog/dialog-body';
import DialogAction from '../../../../../dialog/dialog-action';
import Button from '../../../../../button';
import Dialog from '../../../../../dialog';
import PDFViewer from '../pdf-viewer';
import CropImage from '../crop-image';
import httpUploadRequest from '../../../../../../utils/functions/http-upload-request';
import Spinner from '../../../../../spinner';

interface PropsIF {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: any;
  base64Data: string;
  loading: boolean;
  onClickUpload: (file: any) => void;
}

const PreviewUploadDialog: React.FC<PropsIF> = ({
  onClickUpload,
  isOpen,
  onClose,
  selectedFile,
  base64Data,
  loading,
}) => {
  const [croppedImage, setCroppedImage] = useState(null);
  if (!selectedFile) return <></>;
  const type =
    selectedFile?.type === 'image/png' || selectedFile?.type === 'image/jpeg'
      ? 1
      : selectedFile?.type === 'application/pdf'
        ? 2
        : 0;

  return (
    <Dialog medium isOpen={isOpen} onClose={onClose}>
      <DialogTitle onClose={onClose}>{type === 1 ? 'Edit Image' : 'PDF Preview'}</DialogTitle>
      <DialogBody>
        {type === 1 ? (
          <CropImage setCroppedImage={setCroppedImage} selectedFile={base64Data} />
        ) : type === 2 ? (
          <PDFViewer base64Data={base64Data} />
        ) : (
          <></>
        )}
      </DialogBody>
      <DialogAction>
        <Button onClick={() => onClickUpload(croppedImage || null)}>{loading ? <Spinner /> : 'Upload'}</Button>
      </DialogAction>
    </Dialog>
  );
};

export default PreviewUploadDialog;
