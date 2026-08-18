import { MODAL_TARGETS } from "@/config/modal.config";
import { Modal } from "@/components/common/Modal";
import { useConfirmStore } from "@/stores/useConfirmStore";

export default function ConfirmationDialog() {
  const { show, options, hide } = useConfirmStore();

  if (!options) return null;

  const {
    title = "Konfirmasi",
    message,
    confirmText = "Ya",
    cancelText = "Batal",
    variant = "primary",
    onConfirm,
    onCancel,
  } = options;

  const handleConfirm = () => {
    onConfirm();
    hide();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    hide();
  };

  return (
    <Modal
      target={MODAL_TARGETS.CONFIRMATION}
      title={title}
      isOpen={show}
      onClose={handleCancel}
      footer={
        <>
          <button
            type="button"
            className="btn btn-light fw-medium"
            onClick={handleCancel}
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
      <p className="mb-0 text-secondary">{message}</p>
    </Modal>
  );
}
