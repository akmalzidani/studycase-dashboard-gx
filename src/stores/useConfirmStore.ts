import { create } from "zustand";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning" | "success";
  onConfirm: () => void;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  show: (options: ConfirmOptions) => void;
  hide: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  options: null,
  show: (options) => set({ options }),
  hide: () => set({ options: null }),
}));
