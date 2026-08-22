import { Modal as BootstrapModal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { Modal } from "@/components/common/Modal";
import { useConfirmStore, type ConfirmOptions } from "@/stores/useConfirmStore";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ConfirmationDialog() {
  const { options, hide } = useConfirmStore();
  const { theme } = useThemeStore();
  const modalRef = useRef<BootstrapModal | null>(null);
  const [displayedOptions, setDisplayedOptions] =
    useState<ConfirmOptions | null>(null);

  useEffect(() => {
    const modalElement = document.getElementById(OVERLAY_TARGETS.CONFIRMATION);

    if (!modalElement) {
      throw new Error("Confirmation modal was not found.");
    }

    const modal = BootstrapModal.getOrCreateInstance(modalElement);
    modalRef.current = modal;

    const handleHidden = () => {
      setDisplayedOptions(null);
      hide();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
      modal.dispose();
      modalRef.current = null;
    };
  }, [hide]);

  useEffect(() => {
    if (options) {
      setDisplayedOptions(options);
    } else {
      modalRef.current?.hide();
    }
  }, [options]);

  useEffect(() => {
    if (displayedOptions && options) {
      modalRef.current?.show();
    }
  }, [displayedOptions, options]);

  const title = displayedOptions?.title ?? "Confirmation";
  const message = displayedOptions?.message ?? "";
  const confirmText = displayedOptions?.confirmText ?? "Yes";
  const cancelText = displayedOptions?.cancelText ?? "Cancel";
  const variant = displayedOptions?.variant ?? "primary";
  const textMessageColor = theme === "dark" ? "light" : "dark";

  const handleDismiss = () => {
    modalRef.current?.hide();
  };

  const handleConfirm = () => {
    handleDismiss();
    displayedOptions?.onConfirm();
  };

  return (
    <Modal
      target={OVERLAY_TARGETS.CONFIRMATION}
      title={title}
      footer={
        <>
          <button
            type="button"
            className="btn btn-light fw-medium"
            onClick={handleDismiss}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-${variant} fw-medium px-4`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className={`mb-0 text-${textMessageColor}`}>{message}</p>
    </Modal>
  );
}
