import type { PackageSummary } from "@/helpers/analytics.helpers";
import { formatCurrency } from "@/helpers/formatters.helpers";

interface SalesInsightProps {
  highestMrrPackage: PackageSummary;
}

export function SalesInsight({ highestMrrPackage }: SalesInsightProps) {
  return (
    <div className="col-12">
      <div className="alert alert-primary mb-0" role="status">
        <strong>Sales insight:</strong> Focus upsell activity on the{" "}
        <strong>{highestMrrPackage.name}</strong> package. It currently
        contributes the highest estimated MRR of{" "}
        <strong>{formatCurrency(highestMrrPackage.estimatedMrr)}</strong>.
      </div>
    </div>
  );
}
