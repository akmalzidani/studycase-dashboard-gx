import {
  createCrudRowActions,
  DataTable,
  type Column,
} from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useRoles } from "@/hooks/useRoles";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Permissions, Role } from "@/types";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";
import {
  RoleFormModal,
  type RoleFormValues,
  ROLE_FORM_MODAL_TARGET,
} from "./RoleFormModal";

const roleColumns: Column<Role>[] = [
  {
    key: "name",
    header: "Nama role",
    sortKey: "name",
    render: (role) => <span className="fw-semibold">{role.name}</span>,
  },
  { key: "description", header: "Deskripsi", sortKey: "description" },
  {
    key: "permissions",
    header: "Jumlah akses",
    render: (role) => `${countPermissions(role.permissions)} permission`,
  },
];

function countPermissions(permissions: Permissions): number {
  return Object.values(permissions).reduce<number>(
    (total, value) =>
      total +
      (typeof value === "object" ? countPermissions(value) : Number(value)),
    0,
  );
}

function searchRoles(role: Role, keyword: string) {
  return [role.name, role.description].some((value) =>
    value.toLowerCase().includes(keyword),
  );
}

export function RoleTab() {
  const permissions = useAuthStore((state) => state.permissions);
  const { roles, isLoading, isSubmitting, createRole, updateRole, deleteRole } =
    useRoles();
  const formModal = useModal(ROLE_FORM_MODAL_TARGET);
  const roleActions = useCrudFormActions<Role>({
    deleteTitle: "Hapus role",
    deleteMessage: (role) =>
      `Apakah Anda yakin ingin menghapus role ${role.name}?`,
    modal: formModal,
    onDelete: deleteRole,
  });
  const table = useDataTable({ data: roles, searchPredicate: searchRoles });

  const submitRole = useCallback(
    async (values: RoleFormValues) => {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        permissions: values.permissions,
      };
      const isSaved = roleActions.selectedItem?.id
        ? await updateRole(roleActions.selectedItem.id, payload)
        : await createRole(payload);

      return isSaved;
    },
    [createRole, roleActions.selectedItem, updateRole],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        canEdit: hasPermission(permissions, PERMISSION_KEYS.ROLES.UPDATE),
        canDelete: hasPermission(permissions, PERMISSION_KEYS.ROLES.DELETE),
        getLabel: (role: Role) => role.name,
        onEdit: roleActions.openEditForm,
        onDelete: roleActions.confirmDelete,
      }),
    [
      isSubmitting,
      permissions,
      roleActions.confirmDelete,
      roleActions.openEditForm,
    ],
  );

  return (
    <>
      <PageHeader
        title="Role"
        description="Kelola role dan hak akses pengguna."
        actions={[
          {
            id: "create",
            permission: PERMISSION_KEYS.ROLES.CREATE,
            content: (
              <button
                className="btn btn-primary"
                type="button"
                disabled={isSubmitting}
                onClick={roleActions.openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Tambah Role
              </button>
            ),
          },
        ]}
      />
      <DataTable
        {...table}
        columns={roleColumns}
        rowActions={rowActions}
        keyExtractor={(role) => role.id ?? role.name}
        isLoading={isLoading}
        emptyMessage="Belum ada role."
      />
      <RoleFormModal
        isOpen={formModal.isOpen}
        isSubmitting={isSubmitting}
        item={roleActions.selectedItem}
        onClose={formModal.close}
        onSubmit={submitRole}
      />
    </>
  );
}
