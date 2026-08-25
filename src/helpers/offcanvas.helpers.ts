import { Offcanvas as BootstrapOffcanvas } from "bootstrap";
import type { OffcanvasTarget } from "@/config/overlay.config";

export type OffcanvasShownEvent = Event & {
  relatedTarget: HTMLElement | null;
};

const getOffcanvasElement = (target: OffcanvasTarget) =>
  document.getElementById(target);

export const showOffcanvas = (target: OffcanvasTarget) => {
  const offcanvasElement = getOffcanvasElement(target);

  if (offcanvasElement) {
    BootstrapOffcanvas.getOrCreateInstance(offcanvasElement).show();
  }
};

export const hideOffcanvas = (target: OffcanvasTarget) => {
  const offcanvasElement = getOffcanvasElement(target);

  if (offcanvasElement) {
    BootstrapOffcanvas.getInstance(offcanvasElement)?.hide();
  }
};

export const onOffcanvasShown = (
  target: OffcanvasTarget,
  listener: (event: OffcanvasShownEvent) => void,
) => {
  const offcanvasElement = getOffcanvasElement(target);

  if (!offcanvasElement) {
    return () => {};
  }

  const _handleShown = (event: Event) =>
    listener(event as OffcanvasShownEvent);
  offcanvasElement.addEventListener("shown.bs.offcanvas", _handleShown);

  return () =>
    offcanvasElement.removeEventListener("shown.bs.offcanvas", _handleShown);
};
