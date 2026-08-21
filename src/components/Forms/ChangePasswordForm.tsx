import { useEffect, useState, type SyntheticEvent } from "react";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import type { User } from "@/types";

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordFormProps {
  isSubmitting: boolean;
  item: User | null;
  onSubmit: (values: ChangePasswordFormValues) => Promise<boolean>;
}


const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export function ChangePasswordForm({
  isSubmitting,
  onSubmit,
}: ChangePasswordFormProps) {
  const [values, setValues] = useState(EMPTY_VALUES);

  useEffect(() => {
    const resetValues = () => setValues(EMPTY_VALUES);
    return onOffcanvasShown(MODAL_TARGETS.CHANGE_PASSWORD, resetValues);
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(MODAL_TARGETS.CHANGE_PASSWORD);
    }
  };

  return (
    <Offcanvas
      target={MODAL_TARGETS.CHANGE_PASSWORD}
      title="Change Password"

      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="offcanvas"
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
      <form id={FORM_IDS.CHANGE_PASSWORD} onSubmit={handleSubmit} className="row g-3">
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
        ).map(([field, label, id]) => (
          <div
            className={
              field === "currentPassword" ? "col-12" : "col-12 col-md-6"
            }
            key={field}
          >
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
    </Offcanvas>
  );
}
