import { useEffect, useState, type SyntheticEvent } from "react";
import { FormTextInput } from "@/components/common/FormInput";
import { Modal } from "@/components/common/Modal";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { User } from "@/types";
import { BsLock } from "react-icons/bs";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordFormProps {
  isSubmitting: boolean;
  item: User | null;
  actions: {
    handleSubmit: (values: ChangePasswordFormValues) => Promise<boolean>;
  };
}

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function ChangePasswordForm({
  isSubmitting,
  actions,
}: ChangePasswordFormProps) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    const resetValues = () => setValues(EMPTY_VALUES);
    return onModalShown(OVERLAY_TARGETS.CHANGE_PASSWORD, resetValues);
  }, []);

  const _handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await actions.handleSubmit(values)) {
      hideModal(OVERLAY_TARGETS.CHANGE_PASSWORD);
    }
  };

  return (
    <Modal
      target={OVERLAY_TARGETS.CHANGE_PASSWORD}
      title="Change Password"
      footer={
        <>
          <button
            type="submit"
            form={FORM_IDS.CHANGE_PASSWORD}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Change Password"}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={isSubmitting}
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </>
      }
    >
      <form
        id={FORM_IDS.CHANGE_PASSWORD}
        onSubmit={_handleSubmit}
        className="row g-3"
      >
        {(
          [
            ["currentPassword", "Current password", "profile-current-password"],
            ["newPassword", "New password", "profile-new-password"],
            [
              "confirmNewPassword",
              "Confirm new password",
              "profile-confirm-new-password",
            ],
          ] as const
        ).map(([field, label, id]) => (
          <div
            className={
              field === "currentPassword" ? "col-12" : "col-12 col-md-6"
            }
            key={field}
          >
            <FormTextInput
              id={id}
              label={label}
              type="password"
              className="form-control"
              placeholder={label}
              startAdornment={<BsLock />}
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
