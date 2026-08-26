import { Badge } from "@/components/common/Badge";
import type { TableValue } from "@/components/common/Table";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { hasPermission } from "@/config/permission.helpers";
import type { Permissions } from "@/types";
import { BsEnvelope, BsPencilSquare, BsTrash } from "react-icons/bs";
import type { ManagedUser } from "../UserManagement/types";

interface TableRowUserProps {
  item: ManagedUser;
  permissions: Permissions;
  isSubmitting: boolean;
  actions: {
    handleEdit: (user: ManagedUser) => void;
    handleDelete: (user: ManagedUser) => void;
  };
}

export function TableRowUser({
  item,
  permissions,
  isSubmitting,
  actions,
}: TableRowUserProps) {
  const tds: TableValue[] = [
    <div className="d-grid gap-1">
      <span className="fw-semibold">{item.name}</span>
      <span className="d-flex align-items-center gap-2 small text-decoration-none">
        <BsEnvelope aria-hidden="true" />
        {item.email}
      </span>
    </div>,
    item.roleName,
    <Badge variant={item.status === "Active" ? "success" : "danger"}>
      {item.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          {hasPermission(permissions, PERMISSION_KEYS.USERS.UPDATE) ? (
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
          {hasPermission(permissions, PERMISSION_KEYS.USERS.DELETE) ? (
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
