import { FormTextInput } from "@/components/common/FormInput";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import type { Role } from "@/types";
import { useEffect, useState, type SyntheticEvent } from "react";
import type {
  ManagedUser,
  UserFormValues,
} from "@/components/UserManagement/types";

interface UserFormProps {
  item: ManagedUser | null;
  roles: Role[];
  isSubmitting: boolean;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
}

export function UserForm({
  item: user,
  roles,
  isSubmitting,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: "",
    email: "",
    password: "",
    roleId: "",
    status: "Active",
  });

  useEffect(() => {
    return onOffcanvasShown(OVERLAY_TARGETS.USER_FORM, () => {
      setValues(
        user
          ? {
              name: user.name,
              email: user.email,
              password: user.password ?? "",
              roleId: user.roleId,
              status: user.status ?? "Active",
            }
          : {
              name: "",
              email: "",
              password: "",
              roleId: roles[0]?.id ?? "",
              status: "Active",
            },
      );
    });
  }, [roles, user]);

  const handleValueChange = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.USER_FORM);
    }
  };

  const isEditing = Boolean(user);
  return (
    <Offcanvas
      target={OVERLAY_TARGETS.USER_FORM}
      title={isEditing ? "Edit User" : "Add User"}
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
            form={FORM_IDS.USER}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add User"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.USER} onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <FormTextInput
            id="user-name"
            label="Name"
            className="form-control"
            value={values.name}
            placeholder="Enter full name"
            onChange={(event) => handleValueChange("name", event.target.value)}
            required
            minLength={3}
            disabled={isSubmitting}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormTextInput
            id="user-email"
            label="Email"
            className="form-control"
            type="email"
            placeholder="Enter email"
            value={values.email}
            onChange={(event) => handleValueChange("email", event.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="col-12 col-md-6">
          <FormTextInput
            id="user-password"
            label="Password"
            className="form-control"
            type="password"
            placeholder="Enter password"
            value={values.password}
            onChange={(event) =>
              handleValueChange("password", event.target.value)
            }
            required
            minLength={4}
            disabled={isSubmitting}
          />
        </div>
        <div className="col-12 col-md-8">
          <label className="form-label" htmlFor="user-role">
            Role
          </label>
          <select
            id="user-role"
            className="form-select"
            value={values.roleId}
            onChange={(event) =>
              handleValueChange("roleId", event.target.value)
            }
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select a role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="user-status">
            Status
          </label>
          <select
            id="user-status"
            className="form-select"
            value={values.status}
            onChange={(event) =>
              handleValueChange(
                "status",
                event.target.value as UserFormValues["status"],
              )
            }
            disabled={isSubmitting}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </form>
    </Offcanvas>
  );
}
