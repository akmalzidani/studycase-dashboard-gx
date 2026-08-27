import { Tooltip } from "bootstrap";

const TOOLTIP_SELECTOR = '[data-bs-toggle="tooltip"]';

const createTooltip = (element: HTMLElement) => {
  const tooltip = Tooltip.getOrCreateInstance(element);
  const hideTooltip = () => tooltip.hide();

  element.addEventListener("click", hideTooltip);

  return () => {
    element.removeEventListener("click", hideTooltip);
    tooltip.dispose();
  };
};

export const initializeTooltip = (element: HTMLElement | null) => {
  if (!element) return () => {};

  return createTooltip(element);
};

export const initializeTooltips = (container: HTMLElement | null) => {
  const disposeTooltips = Array.from(
    container?.querySelectorAll<HTMLElement>(TOOLTIP_SELECTOR) ?? [],
    createTooltip,
  );

  return () => disposeTooltips.forEach((disposeTooltip) => disposeTooltip());
};

export const setTooltipContent = (
  element: HTMLElement | null,
  content: string,
) => {
  if (!element) return;

  Tooltip.getOrCreateInstance(element).setContent({
    ".tooltip-inner": content,
  });
};
