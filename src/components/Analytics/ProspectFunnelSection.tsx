import { ProspectFunnelChart } from "@/components/common/Charts";

interface ProspectFunnelSectionProps {
  pendingProspectCount: number;
  completedProspectCount: number;
  completionRate: number;
}

export function ProspectFunnelSection({
  pendingProspectCount,
  completedProspectCount,
  completionRate,
}: ProspectFunnelSectionProps) {
  return (
    <div className="col-lg-4">
      <section className="card h-100">
        <div className="card-body d-flex flex-column">
          <h2 className="h5">Prospect funnel</h2>
          <p className="text-muted small">
            Conversion progress from the current sales follow-up queue.
          </p>
          <div
            className="position-relative flex-grow-1"
            style={{ minHeight: 240 }}
          >
            <ProspectFunnelChart
              pendingProspectCount={pendingProspectCount}
              completedProspectCount={completedProspectCount}
            />
          </div>
          <div className="d-flex justify-content-between border-top pt-3 mt-2">
            <span className="text-muted">Completion rate</span>
            <strong className="text-success">{completionRate}%</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
