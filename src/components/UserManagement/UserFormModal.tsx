import { FormTextInput } from "@/components/common/FormInput/FormInput";
import { Modal } from "@/components/common/Modal";
import { FORM_IDS, MODAL_TARGETS } from "@/config/modal.config";
import { hideModal, onModalShown } from "@/helpers/modal.helpers";
import type { Role } from "@/types";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { ManagedUser, UserFormValues } from "./types";

interface UserFormModalProps {
  item: ManagedUser | null;
  roles: Role[];
  isSubmitting: boolean;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
}


export function UserFormModal({
  item: user,
  roles,
  isSubmitting,
  onSubmit,
}: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: "",
    email: "",
    password: "",
    roleId: "",
    status: "Active",
  });

  useEffect(() => {
    return onModalShown(MODAL_TARGETS.USER_FORM, () => {
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

  const updateValue = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideModal(MODAL_TARGETS.USER_FORM);
    }
  };

  const isEditing = Boolean(user);
  return (
    <Modal
      target={MODAL_TARGETS.USER_FORM}
      title={isEditing ? "Edit User" : "Add User"}
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
      <form id={FORM_IDS.USER} onSubmit={handleSubmit}>
        <FormTextInput
          id="user-name"
          label="Name"
          className="form-control"
          value={values.name}
          placeholder="Enter full name"
          onChange={(event) => updateValue("name", event.target.value)}
          required
          minLength={3}
          disabled={isSubmitting}
        />
        <FormTextInput
          id="user-email"
          label="Email"
          className="form-control"
          type="email"
          placeholder="Enter email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          required
          disabled={isSubmitting}
        />
        <FormTextInput
          id="user-password"
          label="Password"
          className="form-control"
          type="password"
          placeholder="Enter password"
          value={values.password}
          onChange={(event) => updateValue("password", event.target.value)}
          required
          minLength={4}
          disabled={isSubmitting}
        />
        <div className="mb-3">
          <label className="form-label" htmlFor="user-role">
            Role
          </label>
          <select
            id="user-role"
            className="form-select"
            value={values.roleId}
            onChange={(event) => updateValue("roleId", event.target.value)}
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
        <div>
          <label className="form-label" htmlFor="user-status">
            Status
          </label>
          <select
            id="user-status"
            className="form-select"
            value={values.status}
            onChange={(event) =>
              updateValue(
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
    </Modal>
  );
}
