import { useEffect, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/common/Modal";
import { FormTextInput } from "@/components/common/FormInput";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { User } from "@/types";
import { BsEnvelope } from "react-icons/bs";

export interface ProfileFormValues {
  name: string;
  email: string;
}

interface ProfileFormProps {
  isSubmitting: boolean;
  item: User | null;
  actions: {
    handleSubmit: (values: ProfileFormValues) => Promise<boolean>;
  };
}

export function ProfileForm({
  isSubmitting,
  item: user,
  actions,
}: ProfileFormProps) {
  const [values, setValues] = useState<ProfileFormValues>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const initializeValues = () => {
      setValues(
        user ? { name: user.name, email: user.email } : { name: "", email: "" },
      );
    };

    return onModalShown(OVERLAY_TARGETS.PROFILE_FORM, initializeValues);
  }, [user]);

  const _handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await actions.handleSubmit(values)) {
      hideModal(OVERLAY_TARGETS.PROFILE_FORM);
    }
  };

  return (
    <Modal
      target={OVERLAY_TARGETS.PROFILE_FORM}
      title="Edit Profile"
      footer={
        <>
          <button
            type="submit"
            form={FORM_IDS.PROFILE}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </>
      }
    >
      <form id={FORM_IDS.PROFILE} onSubmit={_handleSubmit} className="row">
        <div className="col-12">
          <FormTextInput
            id="profile-name"
            label="Name"
            placeholder="Enter your name"
            className="form-control"
            value={values.name}
            minLength={3}
            required
            disabled={isSubmitting}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
          />
        </div>
        <div className="col-12">
          <FormTextInput
            id="profile-email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            className="form-control"
            startAdornment={<BsEnvelope />}
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
        </div>
      </form>
    </Modal>
  );
}
