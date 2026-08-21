import type { OffcanvasTarget } from "@/config/modal.config";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface OffcanvasProps {
  target: OffcanvasTarget;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Offcanvas({ target, title, children, footer }: OffcanvasProps) {
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
      aria-labelledby={titleId}
    >
      <div className="offcanvas-header">
        <h1 className="offcanvas-title fs-5 fw-bold" id={titleId}>
          {title}
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body d-flex flex-column pt-2">
        <div className="flex-grow-1">{children}</div>
        {footer && <div className="d-flex justify-content-end gap-2 pt-3">{footer}</div>}
      </div>
    </div>,
    portalTarget,
  );
}
