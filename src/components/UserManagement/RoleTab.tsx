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
  const permissions = useAuthStore((store) => store.permissions);
  const { roles, isLoading, isSubmitting, createRole, updateRole, deleteRole } =
    useRoles();
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
  const table = useTable({ data: roles, fields: tableFields });
  const handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.ROLE_FORM);
  const roleActions = useCrudFormActions<Role>({
    deleteTitle: "Delete role",
    deleteMessage: (role) =>
      `Are you sure you want to delete the ${role.name} role?`,
    onOpenForm: handleFormOpen,
    onDelete: deleteRole,
  });

  const handleRoleSubmit = async (values: RoleFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      permissions: values.permissions,
    };
    const isSaved = roleActions.selectedItem?.id
      ? await updateRole(roleActions.selectedItem.id, payload)
      : await createRole(payload);

    return isSaved;
  };

  const tableRows = table.data.map((role) => {
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
                disabled={isSubmitting}
                onClick={() => roleActions.openEditForm(role)}
              >
                <BsPencilSquare />
              </button>
            ) : null}
            {hasPermission(permissions, PERMISSION_KEYS.ROLES.DELETE) ? (
              <button
                type="button"
                className="btn btn-sm border-0 bg-transparent p-0 text-danger"
                aria-label={`Delete ${role.name}`}
                disabled={isSubmitting}
                onClick={() => roleActions.confirmDelete(role)}
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
          <TableSearch value={table.search} onChange={table.setSearch} />
        </div>
        {hasPermission(permissions, PERMISSION_KEYS.ROLES.CREATE) ? (
          <button
            className="btn btn-primary"
            type="button"
            disabled={isSubmitting}
            onClick={roleActions.openCreateForm}
          >
            <BsPlusLg className="me-2" />
            Add Role
          </button>
        ) : null}
      </div>

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
        sortConfig={table.sortConfig}
        onSort={table.handleSort}
      />

      {!isLoading ? (
        <TablePagination
          page={table.page}
          totalPages={table.totalPages}
          totalItems={table.totalItems}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      ) : null}

      <RoleForm
        isSubmitting={isSubmitting}
        item={roleActions.selectedItem}
        onSubmit={handleRoleSubmit}
      />
    </>
  );
}
