import { useToastStore, type ToastType } from "@/stores/useToastStore";

function show(message: string, type: ToastType) {
  const _handleAdd = useToastStore.getState().__handleAdd;
  _handleAdd(message, type);
}

export const toast = {
  success: (message: string) => show(message, "success"),
  error: (message: string) => show(message, "danger"),
  warning: (message: string) => show(message, "warning"),
  info: (message: string) => show(message, "info"),
};
