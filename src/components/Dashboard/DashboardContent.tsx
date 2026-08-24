import {
  CustomerStatusChart,
  ProspectFunnelChart,
} from "@/components/common/Charts";
import { APP_PATHS } from "@/config/paths.config";
import { formatCurrency } from "@/helpers/formatters.helpers";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BsExclamationTriangle,
  BsPeople,
  BsPersonCheck,
  BsPersonPlus,
} from "react-icons/bs";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant: "success" | "danger" | "info" | "secondary" | "primary";
}

interface DashboardContentProps {
  canReadCustomers: boolean;
  canReadProspects: boolean;
  activeCustomerCount: number;
  blockedCustomerCount: number;
  pendingProspectCount: number;
  completedProspectCount: number;
  estimatedMrr: number;
}

function MetricCard({ label, value, icon, variant }: MetricCardProps) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card h-100">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`rounded-3 p-3 text-bg-${variant}`}>{icon}</div>
          <div>
            <p className="text-muted small mb-1">{label}</p>
            <p className="h4 mb-0 fw-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardContent({
  canReadCustomers,
  canReadProspects,
  activeCustomerCount,
  blockedCustomerCount,
  pendingProspectCount,
  completedProspectCount,
  estimatedMrr,
}: DashboardContentProps) {
  return (
    <>
      <div className="row g-3 mb-4">
        {canReadCustomers ? (
          <>
            <MetricCard
              label="Active customers"
              value={activeCustomerCount}
              icon={<BsPersonCheck className="fs-4" />}
              variant="success"
            />
            <MetricCard
              label="Blocked customers"
              value={blockedCustomerCount}
              icon={<BsExclamationTriangle className="fs-4" />}
              variant="danger"
            />
            <MetricCard
              label="Estimated MRR"
              value={formatCurrency(estimatedMrr)}
              icon={<BsPeople className="fs-4" />}
              variant="primary"
            />
          </>
        ) : null}
        {canReadProspects ? (
          <MetricCard
            label="Pending prospects"
            value={pendingProspectCount}
            icon={<BsPersonPlus className="fs-4" />}
            variant="info"
          />
        ) : null}
      </div>

      <div className="row g-4">
        {canReadCustomers ? (
          <div className="col-lg-6">
            <section className="card h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="h5">Customer health</h2>
                <p className="text-muted small">
                  Active customers compared with accounts requiring immediate
                  attention.
                </p>
                <div
                  className="position-relative flex-grow-1"
                  style={{ minHeight: 250 }}
                >
                  <CustomerStatusChart
                    activeCustomerCount={activeCustomerCount}
                    blockedCustomerCount={blockedCustomerCount}
                  />
                </div>
                <Link
                  className="btn btn-outline-primary align-self-start mt-3"
                  to={APP_PATHS.CUSTOMERS.INDEX}
                >
                  Review Customers
                </Link>
              </div>
            </section>
          </div>
        ) : null}
        {canReadProspects ? (
          <div className="col-lg-6">
            <section className="card h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="h5">Sales follow-up priority</h2>
                <p className="text-muted small">
                  {pendingProspectCount > 0
                    ? `${pendingProspectCount} prospects are waiting for the next sales action.`
                    : "No prospects are waiting for follow-up."}
                </p>
                <div
                  className="position-relative flex-grow-1"
                  style={{ minHeight: 250 }}
                >
                  <ProspectFunnelChart
                    pendingProspectCount={pendingProspectCount}
                    completedProspectCount={completedProspectCount}
                  />
                </div>
                <Link
                  className="btn btn-outline-primary align-self-start mt-3"
                  to={APP_PATHS.PROSPECT.INDEX}
                >
                  Open Sales Queue
                </Link>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}
