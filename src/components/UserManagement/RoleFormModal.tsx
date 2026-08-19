import { Modal } from "@/components/common/Modal";
import type { ModalTarget } from "@/config/modal.config";
import { PERMISSION_CATALOG } from "@/config/permission.config";
import type { Permissions, Role } from "@/types";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";

export interface RoleFormValues {
  name: string;
  description: string;
  permissions: Permissions;
}

interface RoleFormModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  item: Role | null;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => Promise<boolean>;
}

const FORM_ID = "role-form";
export const ROLE_FORM_MODAL_TARGET = "role-form-modal" as ModalTarget;

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

export function RoleFormModal({
  isOpen,
  isSubmitting,
  item: role,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [values, setValues] = useState<RoleFormValues>({
    name: "",
    description: "",
    permissions: {},
  });

  const permissionsByFeature = useMemo(
    () => Object.entries(groupPermissionsByFeature()),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    setValues(
      role
        ? {
            name: role.name,
            description: role.description,
            permissions: role.permissions,
          }
        : { name: "", description: "", permissions: {} },
    );
  }, [isOpen, role]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  const isEditing = Boolean(role);

  return (
    <Modal
      target={ROLE_FORM_MODAL_TARGET}
      title={isEditing ? "Edit Role" : "Tambah Role"}
      isOpen={isOpen}
      closeDisabled={isSubmitting}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button
            type="button"
            className="btn btn-light"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Tambah Role"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="role-name">
            Nama role
          </label>
          <input
            id="role-name"
            className="form-control"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Contoh: Administrator"
            minLength={3}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="role-description">
            Deskripsi
          </label>
          <textarea
            id="role-description"
            className="form-control"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Jelaskan cakupan akses role ini"
            rows={3}
            required
          />
        </div>
        <fieldset>
          <legend className="fs-6 fw-semibold mb-3">Permissions</legend>
          <div className="table-responsive border rounded">
            <table className="table table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Fitur</th>
                  <th>Hak akses</th>
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
    </Modal>
  );
}
