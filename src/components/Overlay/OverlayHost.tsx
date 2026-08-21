import { createPortal } from "react-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import ToastContainer from "./ToastContainer";

export function OverlayHost() {
  const portalTarget = document.getElementById("portal");

  if (!portalTarget) {
    throw new Error("Portal target '#portal' was not found.");
  }

  return createPortal(
    <>
      <ToastContainer />
      <ConfirmationDialog />
    </>,
    portalTarget,
  );
}
