import type { Column } from "@/components/common/DataTable";
import type { Subscription } from "@/types";
import { formatCurrency, formatSpeed } from "@/helpers/formatters.helpers";

export const subscriptionTableColumns: Column<Subscription>[] = [
  {
    key: "packageName",
    header: "Package",
    sortKey: "packageName",
    className: "fw-semibold",
  },
  {
    key: "speed",
    header: "Speed",
    sortKey: "speed",
    render: (subscription) => formatSpeed(subscription.speed),
  },
  {
    key: "monthlyFee",
    header: "Monthly fee",
    className: "font-monospace",
    sortKey: "monthlyFee",
    render: (subscription) => formatCurrency(subscription.monthlyFee),
  },
];
