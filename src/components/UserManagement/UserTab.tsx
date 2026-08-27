import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useRoles } from "@/hooks/useRoles";
import { useTable } from "@/hooks/useTable";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { Tooltip } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { TableRowUser } from "../TableRows/TableRowUser";
import { UserForm } from "../Forms/UserForm";
import type { ManagedUser, UserFormValues } from "./types";

export function UserTab() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const [filters, setFilters] = useState({ role: "", status: "" });
  const { __roles, __isLoading: isLoadingRoles } = useRoles();
  const {
    __users,
    __isLoading: isLoadingUsers,
    __isSubmitting,
    __handleCreateUser,
    __handleUpdateUser,
    __handleDeleteUser,
  } = useUsers();
  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.USER_FORM);
  const {
    __selectedItem,
    __handleOpenCreateForm,
    __handleOpenEditForm,
    __handleConfirmDelete,
  } = useCrudFormActions<ManagedUser>({
    deleteTitle: "Delete user",
    deleteMessage: (user) => `Are you sure you want to delete ${user.name}?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: __handleDeleteUser,
  });

  const usersWithRoleNames = __users.map((user) => ({
    ...user,
    roleName: __roles.find((role) => role.id === user.roleId)?.name ?? "-",
  }));
  const tableFields = [
    {
      key: "userInformation",
      getValue: (user: ManagedUser) => `${user.name} ${user.email}`,
      searchable: true,
    },
    {
      key: "role",
      getValue: (user: ManagedUser) => user.roleName,
      searchable: true,
    },
    {
      key: "status",
      getValue: (user: ManagedUser) => user.status,
      searchable: true,
    },
  ];
  const tableFilters = [
    (user: ManagedUser) => !filters.role || user.roleId === filters.role,
    (user: ManagedUser) => !filters.status || user.status === filters.status,
  ];
  const roleOptions = __roles.flatMap((role) =>
    role.id ? [{ value: role.id, label: role.name }] : [],
  );
  const {
    __data,
    __search,
    __page,
    __pageSize,
    __totalPages,
    __totalItems,
    __actions: { __handleSearch, __handlePageChange, __handlePageSizeChange },
  } = useTable({
    data: usersWithRoleNames,
    fields: tableFields,
    filters: tableFilters,
  });

  const _handleUserSubmit = (values: UserFormValues) => {
    const payload = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
    };

    return __selectedItem?.id
      ? __handleUpdateUser(__selectedItem.id, payload)
      : __handleCreateUser(payload);
  };

  useEffect(() => {
    const tooltips = Array.from(
      tableContainerRef.current?.querySelectorAll<HTMLElement>(
        '[data-bs-toggle="tooltip"]',
      ) ?? [],
      (element) => Tooltip.getOrCreateInstance(element),
    );

    return () => tooltips.forEach((tooltip) => tooltip.dispose());
  });

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <div className="d-flex flex-column flex-md-row gap-2">
              <div style={{ maxWidth: "320px" }}>
                <TableSearch
                  value={__search}
                  actions={{ handleChange: __handleSearch }}
                />
              </div>
              <TableFilter
                fields={[
                  {
                    key: "role",
                    label: "Role",
                    options: roleOptions,
                    disabled: isLoadingRoles,
                  },
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ],
                  },
                ]}
                values={filters}
                actions={{
                  handleChange: (key, value) =>
                    setFilters((current) => ({ ...current, [key]: value })),
                  handleReset: () => setFilters({ role: "", status: "" }),
                }}
              />
            </div>
            {hasPermission(permissions, PERMISSION_KEYS.USERS.CREATE) ? (
              <button
                className="btn btn-primary"
                type="button"
                disabled={__isSubmitting || isLoadingUsers || isLoadingRoles}
                onClick={__handleOpenCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add User
              </button>
            ) : null}
          </div>

          <div ref={tableContainerRef}>
            <Table
              ths={[
                "User Information",
                "Role",
                "Status",
                { className: "text-end", content: "Actions" },
              ]}
              tds={__data}
              isLoading={isLoadingUsers}
              isWrapHeader
              emptyMessage="No users yet. Add a user to start managing access."
            >
              {__data.map((user) => (
                <TableRowUser
                  key={user.id}
                  item={user}
                  permissions={permissions}
                  isSubmitting={__isSubmitting}
                  actions={{
                    handleEdit: __handleOpenEditForm,
                    handleDelete: __handleConfirmDelete,
                  }}
                />
              ))}
            </Table>
          </div>

          {!isLoadingUsers ? (
            <TablePagination
              page={__page}
              totalPages={__totalPages}
              totalItems={__totalItems}
              pageSize={__pageSize}
              actions={{
                handlePageChange: __handlePageChange,
                handlePageSizeChange: __handlePageSizeChange,
              }}
            />
          ) : null}
        </div>
      </div>
      <UserForm
        item={__selectedItem}
        roles={__roles}
        isSubmitting={__isSubmitting}
        actions={{ handleSubmit: _handleUserSubmit }}
      />
    </>
  );
}
