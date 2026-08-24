import { PackageInterestSection } from "./PackageInterestSection";
import { PackageMrrSection } from "./PackageMrrSection";
import { ProspectFunnelSection } from "./ProspectFunnelSection";
import { SalesInsight } from "./SalesInsight";
import type { PackageSummary } from "@/helpers/analytics.helpers";

export type { PackageSummary } from "@/helpers/analytics.helpers";

interface AnalyticsContentProps {
  canReadCustomers: boolean;
  canReadProspects: boolean;
  pendingProspectCount: number;
  completedProspectCount: number;
  completionRate: number;
  packageSummaries: PackageSummary[];
  highestMrrPackage?: PackageSummary;
}

export function AnalyticsContent({
  canReadCustomers,
  canReadProspects,
  pendingProspectCount,
  completedProspectCount,
  completionRate,
  packageSummaries,
  highestMrrPackage,
}: AnalyticsContentProps) {
  return (
    <div className="row g-4">
      {canReadProspects ? (
        <ProspectFunnelSection
          pendingProspectCount={pendingProspectCount}
          completedProspectCount={completedProspectCount}
          completionRate={completionRate}
        />
      ) : null}

      {canReadCustomers ? (
        <PackageMrrSection
          className={canReadProspects ? "col-lg-8" : "col-12"}
          packageSummaries={packageSummaries}
        />
      ) : null}

      {canReadProspects ? (
        <PackageInterestSection packageSummaries={packageSummaries} />
      ) : null}

      {(canReadCustomers || canReadProspects) && highestMrrPackage ? (
        <SalesInsight highestMrrPackage={highestMrrPackage} />
      ) : null}
    </div>
  );
}
