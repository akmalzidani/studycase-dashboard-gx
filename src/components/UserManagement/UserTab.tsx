import {
  createCrudRowActions,
  DataTable,
  matchesSearchKeyword,
} from "@/components/common/DataTable";
import { userTableColumns } from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";
import { PageHeader } from "@/components/common/PageHeader";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useRoles } from "@/hooks/useRoles";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";
import { UserForm } from "../Forms/UserForm";
import type { ManagedUser, UserFormValues } from "./types";

export function UserTab() {
  const permissions = useAuthStore((store) => store.permissions);
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const { users, isLoading, isSubmitting, createUser, updateUser, deleteUser } =
    useUsers();
  const handleFormOpen = useCallback(
    () => showOffcanvas(MODAL_TARGETS.USER_FORM),
    [],
  );
  const {
    selectedItem: selectedUser,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<ManagedUser>({
    deleteTitle: "Delete user",
    deleteMessage: (user) => `Are you sure you want to delete ${user.name}?`,
    onOpenForm: handleFormOpen,
    onDelete: deleteUser,
  });

  const usersWithRoleNames = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        roleName: roles.find((role) => role.id === user.roleId)?.name ?? "-",
      })),
    [roles, users],
  );
  const table = useDataTable({
    data: usersWithRoleNames,
    searchPredicate: (user, keyword) =>
      matchesSearchKeyword(
        [user.name, user.email, user.roleName, user.status],
        keyword,
      ),
  });

  const handleUserSubmit = useCallback(
    (values: UserFormValues) => {
      const payload = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
      };

      return selectedUser?.id
        ? updateUser(selectedUser.id, payload)
        : createUser(payload);
    },
    [createUser, selectedUser, updateUser],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        canEdit: hasPermission(permissions, PERMISSION_KEYS.USERS.UPDATE),
        canDelete: hasPermission(permissions, PERMISSION_KEYS.USERS.DELETE),
        getLabel: (user: ManagedUser) => user.name,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm, permissions],
  );

  return (
    <>
      <PageHeader
        title="User"
        description="Manage user accounts and their access status."
      />
      <DataTable
        {...table}
        columns={userTableColumns}
        rowActions={rowActions}
        keyExtractor={(user) => user.id ?? user.email}
        isLoading={isLoading}
        emptyMessage="No users yet. Add a user to start managing access."
        actions={
          hasPermission(permissions, PERMISSION_KEYS.USERS.CREATE) && (
            <button
              className="btn btn-primary"
              type="button"
              disabled={isSubmitting || isLoading || isLoadingRoles}
              onClick={openCreateForm}
            >
              <BsPlusLg className="me-2" />
              Add User
            </button>
          )
        }
      />
      <UserForm
        item={selectedUser}
        roles={roles}
        isSubmitting={isSubmitting}
        onSubmit={handleUserSubmit}
      />
    </>
  );
}
