import { Modal as BootstrapModal } from "bootstrap";
import type { ModalTarget } from "@/config/modal.config";

export type ModalShownEvent = Event & {
  relatedTarget: HTMLElement | null;
};

export const getModalElement = (target: ModalTarget) =>
  document.getElementById(target);

export const showModal = (target: ModalTarget) => {
  const modalElement = getModalElement(target);

  if (modalElement) {
    BootstrapModal.getOrCreateInstance(modalElement).show();
  }
};

export const hideModal = (target: ModalTarget) => {
  const modalElement = getModalElement(target);

  if (modalElement) {
    BootstrapModal.getInstance(modalElement)?.hide();
  }
};

export const onModalShown = (
  target: ModalTarget,
  listener: (event: ModalShownEvent) => void,
) => {
  const modalElement = getModalElement(target);

  if (!modalElement) {
    return () => {};
  }

  const handleShown = (event: Event) => listener(event as ModalShownEvent);
  modalElement.addEventListener("shown.bs.modal", handleShown);

  return () => modalElement.removeEventListener("shown.bs.modal", handleShown);
};
