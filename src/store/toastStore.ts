import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  type: ToastType;
  message: string;
  duration?: number; // In milliseconds (optional)
  autoClose?: boolean; // Whether to auto-close the toast
}

interface ToastStore {
  toast: Toast | null;
  showToast: (type: ToastType, message: string) => void;
  removeToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (type, message) => {
    set({
      toast: {
        type,
        message,
        duration: 2000, // Default duration
        autoClose: true, // Default auto-close behavior
      },
    });
  },
  removeToast: () => set({ toast: null }),
}));
