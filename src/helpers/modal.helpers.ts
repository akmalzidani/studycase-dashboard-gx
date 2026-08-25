import { Modal as BootstrapModal } from "bootstrap";
import type { OverlayTarget } from "@/config/overlay.config";

export type ModalShownEvent = Event & {
  relatedTarget: HTMLElement | null;
};

export const getModalElement = (target: OverlayTarget) =>
  document.getElementById(target);

export const showModal = (target: OverlayTarget) => {
  const modalElement = getModalElement(target);

  if (modalElement) {
    BootstrapModal.getOrCreateInstance(modalElement).show();
  }
};

export const hideModal = (target: OverlayTarget) => {
  const modalElement = getModalElement(target);

  if (modalElement) {
    BootstrapModal.getInstance(modalElement)?.hide();
  }
};

export const onModalShown = (
  target: OverlayTarget,
  listener: (event: ModalShownEvent) => void,
) => {
  const modalElement = getModalElement(target);

  if (!modalElement) {
    return () => {};
  }

  const _handleShown = (event: Event) => listener(event as ModalShownEvent);
  modalElement.addEventListener("shown.bs.modal", _handleShown);

  return () => modalElement.removeEventListener("shown.bs.modal", _handleShown);
};
