import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal, type FormModalProps } from "@/components/common/Modal";
import { MODAL_TARGETS } from "@/config/modal.config";
import type { User } from "@/types";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type ChangePasswordModalProps = FormModalProps<User, ChangePasswordFormValues>;

const FORM_ID = "change-password-form";
const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function ChangePasswordModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    if (isOpen) setValues(EMPTY_VALUES);
  }, [isOpen]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  return (
    <Modal
      target={MODAL_TARGETS.CHANGE_PASSWORD}
      title="Ubah Password"
      isOpen={isOpen}
      closeDisabled={isSubmitting}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Ubah Password"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        {(
          [
            [
              "currentPassword",
              "Password saat ini",
              "profile-current-password",
            ],
            ["newPassword", "Password baru", "profile-new-password"],
            [
              "confirmNewPassword",
              "Konfirmasi password baru",
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
