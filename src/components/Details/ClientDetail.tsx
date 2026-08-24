import { Badge } from "@/components/common/Badge";
import { Offcanvas } from "@/components/common/Offcanvas";
import { OVERLAY_TARGETS, type OffcanvasTarget } from "@/config/overlay.config";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import type { Customer, Prospect } from "@/types";
import type { ReactNode } from "react";
import { BsEnvelope, BsPersonCircle, BsWhatsapp } from "react-icons/bs";

type Client = Customer | Prospect;
type ClientType = "customer" | "prospect";

interface ClientDetailProps {
  item: Client | null;
  type: ClientType;
}

interface DetailFieldProps {
  label: string;
  children: ReactNode;
}

const detailTargets: Record<ClientType, OffcanvasTarget> = {
  customer: OVERLAY_TARGETS.CUSTOMER_DETAIL,
  prospect: OVERLAY_TARGETS.PROSPECT_DETAIL,
};

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="row g-0 py-3 border-bottom">
      <dt className="col-5 text-muted fw-normal">{label}</dt>
      <dd className="col-auto mb-0 px-0 text-muted" aria-hidden="true">
        :
      </dd>
      <dd className="col mb-0 ps-2 fw-medium text-break">{children}</dd>
    </div>
  );
}

export function ClientDetail({ item, type }: ClientDetailProps) {
  const isCustomer = type === "customer";
  const statusVariant = isCustomer
    ? item?.status === "Active"
      ? "success"
      : "danger"
    : item?.status === "Completed"
      ? "success"
      : "warning";
  const clientLabel = isCustomer ? "Customer" : "Prospect";

  return (
    <Offcanvas target={detailTargets[type]} title={`${clientLabel} Details`}>
      {item && (
        <div className="d-grid gap-4">
          <div className="d-flex align-items-center gap-3 p-3 bg-body-tertiary border rounded">
            <BsPersonCircle
              className="display-6 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="h5 mb-1 text-break">{item.name}</p>
              <Badge variant={statusVariant}>{item.status}</Badge>
            </div>
          </div>

          <section aria-labelledby="client-contact-details">
            <h2
              id="client-contact-details"
              className="h6 text-uppercase text-muted small fw-semibold mb-0"
            >
              Contact information
            </h2>
            <dl className="mb-0">
              <DetailField label="Email">
                <a
                  className="d-inline-flex align-items-center gap-2 text-decoration-none"
                  href={`mailto:${item.email}`}
                >
                  <BsEnvelope aria-hidden="true" />
                  <span className="text-break">{item.email}</span>
                </a>
              </DetailField>
              <DetailField label="Phone number">
                <a
                  className="d-inline-flex align-items-center gap-2 text-decoration-none"
                  href={getWhatsAppUrl(item.phoneNumber)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <BsWhatsapp aria-hidden="true" />
                  {item.phoneNumber}
                </a>
              </DetailField>
            </dl>
          </section>

          <section aria-labelledby="client-subscription-details">
            <h2
              id="client-subscription-details"
              className="h6 text-uppercase text-muted small fw-semibold mb-0"
            >
              Subscription
            </h2>
            <dl className="mb-0">
              <DetailField label="Package">
                {item.subscription.packageName}
              </DetailField>
              <DetailField label="Speed">
                {formatSpeed(item.subscription.speed)}
              </DetailField>
            </dl>
          </section>
        </div>
      )}
    </Offcanvas>
  );
}
