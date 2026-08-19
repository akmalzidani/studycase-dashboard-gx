import type { PackageSummary } from "@/helpers/analytics.helpers";
import { formatCurrency } from "@/helpers/formatters.helpers";

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
      {canReadProspects && (
        <div className="col-lg-4">
          <section className="card h-100">
            <div className="card-body">
              <h2 className="h5">Funnel prospect</h2>
              <p className="text-muted small">
                Status tindak lanjut prospect saat ini.
              </p>
              <div className="d-flex justify-content-between mb-2">
                <span>Completed</span>
                <strong>{completedProspectCount}</strong>
              </div>
              <div
                className="progress mb-3"
                role="progressbar"
                aria-label="Prospect completed"
                aria-valuenow={completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="d-flex justify-content-between">
                <span>Pending</span>
                <strong>{pendingProspectCount}</strong>
              </div>
              <p className="text-muted small mb-0 mt-3">
                Completion rate: {completionRate}%
              </p>
            </div>
          </section>
        </div>
      )}

      {canReadCustomers && (
        <div className="col-lg-8">
          <section className="card h-100">
            <div className="card-body">
              <h2 className="h5">Estimasi MRR per paket</h2>
              <p className="text-muted small">
                Dihitung dari customer dengan status aktif.
              </p>
              {packageSummaries.length === 0 ? (
                <p className="text-muted mb-0">
                  Belum ada data paket untuk dianalisis.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Paket</th>
                        <th className="text-end">Customer aktif</th>
                        <th className="text-end">Estimasi MRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageSummaries.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td className="text-end">{item.activeCustomers}</td>
                          <td className="text-end fw-semibold">
                            {formatCurrency(item.estimatedMrr)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {canReadProspects && (
        <div className="col-12">
          <section className="card">
            <div className="card-body">
              <h2 className="h5">Minat prospect per paket</h2>
              <div className="row g-3">
                {packageSummaries.map((item) => (
                  <div key={item.name} className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <p className="fw-semibold mb-3">{item.name}</p>
                      <div className="d-flex justify-content-between small">
                        <span>Pending</span>
                        <strong>{item.pendingProspects}</strong>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>Completed</span>
                        <strong>{item.completedProspects}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {(canReadCustomers || canReadProspects) && highestMrrPackage && (
        <div className="col-12">
          <div className="alert alert-primary mb-0" role="status">
            <strong>Insight:</strong> Paket {highestMrrPackage.name} saat ini
            memberikan estimasi MRR terbesar, yaitu{" "}
            {formatCurrency(highestMrrPackage.estimatedMrr)}.
          </div>
        </div>
      )}
    </div>
  );
}
