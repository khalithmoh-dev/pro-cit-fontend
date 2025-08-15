import React, { useEffect, useState } from 'react';
import Dialog from '../../../components/dialog';
import DialogTitle from '../../../components/dialog/dialog-title';
import DialogBody from '../../../components/dialog/dialog-body';
import DialogAction from '../../../components/dialog/dialog-action';
import Button from '../../../components/button';
import SingleSelect from '../../../components/single-select';
import useSwapStore from '../../../store/swapStore';
import useSubjectStore from '../../../store/subjectStore';
import useAuthStore from '../../../store/authStore';
import { SelectOptionIF } from '../../../interface/component.interface';

interface PropsIF {
  selectedRequestId: string;
  requestedSubjectId: string;
  closeDialog: () => void;
  getAllSwaps: () => void;
}

const SelectSubjectDialog: React.FC<PropsIF> = ({
  selectedRequestId,
  requestedSubjectId,
  closeDialog,
  getAllSwaps,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<SelectOptionIF[]>([]);
  const { updateSwap } = useSwapStore();
  const { user } = useAuthStore();
  const { getUserSubjects } = useSubjectStore();

  useEffect(() => {
    const getSubjectOptions = async () => {
      const res: SelectOptionIF[] = await getUserSubjects(requestedSubjectId);
      setAvailableSubjects(res);
    };
    if (selectedRequestId && user?.user?._id) {
      getSubjectOptions();
    }
  }, [selectedRequestId]);

  const onSubmitHandler = async () => {
    const res = await updateSwap(
      {
        accepted: true,
        groupId: selectedSubject.split('_')[0],
        subjectId: selectedSubject.split('_')[1],
      },
      selectedRequestId,
    );
    if (res) {
      getAllSwaps();
      closeDialog();
    }
  };

  return (
    <Dialog isOpen={Boolean(selectedRequestId)} onClose={closeDialog}>
      <DialogTitle onClose={closeDialog}>Select Subject</DialogTitle>
      <DialogBody>
        <SingleSelect
          label="Select Subject"
          options={availableSubjects}
          onChange={(e) => setSelectedSubject(e.value)}
        />
      </DialogBody>
      <DialogAction>
        <Button onClick={closeDialog} secondary>
          Cancel
        </Button>
        <Button onClick={onSubmitHandler}>Submit</Button>
      </DialogAction>
    </Dialog>
  );
};

export default SelectSubjectDialog;
