import { FormTextInput } from "@/components/common/FormInput";
import { Offcanvas } from "@/components/common/Offcanvas";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import type { Role } from "@/types";
import { useEffect, useState, type SyntheticEvent } from "react";
import { BsEnvelope, BsLock } from "react-icons/bs";
import type {
  ManagedUser,
  UserFormValues,
} from "@/components/UserManagement/types";

interface UserFormProps {
  item: ManagedUser | null;
  roles: Role[];
  isSubmitting: boolean;
  actions: {
    handleSubmit: (values: UserFormValues) => Promise<boolean>;
  };
}

export function UserForm({
  item: user,
  roles,
  isSubmitting,
  actions,
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

  const _handleValueChange = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const _handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await actions.handleSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.USER_FORM);
    }
  };

  const isEditing = Boolean(user);
  return (
    <Offcanvas
      target={OVERLAY_TARGETS.USER_FORM}
      title={isEditing ? "Edit User" : "Add User"}
      actions={
        <>
          <button
            type="submit"
            form={FORM_IDS.USER}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Submit"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
            data-bs-dismiss="offcanvas"
          >
            Cancel
          </button>
        </>
      }
    >
      <form id={FORM_IDS.USER} onSubmit={_handleSubmit} className="row">
        <div className="col-12 col-md-6">
          <FormTextInput
            id="user-name"
            label="Name"
            className="form-control"
            value={values.name}
            placeholder="Enter full name"
            onChange={(event) => _handleValueChange("name", event.target.value)}
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
            startAdornment={<BsEnvelope />}
            value={values.email}
            onChange={(event) =>
              _handleValueChange("email", event.target.value)
            }
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
            startAdornment={<BsLock />}
            value={values.password}
            onChange={(event) =>
              _handleValueChange("password", event.target.value)
            }
            required
            minLength={4}
            disabled={isSubmitting}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="user-role">
            Role
          </label>
          <select
            id="user-role"
            className="form-select"
            value={values.roleId}
            onChange={(event) =>
              _handleValueChange("roleId", event.target.value)
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
        <fieldset className="col-12 col-md-6">
          <label className="form-label mb-2">Status</label>
          <div className="d-flex flex-wrap gap-3">
            {(["Active", "Inactive"] as const).map((status) => (
              <div key={status} className="form-check">
                <input
                  id={`user-status-${status.toLowerCase()}`}
                  className="form-check-input"
                  type="radio"
                  name="user-status"
                  value={status}
                  checked={values.status === status}
                  disabled={isSubmitting}
                  onChange={() => _handleValueChange("status", status)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`user-status-${status.toLowerCase()}`}
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </form>
    </Offcanvas>
  );
}
