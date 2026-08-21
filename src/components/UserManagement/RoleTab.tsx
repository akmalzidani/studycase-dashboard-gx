import {
  createCrudRowActions,
  DataTable,
  matchesSearchKeyword,
} from "@/components/common/DataTable";
import { roleTableColumns } from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";
import { showModal } from "@/helpers/modal.helpers";
import { PageHeader } from "@/components/common/PageHeader";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useRoles } from "@/hooks/useRoles";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Role } from "@/types";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";
import { RoleFormModal, type RoleFormValues } from "./RoleFormModal";

export function RoleTab() {
  const permissions = useAuthStore((store) => store.permissions);
  const { roles, isLoading, isSubmitting, createRole, updateRole, deleteRole } =
    useRoles();
  const handleFormOpen = useCallback(
    () => showModal(MODAL_TARGETS.ROLE_FORM),
    [],
  );
  const roleActions = useCrudFormActions<Role>({
    deleteTitle: "Delete role",
    deleteMessage: (role) =>
      `Are you sure you want to delete the ${role.name} role?`,
    onOpenForm: handleFormOpen,
    onDelete: deleteRole,
  });
  const table = useDataTable({
    data: roles,
    searchPredicate: (role, keyword) =>
      matchesSearchKeyword([role.name, role.description], keyword),
  });

  const handleRoleSubmit = useCallback(
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
        description="Manage roles and user access rights."
      />
      <DataTable
        {...table}
        columns={roleTableColumns}
        rowActions={rowActions}
        keyExtractor={(role) => role.id ?? role.name}
        isLoading={isLoading}
        emptyMessage="No roles yet."
        actions={
          hasPermission(permissions, PERMISSION_KEYS.ROLES.CREATE) && (
            <button
              className="btn btn-primary"
              type="button"
              disabled={isSubmitting}
              onClick={roleActions.openCreateForm}
            >
              <BsPlusLg className="me-2" />
              Add Role
            </button>
          )
        }
      />
      <RoleFormModal
        isSubmitting={isSubmitting}
        item={roleActions.selectedItem}
        onSubmit={handleRoleSubmit}
      />
    </>
  );
}
