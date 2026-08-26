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
  const { __roles: roles, __isLoading: isLoadingRoles } = useRoles();
  const {
    __users: users,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateUser: _handleCreateUser,
    __handleUpdateUser: _handleUpdateUser,
    __handleDeleteUser: _handleDeleteUser,
  } = useUsers();
  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.USER_FORM);
  const {
    __selectedItem: selectedUser,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  } = useCrudFormActions<ManagedUser>({
    deleteTitle: "Delete user",
    deleteMessage: (user) => `Are you sure you want to delete ${user.name}?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: _handleDeleteUser,
  });

  const usersWithRoleNames = users.map((user) => ({
    ...user,
    roleName: roles.find((role) => role.id === user.roleId)?.name ?? "-",
  }));
  const tableFields = [
    {
      key: "userInformation",
      getValue: (user: ManagedUser) => `${user.name} ${user.email}`,
      searchable: true,
      sortable: true,
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
  const roleOptions = roles.flatMap((role) =>
    role.id ? [{ value: role.id, label: role.name }] : [],
  );
  const {
    __data: data,
    __search: search,
    __sortConfig: sortConfig,
    __page: page,
    __pageSize: pageSize,
    __totalPages: totalPages,
    __totalItems: totalItems,
    __actions: {
      __handleSearch: _handleSearch,
      __handleSort: _handleSort,
      __handlePageChange: _handlePageChange,
      __handlePageSizeChange: _handlePageSizeChange,
    },
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

    return selectedUser?.id
      ? _handleUpdateUser(selectedUser.id, payload)
      : _handleCreateUser(payload);
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
                  value={search}
                  actions={{ handleChange: _handleSearch }}
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
                disabled={isSubmitting || isLoading || isLoadingRoles}
                onClick={_handleOpenCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add User
              </button>
            ) : null}
          </div>

          <div ref={tableContainerRef}>
            <Table
              ths={[
                { content: "User Information", sortKey: "userInformation" },
                "Role",
                "Status",
                { className: "text-end", content: "Actions" },
              ]}
              tds={data}
              isLoading={isLoading}
              isWrapHeader
              emptyMessage="No users yet. Add a user to start managing access."
              sortConfig={sortConfig}
              actions={{ handleSort: _handleSort }}
            >
              {data.map((user) => (
                <TableRowUser
                  key={user.id}
                  item={user}
                  permissions={permissions}
                  isSubmitting={isSubmitting}
                  actions={{
                    handleEdit: _handleOpenEditForm,
                    handleDelete: _handleConfirmDelete,
                  }}
                />
              ))}
            </Table>
          </div>

          {!isLoading ? (
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              actions={{
                handlePageChange: _handlePageChange,
                handlePageSizeChange: _handlePageSizeChange,
              }}
            />
          ) : null}
        </div>
      </div>
      <UserForm
        item={selectedUser}
        roles={roles}
        isSubmitting={isSubmitting}
        actions={{ handleSubmit: _handleUserSubmit }}
      />
    </>
  );
}
