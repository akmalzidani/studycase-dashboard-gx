import { create } from "zustand";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning" | "success";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmState {
  show: boolean;
  options: ConfirmOptions | null;
  confirm: (options: ConfirmOptions) => void;
  hide: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  show: false,
  options: null,
  confirm: (options) => set({ show: true, options }),
  hide: () => set({ show: false, options: null }),
}));
