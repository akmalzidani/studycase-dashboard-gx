import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/common/Modal";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { User } from "@/types";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordModalProps {
  isSubmitting: boolean;
  item: User | null;
  onSubmit: (values: ChangePasswordFormValues) => Promise<boolean>;
}


const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function ChangePasswordModal({
  isSubmitting,
  onSubmit,
}: ChangePasswordModalProps) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    const resetValues = () => setValues(EMPTY_VALUES);
    return onModalShown(MODAL_TARGETS.CHANGE_PASSWORD, resetValues);
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideModal(MODAL_TARGETS.CHANGE_PASSWORD);
    }
  };

  return (
    <Modal
      target={MODAL_TARGETS.CHANGE_PASSWORD}
      title="Change Password"

      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_IDS.CHANGE_PASSWORD}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Change Password"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.CHANGE_PASSWORD} onSubmit={handleSubmit}>
        {(
          [
            [
              "currentPassword",
              "Current password",
              "profile-current-password",
            ],
            ["newPassword", "New password", "profile-new-password"],
            [
              "confirmNewPassword",
              "Confirm new password",
              "profile-confirm-new-password",
            ],
          ] as const
        ).map(([field, label, id], index) => (
          <div className={index < 2 ? "mb-3" : ""} key={field}>
            <label className="form-label" htmlFor={id}>
              {label}
            </label>
            <input
              id={id}
              type="password"
              className="form-control"
              value={values[field]}
              minLength={field === "currentPassword" ? undefined : 6}
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
            />
          </div>
        ))}
      </form>
    </Modal>
  );
}
