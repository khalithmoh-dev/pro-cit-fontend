import { useEffect, useState } from 'react';
import Dialog from '../../../../components/dialog';
import DialogTitle from '../../../../components/dialog/dialog-title';
import httpRequest from '../../../../utils/functions/http-request';
import DialogBody from '../../../../components/dialog/dialog-body';

interface PropsIF {
  dialog: string;
  onClose: () => void;
}

const ViewDocumentDialog: React.FC<PropsIF> = ({ dialog, onClose }) => {
  const [fileSrc, setFileSrc] = useState('');

  const getFile = async () => {
    if (!dialog) {
      setFileSrc('');
      return;
    }
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/get/file-preview`, {
        fileName: dialog,
        purpose: 'download',
      });

      if (res?.data) {
        setFileSrc(res.data); // Store the image data or URL in state
      } else {
        console.error('Invalid file data returned from API');
      }
    } catch (error) {
      console.error('File download error:', error);
    }
  };

  // Call getFile when the component mounts or `student` changes
  useEffect(() => {
    if (dialog) {
      getFile();
    }
  }, [dialog]);
  return (
    <Dialog isOpen={Boolean(dialog)} onClose={onClose}>
      <DialogTitle onClose={onClose}>View Document</DialogTitle>
      <DialogBody>
        {fileSrc ? <iframe style={{ height: '80vh', width: '80vw' }} src={fileSrc} /> : <div>No file</div>}
      </DialogBody>
    </Dialog>
  );
};

export default ViewDocumentDialog;
