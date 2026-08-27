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
import type { Role } from "@/types";
import { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";

import { BsPlusLg } from "react-icons/bs";
import { RoleForm, type RoleFormValues } from "../Forms/RoleForm";
import { countPermissions, TableRowRole } from "../TableRows/TableRowRole";

export function RoleTab() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const {
    __roles,
    __isLoading,
    __isSubmitting,
    __handleCreateRole,
    __handleUpdateRole,
    __handleDeleteRole,
  } = useRoles();
  const tableFields = [
    {
      key: "name",
      getValue: (role: Role) => role.name,
      searchable: true,
    },
    {
      key: "description",
      getValue: (role: Role) => role.description,
    },
    {
      key: "accessCount",
      getValue: (role: Role) => countPermissions(role.permissions),
    },
  ];
  const {
    __data,
    __search,
    __page,
    __pageSize,
    __totalPages,
    __totalItems,
    __actions: { __handleSearch, __handlePageChange, __handlePageSizeChange },
  } = useTable({ data: __roles, fields: tableFields });
  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.ROLE_FORM);
  const {
    __selectedItem,
    __handleOpenCreateForm,
    __handleOpenEditForm,
    __handleConfirmDelete,
  } = useCrudFormActions<Role>({
    deleteTitle: "Delete role",
    deleteMessage: (role) =>
      `Are you sure you want to delete the ${role.name} role?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: __handleDeleteRole,
  });

  const _handleRoleSubmit = async (values: RoleFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      permissions: values.permissions,
    };
    const isSaved = __selectedItem?.id
      ? await __handleUpdateRole(__selectedItem.id, payload)
      : await __handleCreateRole(payload);

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

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <div className="w-100" style={{ maxWidth: "320px" }}>
          <TableSearch
            value={__search}
            actions={{ handleChange: __handleSearch }}
          />
        </div>
        {hasPermission(permissions, PERMISSION_KEYS.ROLES.CREATE) ? (
          <button
            className="btn btn-primary"
            type="button"
            disabled={__isSubmitting}
            onClick={__handleOpenCreateForm}
          >
            <BsPlusLg className="me-2" />
            Add Role
          </button>
        ) : null}
      </div>

      <div ref={tableContainerRef}>
        <Table
          ths={[
            { content: "Role name" },
            { content: "Description" },
            { content: "Access count" },
            { className: "text-end", content: "Actions" },
          ]}
          tds={__data}
          isLoading={__isLoading}
          isWrapHeader
          emptyMessage="No roles yet."
        >
          {__data.map((role) => (
            <TableRowRole
              key={role.id}
              item={role}
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

      {!__isLoading ? (
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

      <RoleForm
        isSubmitting={__isSubmitting}
        item={__selectedItem}
        actions={{ handleSubmit: _handleRoleSubmit }}
      />
    </>
  );
}
