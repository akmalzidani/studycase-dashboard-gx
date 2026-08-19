import {
  createCrudRowActions,
  DataTable,
  type Column,
} from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/components/Overlay";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useRoles } from "@/hooks/useRoles";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { UserFormModal, USER_FORM_MODAL_TARGET } from "./UserFormModal";
import type { ManagedUser, UserFormValues } from "./types";

const userColumns: Column<ManagedUser>[] = [
  {
    key: "name",
    header: "Nama",
    sortKey: "name",
    render: (user) => <span className="fw-semibold">{user.name}</span>,
  },
  { key: "email", header: "Email", sortKey: "email" },
  { key: "roleName", header: "Role", render: (user) => user.roleName ?? "-" },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <span
        className={`badge text-bg-${user.status === "Inactive" ? "secondary" : "success"}`}
      >
        {user.status === "Inactive" ? "Tidak aktif" : "Aktif"}
      </span>
    ),
  },
];

function searchUsers(user: ManagedUser, keyword: string) {
  return [user.name, user.email, user.roleName, user.status].some((value) =>
    value?.toLowerCase().includes(keyword),
  );
}

export function UserTab() {
  const permissions = useAuthStore((state) => state.permissions);
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const users = useUserStore((state) => state.users);
  const hasLoaded = useUserStore((state) => state.hasLoaded);
  const isLoading = useUserStore((state) => state.isLoading);
  const setUsers = useUserStore((state) => state.setUsers);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);
  const formModal = useModal(USER_FORM_MODAL_TARGET);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      setUsers(await userService.getAll());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat data user.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setUsers]);

  useEffect(() => {
    if (!hasLoaded && !hasFetched.current) {
      hasFetched.current = true;
      void fetchUsers();
    }
  }, [fetchUsers, hasLoaded]);

  const userActions = useCrudFormActions<ManagedUser>({
    deleteTitle: "Hapus user",
    deleteMessage: (user) => `Apakah Anda yakin ingin menghapus ${user.name}?`,
    modal: formModal,
    onDelete: async (id) => {
      setIsSubmitting(true);
      try {
        await userService.remove(id);
        setUsers(
          useUserStore.getState().users.filter((user) => user.id !== id),
        );
        toast.success("User berhasil dihapus.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus user.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
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
    searchPredicate: searchUsers,
  });

  const submitUser = useCallback(
    async (values: UserFormValues) => {
      const payload = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
      };

      setIsSubmitting(true);
      try {
        if (userActions.selectedItem?.id) {
          const updated = await userService.update(
            userActions.selectedItem.id,
            payload,
          );
          setUsers(
            useUserStore
              .getState()
              .users.map((user) => (user.id === updated.id ? updated : user)),
          );
          toast.success("User berhasil diperbarui.");
        } else {
          const created = await userService.create(payload);
          setUsers([...useUserStore.getState().users, created]);
          toast.success("User berhasil ditambahkan.");
        }
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menyimpan user.",
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [userActions.selectedItem?.id],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        canEdit: hasPermission(permissions, PERMISSION_KEYS.USERS.UPDATE),
        canDelete: hasPermission(permissions, PERMISSION_KEYS.USERS.DELETE),
        getLabel: (user: ManagedUser) => user.name,
        onEdit: userActions.openEditForm,
        onDelete: userActions.confirmDelete,
      }),
    [
      isSubmitting,
      permissions,
      userActions.confirmDelete,
      userActions.openEditForm,
    ],
  );

  return (
    <>
      <PageHeader
        title="User"
        description="Kelola akun pengguna dan status aksesnya."
        actions={[
          {
            id: "create",
            permission: PERMISSION_KEYS.USERS.CREATE,
            content: (
              <button
                className="btn btn-primary"
                type="button"
                disabled={isSubmitting || isLoading || isLoadingRoles}
                onClick={userActions.openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Tambah User
              </button>
            ),
          },
        ]}
      />
      <DataTable
        {...table}
        columns={userColumns}
        rowActions={rowActions}
        keyExtractor={(user) => user.id ?? user.email}
        isLoading={isLoading}
        emptyMessage="Belum ada user. Tambahkan user untuk mulai mengelola akses."
      />
      <UserFormModal
        isOpen={formModal.isOpen}
        item={userActions.selectedItem}
        roles={roles}
        isSubmitting={isSubmitting}
        onClose={formModal.close}
        onSubmit={submitUser}
      />
    </>
  );
}
