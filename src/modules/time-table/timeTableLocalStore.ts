import { create } from 'zustand';

interface TimeTableLocalStore {
  department: string;
  setDepartment: (state: string) => void;

  semester: string;
  setSemester: (state: string) => void;

  weekName: string;
  setWeekName: (state: string) => void;

  showDialog: string;
  setShowDialog: (state: string) => void;

  timeTableId: string;
  setTimeTableId: (state: string) => void;
}

export const useTimeTableLocalStore = create<TimeTableLocalStore>((set) => ({
  department: '',
  setDepartment: (department) => set({ department }),

  semester: '',
  setSemester: (semester) => set({ semester }),

  weekName: 'Monday',
  setWeekName: (weekName) => set({ weekName }),

  showDialog: '',
  setShowDialog: (showDialog) => set({ showDialog }),

  timeTableId: '',
  setTimeTableId: (timeTableId) => set({ timeTableId }),
}));
