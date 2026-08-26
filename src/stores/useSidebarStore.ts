import { create } from "zustand";

interface SidebarState {
  __isOpen: boolean;
  __handleToggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  __isOpen: true,
  __handleToggleSidebar: () => set((state) => ({ __isOpen: !state.__isOpen })),
}));
