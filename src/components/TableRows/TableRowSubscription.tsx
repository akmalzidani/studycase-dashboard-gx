import type { TableValue } from "@/components/common/Table";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { formatCurrency, formatSpeed } from "@/helpers/formatters.helpers";
import type { Permissions, Subscription } from "@/types";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

interface TableRowSubscriptionProps {
  subscription: Subscription;
  permissions: Permissions;
  isSubmitting: boolean;
  actions: {
    handleEdit: (subscription: Subscription) => void;
    handleDelete: (subscription: Subscription) => void;
  };
}

export function TableRowSubscription({
  subscription,
  permissions,
  isSubmitting,
  actions,
}: TableRowSubscriptionProps) {
  const tds: TableValue[] = [
    <span className="fw-semibold">{subscription.packageName}</span>,
    formatSpeed(subscription.speed),
    <span className="font-monospace">
      {formatCurrency(subscription.monthlyFee)}
    </span>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${subscription.packageName}`}
              data-bs-title={`Edit ${subscription.packageName}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleEdit(subscription)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Hapus ${subscription.packageName}`}
              data-bs-title={`Hapus ${subscription.packageName}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => actions.handleDelete(subscription)}
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
