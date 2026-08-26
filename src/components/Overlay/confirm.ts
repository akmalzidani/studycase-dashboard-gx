import { useConfirmStore, type ConfirmOptions } from "@/stores/useConfirmStore";

export function confirm(options: ConfirmOptions) {
  const _handleShow = useConfirmStore.getState().__handleShow;
  _handleShow(options);
}

export type { ConfirmOptions };
