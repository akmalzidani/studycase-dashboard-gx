import type { TableValue } from "@/components/common/Table";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { hasPermission } from "@/config/permission.helpers";
import type { Permissions, Role } from "@/types";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

interface TableRowRoleProps {
  item: Role;
  permissions: Permissions;
  isSubmitting: boolean;
  actions: {
    handleEdit: (role: Role) => void;
    handleDelete: (role: Role) => void;
  };
}

export function countPermissions(permissions: Permissions): number {
  return Object.values(permissions).reduce<number>(
    (total, value) =>
      total +
      (typeof value === "object" ? countPermissions(value) : Number(value)),
    0,
  );
}

export function TableRowRole({
  item,
  permissions,
  isSubmitting,
  actions,
}: TableRowRoleProps) {
  const accessCount = countPermissions(item.permissions);
  const tds: TableValue[] = [
    <span className="fw-semibold">{item.name}</span>,
    item.description,
    `${accessCount} permission${accessCount === 1 ? "" : "s"}`,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          {hasPermission(permissions, PERMISSION_KEYS.ROLES.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${item.name}`}
              data-bs-title={`Edit ${item.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleEdit(item)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.ROLES.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Delete ${item.name}`}
              data-bs-title={`Delete ${item.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleDelete(item)}
            >
              <BsTrash />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <tr>
      {tds.map((td, index) => {
        const cell =
          typeof td === "object" && td !== null && "content" in td
            ? td
            : { content: td };

        return (
          <td key={index} className={cell.className}>
            {cell.content}
          </td>
        );
      })}
    </tr>
  );
}
