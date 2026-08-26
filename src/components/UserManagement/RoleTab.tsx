import { Table } from "@/components/common/Table";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { hasPermission } from "@/config/permission.helpers";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useRoles } from "@/hooks/useRoles";
import { useTable } from "@/hooks/useTable";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Permissions, Role } from "@/types";
import { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";

import { BsPencilSquare, BsPlusLg, BsTrash } from "react-icons/bs";
import { RoleForm, type RoleFormValues } from "../Forms/RoleForm";

function countPermissions(permissions: Permissions): number {
  return Object.values(permissions).reduce<number>(
    (total, value) =>
      total +
      (typeof value === "object" ? countPermissions(value) : Number(value)),
    0,
  );
}

export function RoleTab() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const {
    __roles: roles,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateRole: _handleCreateRole,
    __handleUpdateRole: _handleUpdateRole,
    __handleDeleteRole: _handleDeleteRole,
  } = useRoles();
  const tableFields = [
    {
      key: "name",
      getValue: (role: Role) => role.name,
      searchable: true,
      sortable: true,
    },
    {
      key: "description",
      getValue: (role: Role) => role.description,
    },
    {
      key: "accessCount",
      getValue: (role: Role) => countPermissions(role.permissions),
      sortable: true,
    },
  ];
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
  } = useTable({ data: roles, fields: tableFields });
  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.ROLE_FORM);
  const {
    __selectedItem: selectedRole,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  } = useCrudFormActions<Role>({
    deleteTitle: "Delete role",
    deleteMessage: (role) =>
      `Are you sure you want to delete the ${role.name} role?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: _handleDeleteRole,
  });

  const _handleRoleSubmit = async (values: RoleFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      permissions: values.permissions,
    };
    const isSaved = selectedRole?.id
      ? await _handleUpdateRole(selectedRole.id, payload)
      : await _handleCreateRole(payload);

    return isSaved;
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

  const tableRows = data.map((role) => {
    const accessCount = countPermissions(role.permissions);

    return [
      <span className="fw-semibold">{role.name}</span>,
      role.description,
      `${accessCount} permission${accessCount === 1 ? "" : "s"}`,
      {
        className: "text-end",
        content: (
          <div className="d-flex justify-content-end gap-2">
            {hasPermission(permissions, PERMISSION_KEYS.ROLES.UPDATE) ? (
              <button
                type="button"
                className="btn btn-sm border-0 bg-transparent p-0 text-primary"
                aria-label={`Edit ${role.name}`}
                data-bs-title={`Edit ${role.name}`}
                data-bs-toggle="tooltip"
                disabled={isSubmitting}
                onClick={() => _handleOpenEditForm(role)}
              >
                <BsPencilSquare />
              </button>
            ) : null}
            {hasPermission(permissions, PERMISSION_KEYS.ROLES.DELETE) ? (
              <button
                type="button"
                className="btn btn-sm border-0 bg-transparent p-0 text-danger"
                aria-label={`Delete ${role.name}`}
                data-bs-title={`Delete ${role.name}`}
                data-bs-toggle="tooltip"
                disabled={isSubmitting}
                onClick={() => _handleConfirmDelete(role)}
              >
                <BsTrash />
              </button>
            ) : null}
          </div>
        ),
      },
    ];
  });

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <div className="w-100" style={{ maxWidth: "320px" }}>
          <TableSearch
            value={search}
            actions={{ handleChange: _handleSearch }}
          />
        </div>
        {hasPermission(permissions, PERMISSION_KEYS.ROLES.CREATE) ? (
          <button
            className="btn btn-primary"
            type="button"
            disabled={isSubmitting}
            onClick={_handleOpenCreateForm}
          >
            <BsPlusLg className="me-2" />
            Add Role
          </button>
        ) : null}
      </div>

      <div ref={tableContainerRef}>
        <Table
          ths={[
            { content: "Role name", sortKey: "name" },
            { content: "Description" },
            { content: "Access count", sortKey: "accessCount" },
            { className: "text-end", content: "Actions" },
          ]}
          tds={tableRows}
          isLoading={isLoading}
          isWrapHeader
          emptyMessage="No roles yet."
          sortConfig={sortConfig}
          actions={{ handleSort: _handleSort }}
        />
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

      <RoleForm
        isSubmitting={isSubmitting}
        item={selectedRole}
        actions={{ handleSubmit: _handleRoleSubmit }}
      />
    </>
  );
}
