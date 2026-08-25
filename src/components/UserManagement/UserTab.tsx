import { Badge } from "@/components/common/Badge";
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
import { useState } from "react";
import { BsEnvelope, BsPencilSquare, BsPlusLg, BsTrash } from "react-icons/bs";
import { UserForm } from "../Forms/UserForm";
import type { ManagedUser, UserFormValues } from "./types";

export function UserTab() {
  const permissions = useAuthStore((store) => store.permissions);
  const [filters, setFilters] = useState({ role: "", status: "" });
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const { users, isLoading, isSubmitting, createUser, updateUser, deleteUser } =
    useUsers();
  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.USER_FORM);
  const {
    selectedItem: selectedUser,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<ManagedUser>({
    deleteTitle: "Delete user",
    deleteMessage: (user) => `Are you sure you want to delete ${user.name}?`,
    onOpenForm: _handleFormOpen,
    onDelete: deleteUser,
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
  const table = useTable({
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
      ? updateUser(selectedUser.id, payload)
      : createUser(payload);
  };

  const tableRows = table.data.map((user) => [
    <div className="d-grid gap-1">
      <span className="fw-semibold">{user.name}</span>
      <span className="d-flex align-items-center gap-2 small text-decoration-none">
        <BsEnvelope aria-hidden="true" />
        {user.email}
      </span>
    </div>,
    user.roleName,
    <Badge variant={user.status === "Active" ? "success" : "danger"}>
      {user.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          {hasPermission(permissions, PERMISSION_KEYS.USERS.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${user.name}`}
              disabled={isSubmitting}
              onClick={() => openEditForm(user)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.USERS.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Delete ${user.name}`}
              disabled={isSubmitting}
              onClick={() => confirmDelete(user)}
            >
              <BsTrash />
            </button>
          ) : null}
        </div>
      ),
    },
  ]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <div className="d-flex flex-column flex-md-row gap-2">
              <div style={{ maxWidth: "320px" }}>
                <TableSearch
                  value={table.search}
                  actions={{ handleChange: table.actions.handleSearch }}
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
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add User
              </button>
            ) : null}
          </div>

          <Table
            ths={[
              { content: "User Information", sortKey: "userInformation" },
              "Role",
              "Status",
              { className: "text-end", content: "Actions" },
            ]}
            tds={tableRows}
            isLoading={isLoading}
            isWrapHeader
            emptyMessage="No users yet. Add a user to start managing access."
            sortConfig={table.sortConfig}
            actions={{ handleSort: table.actions.handleSort }}
          />

          {!isLoading ? (
            <TablePagination
              page={table.page}
              totalPages={table.totalPages}
              totalItems={table.totalItems}
              pageSize={table.pageSize}
              actions={{
                handlePageChange: table.actions.handlePageChange,
                handlePageSizeChange: table.actions.handlePageSizeChange,
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
