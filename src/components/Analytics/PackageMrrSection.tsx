import { PackageMrrChart } from "@/components/common/Charts";
import type { PackageSummary } from "@/helpers/analytics.helpers";

interface PackageMrrSectionProps {
  className: string;
  packageSummaries: PackageSummary[];
}

export function PackageMrrSection({
  className,
  packageSummaries,
}: PackageMrrSectionProps) {
  return (
    <div className={className}>
      <section className="card h-100">
        <div className="card-body d-flex flex-column">
          <h2 className="h5">Estimated MRR by package</h2>
          <p className="text-muted small">
            Active customer revenue contribution by subscription package.
          </p>
          {packageSummaries.length > 0 ? (
            <div
              className="position-relative flex-grow-1"
              style={{ minHeight: 300 }}
            >
              <PackageMrrChart packageSummaries={packageSummaries} />
            </div>
          ) : (
            <p className="text-muted mb-0">
              No package data is available for analysis yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
