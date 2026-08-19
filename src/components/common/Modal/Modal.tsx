import type { ModalTarget } from "@/config/modal.config";
import { Modal as BootstrapModal } from "bootstrap";
import { createPortal } from "react-dom";
import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  target: ModalTarget;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg" | "xl";
  closeDisabled?: boolean;
  closeOnBackdrop?: boolean;
}

export function Modal({
  target,
  title,
  isOpen,
  onClose,
  children,
  footer,
  size,
  closeDisabled = false,
  closeOnBackdrop = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<BootstrapModal | null>(null);
  const isOpenRef = useRef(isOpen);
  const onCloseRef = useRef(onClose);
  const titleId = `${target}-title`;

  isOpenRef.current = isOpen;
  onCloseRef.current = onClose;

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const instance = BootstrapModal.getOrCreateInstance(modalElement, {
      backdrop: closeOnBackdrop ? true : "static",
      keyboard: !closeDisabled,
    });
    instanceRef.current = instance;

    const handleHidden = () => {
      if (isOpenRef.current) onCloseRef.current();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    if (isOpenRef.current) instance.show();

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      instance.dispose();
      instanceRef.current = null;
    };
  }, [closeOnBackdrop]);

  useEffect(() => {
    if (isOpen) {
      instanceRef.current?.show();
    } else {
      instanceRef.current?.hide();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!closeDisabled) instanceRef.current?.hide();
  };

  const portalTarget = document.getElementById("portal");

  if (!portalTarget) {
    throw new Error("Portal target '#portal' was not found.");
  }

  return createPortal(
    <div
      ref={modalRef}
      id={target}
      className="modal fade"
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-hidden={!isOpen}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${size ? `modal-${size}` : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header border-bottom-0 pb-0">
            <h1 className="modal-title fs-5 fw-bold" id={titleId}>
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              disabled={closeDisabled}
              onClick={handleClose}
            />
          </div>
          <div className="modal-body py-4">{children}</div>
          {footer && (
            <div className="modal-footer border-top-0 pt-0">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
