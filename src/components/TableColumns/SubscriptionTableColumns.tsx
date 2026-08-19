import type { Column } from "@/components/common/DataTable";
import type { Subscription } from "@/types";
import { formatCurrency, formatSpeed } from "@/helpers/formatters.helpers";

export const subscriptionTableColumns: Column<Subscription>[] = [
  {
    key: "packageName",
    header: "Paket",
    sortKey: "packageName",
    className: "fw-semibold",
  },
  {
    key: "speed",
    header: "Kecepatan",
    sortKey: "speed",
    render: (subscription) => formatSpeed(subscription.speed),
  },
  {
    key: "monthlyFee",
    header: "Biaya per bulan",
    className: "font-monospace",
    sortKey: "monthlyFee",
    render: (subscription) => formatCurrency(subscription.monthlyFee),
  },
];
