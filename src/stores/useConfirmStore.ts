import { create } from "zustand";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning" | "success";
  handleConfirm: () => void;
}

interface ConfirmState {
  __options: ConfirmOptions | null;
  __handleShow: (options: ConfirmOptions) => void;
  __handleHide: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  __options: null,
  __handleShow: (__options) => set({ __options }),
  __handleHide: () => set({ __options: null }),
}));
