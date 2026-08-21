import { MODAL_TARGETS } from "@/config/modal.config";
import { Modal } from "@/components/common/Modal";
import { useConfirmStore } from "@/stores/useConfirmStore";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ConfirmationDialog() {
  const { options, hide } = useConfirmStore();
  const theme = useThemeStore((state) => state.theme);

  const textMessageColor = theme === "dark" ? "light" : "dark";

  if (!options) return null;

  const {
    title = "Confirmation",
    message,
    confirmText = "Yes",
    cancelText = "Cancel",
    variant = "primary",
    onConfirm,
  } = options;

  const handleConfirm = () => {
    hide();
    onConfirm();
  };

  const handleCancel = () => hide();

  return (
    <Modal
      target={MODAL_TARGETS.CONFIRMATION}
      title={title}
      isOpen={Boolean(options)}
      onClose={hide}
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
      <p className={`mb-0 text-${textMessageColor}`}>{message}</p>
    </Modal>
  );
}
