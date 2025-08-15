import React, { useState } from 'react';
import style from './select-teacher.module.css';
import Dialog from '../../../components/dialog';
import DialogTitle from '../../../components/dialog/dialog-title';
import DialogBody from '../../../components/dialog/dialog-body';
import DialogAction from '../../../components/dialog/dialog-action';
import Button from '../../../components/button';
import useCalendarEventStore from '../../../store/calendarEventStore';
import { useNavigate } from 'react-router-dom';
import SingleSelect from '../../../components/single-select';
import useEmployeeStore from '../../../store/employeeStore';
import useSwapStore from '../../../store/swapStore';

interface PropsIF {
  dialogOpen: boolean;
  closeDialog: () => void;
}

const SelectTeacherDialog: React.FC<PropsIF> = ({ dialogOpen, closeDialog }) => {
  const { availableTeachers } = useEmployeeStore();
  const { calendarEvent } = useCalendarEventStore();
  const { createSwap } = useSwapStore();
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const requestHandler = async () => {
    const reqBody = {
      swappingDate: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      requestBy: event.teacher._id,
      requestTo: selectedTeacher,
      department: event.department._id,
      semester: event.group.semester,
      subject: event.subject._id,
    };
    console.log('reqBody ===============', reqBody);

    const res = await createSwap(reqBody);
    if (res) closeDialog();
  };

  if (!calendarEvent || calendarEvent.length === 0) return null;
  const event = calendarEvent[0];

  return (
    <Dialog isOpen={dialogOpen} onClose={closeDialog}>
      <DialogTitle onClose={closeDialog}>Select Teacher</DialogTitle>
      <DialogBody>
        <SingleSelect
          label="Select Teacher"
          options={availableTeachers}
          onChange={(e) => setSelectedTeacher(e.value)}
        />
      </DialogBody>
      <DialogAction>
        <Button secondary onClick={requestHandler}>
          Submit
        </Button>
      </DialogAction>
    </Dialog>
  );
};

export default SelectTeacherDialog;
