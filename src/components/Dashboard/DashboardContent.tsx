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
  estimatedMrr,
}: DashboardContentProps) {
  return (
    <>
      <div className="row g-3 mb-4">
        {canReadCustomers && (
          <>
            <MetricCard
              label="Customer aktif"
              value={activeCustomerCount}
              icon={<BsPersonCheck className="fs-4" />}
              variant="success"
            />
            <MetricCard
              label="Customer diblokir"
              value={blockedCustomerCount}
              icon={<BsExclamationTriangle className="fs-4" />}
              variant="danger"
            />
            <MetricCard
              label="Estimasi MRR"
              value={formatCurrency(estimatedMrr)}
              icon={<BsPeople className="fs-4" />}
              variant="primary"
            />
          </>
        )}
        {canReadProspects && (
          <MetricCard
            label="Prospect pending"
            value={pendingProspectCount}
            icon={<BsPersonPlus className="fs-4" />}
            variant="info"
          />
        )}
      </div>

      <div className="row g-4">
        {canReadProspects && (
          <div className="col-lg-6">
            <section className="card h-100">
              <div className="card-body">
                <h2 className="h5">Tindak lanjut prospect</h2>
                <p className="text-muted mb-4">
                  {pendingProspectCount > 0
                    ? `${pendingProspectCount} prospect masih menunggu tindak lanjut.`
                    : "Tidak ada prospect yang menunggu tindak lanjut."}
                </p>
                <Link
                  className="btn btn-outline-primary"
                  to={APP_PATHS.PROSPECT.INDEX}
                >
                  Lihat Prospect
                </Link>
              </div>
            </section>
          </div>
        )}
        {canReadCustomers && (
          <div className="col-lg-6">
            <section className="card h-100">
              <div className="card-body">
                <h2 className="h5">Status customer</h2>
                <p className="text-muted mb-4">
                  {blockedCustomerCount > 0
                    ? `${blockedCustomerCount} customer diblokir dan perlu diperiksa.`
                    : "Seluruh customer berada dalam status aktif."}
                </p>
                <Link
                  className="btn btn-outline-primary"
                  to={APP_PATHS.CUSTOMERS.INDEX}
                >
                  Lihat Customer
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
