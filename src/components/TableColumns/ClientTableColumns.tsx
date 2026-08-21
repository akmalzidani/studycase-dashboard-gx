import { Badge, type BadgeVariant } from "@/components/common/Badge";
import type { Column } from "@/components/common/DataTable";
import type { BaseClient } from "@/types";
import { formatSpeed } from "@/helpers/formatters.helpers";

export interface ClientTableItem extends BaseClient {
  status: string;
}

interface ClientTableColumnsOptions<T extends ClientTableItem> {
  getStatusVariant: (status: T["status"]) => BadgeVariant;
}

export function createClientTableColumns<T extends ClientTableItem>({
  getStatusVariant,
}: ClientTableColumnsOptions<T>): Column<T>[] {
  return [
    { key: "id", header: "ID", sortKey: "id" },
    { key: "name", header: "Name", sortKey: "name" },
    { key: "email", header: "Email", sortKey: "email" },
    { key: "phoneNumber", header: "Phone Number", sortKey: "phoneNumber" },
    {
      key: "subscription",
      header: "Subscription",
      render: (client) => (
        <div>
          <div className="fw-medium">{client.subscription.packageName}</div>
          <small className="text-muted">
            {formatSpeed(client.subscription.speed)}
          </small>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      render: (client) => (
        <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
      ),
    },
  ];
}
