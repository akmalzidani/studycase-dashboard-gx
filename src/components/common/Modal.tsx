import type { OverlayTarget } from "@/config/overlay.config";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalProps {
  target: OverlayTarget;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "xl";
}

export function Modal({ target, title, children, footer, size }: ModalProps) {
  const titleId = `${target}-title`;
  const portalTarget = document.getElementById("portal");

  if (!portalTarget) {
    throw new Error("Portal target '#portal' was not found.");
  }

  return createPortal(
    <div
      id={target}
      className="modal fade"
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-hidden="true"
    >
      <div
        className={`modal-dialog modal-dialog-centered${size ? ` modal-${size}` : ""}`}
      >
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header border-bottom-0 pb-0">
            <h1 className="modal-title fs-5 fw-bold" id={titleId}>
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body py-4">{children}</div>
          {footer ? (
            <div className="modal-footer border-top-0 pt-0">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
