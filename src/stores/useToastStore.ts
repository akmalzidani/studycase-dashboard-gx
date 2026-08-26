import { create } from "zustand";

export type ToastType = "success" | "danger" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  __toasts: ToastMessage[];
  __handleAdd: (message: string, type: ToastType) => void;
  __handleRemove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  __toasts: [],
  __handleAdd: (message, type) => {
    const id = crypto.randomUUID();
    set((state) => ({
      __toasts: [...state.__toasts, { id, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        __toasts: state.__toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000);
  },
  __handleRemove: (id) =>
    set((state) => ({
      __toasts: state.__toasts.filter((toast) => toast.id !== id),
    })),
}));
