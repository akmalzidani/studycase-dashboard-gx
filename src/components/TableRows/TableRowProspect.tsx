import { Badge } from "@/components/common/Badge";
import type { TableValue } from "@/components/common/Table";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import type { Permissions, Prospect } from "@/types";
import {
  BsEnvelope,
  BsEye,
  BsPencilSquare,
  BsTrash,
  BsWhatsapp,
} from "react-icons/bs";

interface TableRowProspectProps {
  prospect: Prospect;
  permissions: Permissions;
  isSubmitting: boolean;
  actions: {
    handleView: (prospect: Prospect) => void;
    handleEdit: (prospect: Prospect) => void;
    handleDelete: (prospect: Prospect) => void;
  };
}

export function TableRowProspect({
  prospect,
  permissions,
  isSubmitting,
  actions,
}: TableRowProspectProps) {
  const tds: TableValue[] = [
    prospect.id ?? "-",
    <div className="d-flex flex-column gap-1">
      <span className="fw-semibold">{prospect.name}</span>
      <a
        className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
        href={`mailto:${prospect.email}`}
      >
        <BsEnvelope aria-hidden="true" />
        {prospect.email}
      </a>
      <a
        className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
        href={getWhatsAppUrl(prospect.phoneNumber)}
        target="_blank"
        rel="noreferrer"
      >
        <BsWhatsapp aria-hidden="true" />
        {prospect.phoneNumber}
      </a>
    </div>,
    <div>
      <div className="fw-medium">{prospect.subscription.packageName}</div>
      <small className="text-muted">
        {formatSpeed(prospect.subscription.speed)}
      </small>
    </div>,
    <Badge variant={prospect.status === "Completed" ? "success" : "warning"}>
      {prospect.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm border-0 bg-transparent p-0 text-body-secondary"
            aria-label={`View ${prospect.name} details`}
            data-bs-title={`View ${prospect.name} details`}
            data-bs-toggle="tooltip"
            onClick={() => actions.handleView(prospect)}
          >
            <BsEye />
          </button>
          {hasPermission(permissions, PERMISSION_KEYS.PROSPECT.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${prospect.name}`}
              data-bs-title={`Edit ${prospect.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleEdit(prospect)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.PROSPECT.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Hapus ${prospect.name}`}
              data-bs-title={`Hapus ${prospect.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleDelete(prospect)}
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
