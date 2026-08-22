import { PackageInterestChart } from "@/components/common/Charts";
import type { PackageSummary } from "@/helpers/analytics.helpers";

interface PackageInterestSectionProps {
  packageSummaries: PackageSummary[];
}

export function PackageInterestSection({
  packageSummaries,
}: PackageInterestSectionProps) {
  return (
    <div className="col-12">
      <section className="card">
        <div className="card-body">
          <h2 className="h5 mb-1">Prospect interest by package</h2>
          <p className="text-muted small mb-0">
            Compare the pipeline volume and completed follow-up for each package.
          </p>
          {packageSummaries.length > 0 ? (
            <div className="position-relative mt-4" style={{ height: 320 }}>
              <PackageInterestChart packageSummaries={packageSummaries} />
            </div>
          ) : (
            <p className="text-muted mb-0 mt-3">
              No prospect package interest is available yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
