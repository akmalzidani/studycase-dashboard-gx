import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal, type FormModalProps } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput/FormInput";
import { MODAL_TARGETS } from "@/config/modal.config";
import type { User } from "@/types";

export interface ProfileFormValues {
  name: string;
  email: string;
}

type ProfileFormModalProps = FormModalProps<User, ProfileFormValues>;

const FORM_ID = "profile-form";

export function ProfileFormModal({
  isOpen,
  isSubmitting,
  item: user,
  onClose,
  onSubmit,
}: ProfileFormModalProps) {
  const [values, setValues] = useState<ProfileFormValues>({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!isOpen || !user) return;

    setValues({ name: user.name, email: user.email });
  }, [isOpen, user]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  return (
    <Modal
      target={MODAL_TARGETS.PROFILE_FORM}
      title="Edit Profile"
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
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
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
