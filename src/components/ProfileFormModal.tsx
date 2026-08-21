import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { User } from "@/types";

export interface ProfileFormValues {
  name: string;
  email: string;
}

interface ProfileFormModalProps {
  isSubmitting: boolean;
  item: User | null;
  onSubmit: (values: ProfileFormValues) => Promise<boolean>;
}

export function ProfileFormModal({
  isSubmitting,
  item: user,
  onSubmit,
}: ProfileFormModalProps) {
  const [values, setValues] = useState<ProfileFormValues>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const initializeValues = () => {
      setValues(user ? { name: user.name, email: user.email } : { name: "", email: "" });
    };

    return onModalShown(MODAL_TARGETS.PROFILE_FORM, initializeValues);
  }, [user]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideModal(MODAL_TARGETS.PROFILE_FORM);
    }
  };

  return (
    <Modal
      target={MODAL_TARGETS.PROFILE_FORM}
      title="Edit Profile"
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
            form={FORM_IDS.PROFILE}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.PROFILE} onSubmit={handleSubmit}>
        <FormTextInput
          id="profile-name"
          label="Name"
          className="form-control"
          value={values.name}
          minLength={3}
          required
          disabled={isSubmitting}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
        />
        <FormTextInput
          id="profile-email"
          label="Email"
          type="email"
          className="form-control"
          value={values.email}
          required
          disabled={isSubmitting}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />
      </form>
    </Modal>
  );
}
