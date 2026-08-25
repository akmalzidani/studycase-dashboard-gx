import { Offcanvas } from "@/components/common/Offcanvas";
import { FormTextarea, FormTextInput } from "@/components/common/FormInput";
import { FORM_IDS, OVERLAY_TARGETS } from "@/config/overlay.config";
import { PERMISSION_CATALOG } from "@/config/permission.config";
import { hideOffcanvas, onOffcanvasShown } from "@/helpers/offcanvas.helpers";
import type { Permissions, Role } from "@/types";
import { useEffect, useState, type SyntheticEvent } from "react";

export interface RoleFormValues {
  name: string;
  description: string;
  permissions: Permissions;
}

interface RoleFormProps {
  isSubmitting: boolean;
  item: Role | null;
  onSubmit: (values: RoleFormValues) => Promise<boolean>;
}

type CatalogPermission = (typeof PERMISSION_CATALOG)[number];

function groupPermissionsByFeature() {
  return PERMISSION_CATALOG.reduce<Record<string, CatalogPermission[]>>(
    (groups, permission) => {
      (groups[permission.feature] ??= []).push(permission);
      return groups;
    },
    {},
  );
}

const getPermissionValue = (permissions: Permissions, key: string) =>
  key
    .split(".")
    .reduce<Permissions | boolean | undefined>(
      (current, segment) =>
        typeof current === "object" ? current[segment] : undefined,
      permissions,
    ) === true;

const setPermissionValue = (
  permissions: Permissions,
  key: string,
  checked: boolean,
) => {
  const next = structuredClone(permissions);
  const segments = key.split(".");
  let current = next;

  segments.slice(0, -1).forEach((segment) => {
    const value = current[segment];
    current[segment] = typeof value === "object" ? value : {};
    current = current[segment] as Permissions;
  });

  current[segments.at(-1)!] = checked;
  return next;
};

export function RoleForm({
  isSubmitting,
  item: role,
  onSubmit,
}: RoleFormProps) {
  const [values, setValues] = useState<RoleFormValues>({
    name: "",
    description: "",
    permissions: {},
  });

  const permissionsByFeature = Object.entries(groupPermissionsByFeature());

  useEffect(() => {
    return onOffcanvasShown(OVERLAY_TARGETS.ROLE_FORM, () => {
      setValues(
        role
          ? {
              name: role.name,
              description: role.description,
              permissions: role.permissions,
            }
          : { name: "", description: "", permissions: {} },
      );
    });
  }, [role]);

  const _handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) {
      hideOffcanvas(OVERLAY_TARGETS.ROLE_FORM);
    }
  };

  const isEditing = Boolean(role);

  return (
    <Offcanvas
      target={OVERLAY_TARGETS.ROLE_FORM}
      title={isEditing ? "Edit Role" : "Add Role"}

      actions={
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
            form={FORM_IDS.ROLE}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Submit"}
          </button>
        </>
      }
    >
      <form id={FORM_IDS.ROLE} onSubmit={_handleSubmit} className="row">
        <div className="col-12 col-md-4">
          <FormTextInput
            id="role-name"
            label="Role name"
            className="form-control"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Example: Administrator"
            minLength={3}
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        <div className="col-12 col-md-8">
          <FormTextarea
            id="role-description"
            label="Description"
            className="form-control"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Describe this role's access scope"
            rows={3}
            required
            disabled={isSubmitting}
          />
        </div>
        <fieldset className="col-12">
          <label className="fs-6 fw-semibold mb-3">Permissions</label>
          <div className="table-responsive border rounded">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Feature</th>
                  <th>Access rights</th>
                </tr>
              </thead>
              <tbody>
                {permissionsByFeature.map(([feature, permissions]) => (
                  <tr key={feature}>
                    <td className="fw-semibold">{feature}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-3">
                        {permissions.map((permission) => (
                          <div className="form-check" key={permission.key}>
                            <input
                              id={`role-permission-${permission.key}`}
                              className="form-check-input"
                              type="checkbox"
                              checked={getPermissionValue(
                                values.permissions,
                                permission.key,
                              )}
                              onChange={(event) =>
                                setValues((current) => ({
                                  ...current,
                                  permissions: setPermissionValue(
                                    current.permissions,
                                    permission.key,
                                    event.target.checked,
                                  ),
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`role-permission-${permission.key}`}
                            >
                              {permission.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      </form>
    </Offcanvas>
  );
}
