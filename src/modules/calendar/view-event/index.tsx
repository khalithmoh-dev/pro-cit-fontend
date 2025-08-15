import React, { useState } from 'react';
import style from './view-event.module.css';
import Dialog from '../../../components/dialog';
import DialogTitle from '../../../components/dialog/dialog-title';
import DialogBody from '../../../components/dialog/dialog-body';
import DialogAction from '../../../components/dialog/dialog-action';
import Button from '../../../components/button';
import useCalendarEventStore, { CalendarEventsIF } from '../../../store/calendarEventStore';
import { useNavigate } from 'react-router-dom';
import SingleSelect from '../../../components/single-select';
import SelectTeacherDialog from '../select-teacher';
import useEmployeeStore from '../../../store/employeeStore';
import convertDateFormat from '../../../utils/functions/convert-date-format';

type ScheduleDetailProps = {
  _id: string;
  month?: string;
  week?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  student?: string[];
  subject?: string;
  department?: {
    name: string;
    code: string;
  };
  group?: {
    _id: string;
    name: string;
    batch: string;
    semester: string;
  };
  teacher?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

interface PropsIF {
  dialogOpen: boolean;
  closeDialog: () => void;
}

const ViewEventDialog: React.FC<PropsIF> = ({ dialogOpen, closeDialog }) => {
  const navigate = useNavigate();
  const { calendarEvent } = useCalendarEventStore();
  const { getAvailableTeachers } = useEmployeeStore();
  const [selectDialog, setSelectDialog] = useState(false);

  if (!calendarEvent || calendarEvent.length === 0) return null;
  const event = calendarEvent[0];

  const requestClickHandler = () => {
    setSelectDialog(true);
    getAvailableTeachers({
      date: event.date,
      startTime: event?.startTime,
      endTime: event?.endTime,
      semester: event?.semester,
      department: event?.department._id,
      subjectType: event?.subject?.type,
    });
  };

  return (
    <Dialog isOpen={dialogOpen} onClose={closeDialog}>
      <DialogTitle onClose={closeDialog}>Event Details</DialogTitle>
      <DialogBody>
        <ScheduleDetail {...event} />
      </DialogBody>
      {!event.attendanceMarked && (
        <DialogAction>
          <Button secondary onClick={requestClickHandler}>
            Request
          </Button>

          <Button onClick={() => navigate(`/attendance/mark/${event._id}@${event.date}`)}>Mark Attendence</Button>
        </DialogAction>
      )}
      <SelectTeacherDialog dialogOpen={selectDialog} closeDialog={() => setSelectDialog(false)} />
    </Dialog>
  );
};

export default ViewEventDialog;

const ScheduleDetail: React.FC<CalendarEventsIF> = ({
  week,
  date,
  startTime,
  endTime,
  department,
  subject,
  group,
  teacher,
}) => {
  return (
    <div className={style.scheduleDetailContainer}>
      <div className={style.details}>
        <p>
          <strong>Day:</strong> {week || ''}
        </p>
        <p>
          <strong>Date:</strong> {convertDateFormat(date || '') || ''}
        </p>
        <p>
          <strong>Time:</strong> {startTime || ''} - {endTime || ''}
        </p>
        <p>
          <strong>Semester:</strong> {group?.semester || ''}
        </p>
        <p>
          <strong>Batch:</strong> {group?.batch || ''}
        </p>
        <p>
          <strong>Subject:</strong> {subject.shortName || ''}
        </p>
        <p>
          <strong>Group:</strong> {group?.name || ''}{' '}
        </p>
        <p>
          <strong>Teacher:</strong> {teacher?.firstName || ''} {teacher?.lastName || ''}
        </p>
        <p>
          <strong>Department:</strong> {department?.name || ''} ({department?.code || ''})
        </p>
      </div>
    </div>
  );
};
