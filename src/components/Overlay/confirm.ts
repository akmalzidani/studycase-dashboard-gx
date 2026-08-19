import { useConfirmStore, type ConfirmOptions } from "@/stores/useConfirmStore";

export function confirm(options: ConfirmOptions) {
  useConfirmStore.getState().show(options);
}

export type { ConfirmOptions };
