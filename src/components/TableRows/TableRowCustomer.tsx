import { Badge } from "@/components/common/Badge";
import type { TableValue } from "@/components/common/Table";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import type { Customer, Permissions } from "@/types";
import {
  BsEnvelope,
  BsEye,
  BsPencilSquare,
  BsTrash,
  BsWhatsapp,
} from "react-icons/bs";

interface TableRowCustomerProps {
  customer: Customer;
  permissions: Permissions;
  isSubmitting: boolean;
  actions: {
    handleView: (customer: Customer) => void;
    handleEdit: (customer: Customer) => void;
    handleDelete: (customer: Customer) => void;
  };
}

export function TableRowCustomer({
  customer,
  permissions,
  isSubmitting,
  actions,
}: TableRowCustomerProps) {
  const tds: TableValue[] = [
    customer.id ?? "-",
    <div className="d-flex flex-column gap-1">
      <span className="fw-semibold">{customer.name}</span>
      <a
        className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
        href={`mailto:${customer.email}`}
      >
        <BsEnvelope aria-hidden="true" />
        {customer.email}
      </a>
      <a
        className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
        href={getWhatsAppUrl(customer.phoneNumber)}
        target="_blank"
        rel="noreferrer"
      >
        <BsWhatsapp aria-hidden="true" />
        {customer.phoneNumber}
      </a>
    </div>,
    <div>
      <div className="fw-medium">{customer.subscription.packageName}</div>
      <small className="text-muted">
        {formatSpeed(customer.subscription.speed)}
      </small>
    </div>,
    <Badge variant={customer.status === "Active" ? "success" : "danger"}>
      {customer.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm border-0 bg-transparent p-0 text-body-secondary"
            aria-label={`View ${customer.name} details`}
            data-bs-title={`View ${customer.name} details`}
            data-bs-toggle="tooltip"
            onClick={() => actions.handleView(customer)}
          >
            <BsEye />
          </button>
          {hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${customer.name}`}
              data-bs-title={`Edit ${customer.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleEdit(customer)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Delete ${customer.name}`}
              data-bs-title={`Delete ${customer.name}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleDelete(customer)}
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
