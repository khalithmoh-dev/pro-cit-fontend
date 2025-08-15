import { create } from 'zustand';
interface LayoutState {
  sidebar: boolean;
  toggleSidebar: () => void;
  setSidebar: (state: boolean) => void;
}

const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebar: false,

  toggleSidebar: () => {
    set({ sidebar: !get().sidebar });
  },
  setSidebar: (state) => {
    set({ sidebar: state });
  },
}));

export default useLayoutStore;
