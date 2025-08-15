import { create } from 'zustand';
import httpRequest from '../utils/functions/http-request';
import { useToastStore } from './toastStore';

interface CalendarEventPayloadIF {
  teacher: string;
  date?: string;
  month: number;
  year: number;
  startTime: string;
  endTime: string;
}
export interface CalendarEventsIF {
  _id: string;
  month: string;
  week: string;
  date: string;
  holiday?: string;
  holidayName?: string;
  startTime: string;
  endTime: string;
  student: string[];
  subject: {
    _id: string;
    shortName: string;
    type: string;
    subjectCode: string;
  };
  department: {
    _id: string;
    name: string;
    code: string;
  };
  semester: string;
  attendanceMarked: boolean;
  group: {
    _id: string;
    name: string;
    batch: string;
    semester: string;
  };
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface CalendarEventState {
  calendarEvents: CalendarEventsIF[];
  calendarEvent: CalendarEventsIF[];
  getCalendarEvents: (payload?: any) => Promise<boolean>;
  getCalendarEvent: (payload: CalendarEventPayloadIF) => Promise<boolean>;
}

const useCalendarEventStore = create<CalendarEventState>((set) => ({
  calendarEvents: [],
  calendarEvent: [],

  getCalendarEvents: async (payload = {}) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/events`, payload);
      set({ calendarEvents: res.data });
      return true;
    } catch (error) {
      set({ calendarEvents: [] });
      return false;
    }
  },
  getCalendarEvent: async (payload) => {
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/time-table/event`, payload);
      set({ calendarEvent: res.data });
      return true;
    } catch (error) {
      set({ calendarEvent: [] });
      return false;
    }
  },
}));

export default useCalendarEventStore;
