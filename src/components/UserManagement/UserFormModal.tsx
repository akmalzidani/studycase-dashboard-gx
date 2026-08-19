import { Modal } from "@/components/common/Modal";
import type { ModalTarget } from "@/config/modal.config";
import type { Role } from "@/types";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { ManagedUser, UserFormValues } from "./types";

interface UserFormModalProps {
  isOpen: boolean;
  item: ManagedUser | null;
  roles: Role[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<boolean>;
}

const FORM_ID = "user-form";
export const USER_FORM_MODAL_TARGET = "user-form-modal" as ModalTarget;

export function UserFormModal({
  isOpen,
  item: user,
  roles,
  isSubmitting,
  onClose,
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
    if (!isOpen) return;
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
  }, [isOpen, roles, user]);

  const updateValue = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSubmit(values)) onClose();
  };

  const isEditing = Boolean(user);
  return (
    <Modal
      target={USER_FORM_MODAL_TARGET}
      title={isEditing ? "Edit User" : "Tambah User"}
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
                : "Tambah User"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="user-name">
            Nama
          </label>
          <input
            id="user-name"
            className="form-control"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            required
            minLength={3}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="user-email">
            Email
          </label>
          <input
            id="user-email"
            className="form-control"
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="user-password">
            Password
          </label>
          <input
            id="user-password"
            className="form-control"
            type="password"
            value={values.password}
            onChange={(event) => updateValue("password", event.target.value)}
            required
            minLength={4}
            disabled={isSubmitting}
          />
        </div>
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
              Pilih role
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
            <option value="Active">Aktif</option>
            <option value="Inactive">Tidak aktif</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
