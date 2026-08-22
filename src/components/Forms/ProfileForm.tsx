import { useEffect, useState, type SyntheticEvent } from "react";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FormTextInput } from "@/components/common/FormInput";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import type { User } from "@/types";

export interface ProfileFormValues {
  name: string;
  email: string;
}

interface ProfileFormProps {
  isSubmitting: boolean;
  item: User | null;
  onSubmit: (values: ProfileFormValues) => Promise<boolean>;
}

export function ProfileForm({
  isSubmitting,
  item: user,
  onSubmit,
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

    return onOffcanvasShown(OVERLAY_TARGETS.PROFILE_FORM, initializeValues);
  }, [user]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.PROFILE_FORM);
    }
  };

  return (
    <Offcanvas
      target={OVERLAY_TARGETS.PROFILE_FORM}
      title="Edit Profile"
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
            form={FORM_IDS.PROFILE}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.PROFILE} onSubmit={handleSubmit} className="row g-3">
        <div className="col-12 col-md-6">
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
        </div>
        <div className="col-12 col-md-6">
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
        </div>
      </form>
    </Offcanvas>
  );
}
