import type { OffcanvasTarget } from "@/config/overlay.config";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface OffcanvasProps {
  target: OffcanvasTarget;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  dismissible?: boolean;
}

export function Offcanvas({
  target,
  title,
  children,
  actions,
  dismissible = false,
}: OffcanvasProps) {
  const titleId = `${target}-title`;
  const portalTarget = document.getElementById("portal");

  if (!portalTarget) {
    throw new Error("Portal target '#portal' was not found.");
  }

  return createPortal(
    <div
      id={target}
      className="offcanvas offcanvas-end form-offcanvas"
      tabIndex={-1}
      data-bs-backdrop={dismissible ? true : "static"}
      data-bs-keyboard={dismissible}
    >
      <div className="offcanvas-header flex-wrap gap-2">
        <h1 className="offcanvas-title fs-5 fw-bold me-auto" id={titleId}>
          {title}
        </h1>
        {actions && (
          <div className="d-flex flex-wrap align-items-center justify-content-end  gap-2">
            {actions}
          </div>
        )}
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        )}
      </div>
      <div className="offcanvas-body pt-2">{children}</div>
    </div>,
    portalTarget,
  );
}
