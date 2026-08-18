import { useConfirmStore } from "@/stores/useConfirmStore";

export function useConfirm() {
  return useConfirmStore((state) => state.confirm);
}
