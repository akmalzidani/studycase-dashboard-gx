import { useCallback, useMemo, useState } from "react";
import type { ModalTarget } from "@/config/modal.config";

export function useModal(target: ModalTarget) {
  const [activeTarget, setActiveTarget] = useState<ModalTarget | null>(null);

  const open = useCallback(() => setActiveTarget(target), [target]);
  const close = useCallback(() => setActiveTarget(null), []);

  return useMemo(
    () => ({
      isOpen: activeTarget === target,
      target,
      open,
      close,
    }),
    [activeTarget, close, open, target],
  );
}
