import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import useAuthStore from '../../store/authStore';
import style from './calendar.module.css';
import ViewEventDialog from './view-event';
import useCalendarEventStore from '../../store/calendarEventStore';
import TableSelect from '../../components/bu-select';
import useDepartmentStore from '../../store/departmentStore';
import { semesterSampleList } from '../../utils/static-data';
import useSubjectStore from '../../store/subjectStore';
import { useNavigate, useParams } from 'react-router-dom';
import TableControlBox from '../../components/table-control-box';
import Button from '../../components/button';
import moment from 'moment';

// Utility function for formatting dates
const formatDate = (date: string | Date) => moment(date).format('YYYY-MM-DD');

// Utility function to create holiday list
const getHolidayList = (events: any[]) =>
  events.filter((event) => event.holiday).map((event) => formatDate(event.date));

// Utility function to create calendar events
const mapCalendarEvents = (events: any[], style: any) =>
  events.map((event) => ({
    title: event.holiday ? event.holidayName : `${event.subject} ${event.startTime}-${event.endTime}`,
    start: event.date,
    className: `${style.eventTag} ${
      event.attendanceMarked ? style.attendanceMarked : event.holiday ? style.holidayTag : ''
    }`,
    data: { ...event },
  }));

export default function CalendarComponent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { getFilteredSubjects, subjectOptions } = useSubjectStore();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { getCalendarEvents, calendarEvents, getCalendarEvent } = useCalendarEventStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Memoized query parameters for fetching calendar events
  const calendarQuery = useMemo(
    () => ({
      teacher: id || user?.user._id,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      department: selectedDepartment,
      semester: selectedSemester,
      subject: selectedSubject,
    }),
    [id, user, currentDate, selectedDepartment, selectedSemester, selectedSubject],
  );

  useEffect(() => {
    getCalendarEvents(calendarQuery);
  }, [calendarQuery, getCalendarEvents]);

  useEffect(() => {
    if (!departmentOptions.length) getDepartments();
    if (selectedDepartment && selectedSemester) {
      getFilteredSubjects({ department: selectedDepartment, semester: selectedSemester });
    }
  }, [selectedDepartment, selectedSemester, departmentOptions, getDepartments, getFilteredSubjects]);

  const handleEventClick = async (info: any) => {
    const { date, startTime, endTime, teacher } = info.event?.extendedProps?.data || {};
    if (!date || !startTime || !endTime || !teacher) return;

    const requestBody = {
      startTime,
      endTime,
      date,
      teacher: teacher._id,
      year: date.split('-')[0],
      month: Number(date.split('-')[1]) - 1,
    };

    await getCalendarEvent(requestBody);
    setDialogOpen(true);
  };

  // Memoized calendar events and holiday list
  const createEvents = useMemo(() => mapCalendarEvents(calendarEvents, style), [calendarEvents]);
  const holidays = useMemo(() => getHolidayList(calendarEvents), [calendarEvents]);

  return (
    <div className={style.container}>
      <TableControlBox showBackButton={!!id} tableName="Calendar Events">
        <TableSelect
          options={departmentOptions}
          update={setSelectedDepartment}
          clearFilter={() => setSelectedDepartment('')}
          lockSelection={!!(selectedSemester || selectedSubject)}
        />
        <TableSelect
          options={semesterSampleList}
          update={setSelectedSemester}
          clearFilter={() => setSelectedSemester('')}
          label="Semester"
          lockSelection={!!selectedSubject}
        />
        <TableSelect
          options={subjectOptions}
          update={setSelectedSubject}
          clearFilter={() => setSelectedSubject('')}
          label="Subject"
        />
        <Button secondary onClick={() => navigate('/attendance/list')}>
          Attendance List
        </Button>
      </TableControlBox>
      <div className={style.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={createEvents}
          eventClick={handleEventClick}
          datesSet={(e) => setCurrentDate(new Date(e.view.currentStart))}
          eventDisplay="block"
          displayEventTime={false}
          // height={window.innerHeight + 200}
          dayCellClassNames={(info) => (holidays.includes(formatDate(info.date)) ? style.holidayCell : '')}
        />
      </div>
      <ViewEventDialog dialogOpen={dialogOpen} closeDialog={() => setDialogOpen(false)} />
    </div>
  );
}
