import { useToastStore, type ToastType } from "@/stores/useToastStore";
import type { IconType } from "react-icons";
import {
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircleFill,
} from "react-icons/bs";

const ALERT_ICONS: Record<ToastType, IconType> = {
  success: BsCheckCircleFill,
  danger: BsExclamationTriangleFill,
  warning: BsExclamationCircleFill,
  info: BsInfoCircleFill,
};

export default function ToastContainer() {
  const { __toasts: toasts, __handleRemove: _handleRemove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="overlay-toast-container position-fixed top-0 end-0 p-3">
      {toasts.map((toast) => {
        const IconComponent = ALERT_ICONS[toast.type];

        return (
          <div
            key={toast.id}
            className={`alert alert-${toast.type} alert-dismissible fade show shadow-sm mb-2`}
            role="alert"
            style={{ minWidth: "300px" }}
          >
            <div className="d-flex align-items-center">
              <IconComponent className="fs-5 me-2 flex-shrink-0" />
              <div className="fw-medium">{toast.message}</div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => _handleRemove(toast.id)}
              aria-label="Close"
            ></button>
          </div>
        );
      })}
    </div>
  );
}
