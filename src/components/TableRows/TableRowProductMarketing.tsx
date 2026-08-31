import type { TableValue } from "@/components/common/Table";
import {
  formatApiDateTime,
  formatCurrency,
  getNameInitials,
} from "@/helpers/formatters.helpers";
import type { ProductMarketing } from "@/types/product-marketing.types";
import { BsStarFill } from "react-icons/bs";

interface TableRowProductMarketingProps {
  product: ProductMarketing;
}

export function TableRowProductMarketing({
  product,
}: TableRowProductMarketingProps) {
  const branches = (product.branches ?? []).filter((branch) => branch.assigned);
  const visibleInformations = (product.informations ?? []).slice(0, 2);
  const remainingInformations =
    (product.informations?.length ?? 0) - visibleInformations.length;
  const validAddOns = (product.addOns ?? []).filter((addOn) => addOn.valid);
  const creatorName = product.product.createdBy || "-";
  const billingMonths = product.billingCycle?.billEveryNMonth ?? 1;
  const finalPrice = product.finalDiscountedFee ?? product.finalBaseFee;
  const hasDiscount = finalPrice > 0 && product.finalBaseFee > finalPrice;
  const discountAmount = Math.max(product.finalBaseFee - finalPrice, 0);
  const discountPercentage = hasDiscount
    ? Math.round((discountAmount / product.finalBaseFee) * 100)
    : 0;
  const monthlyEquivalent =
    billingMonths > 1 && finalPrice > 0 ? finalPrice / billingMonths : null;

  const tds: TableValue[] = [
    // ---- START BASE PRODUCT ----
    <div style={{ minWidth: "180px" }}>
      <div className="fw-semibold text-break">{product.product.name}</div>
      <div className="small text-muted text-break">
        {product.product.group.name} · {product.product.category.name}
      </div>
      <div className="small text-muted font-monospace text-break">
        {product.product.number}
      </div>
    </div>,
    // ---- END BASE PRODUCT ----

    // ---- START PRODUCT VARIANT ----
    <div style={{ minWidth: "160px", maxWidth: "210px" }}>
      {/*{baseAttachment ? (
        <img
          src={baseAttachment.file}
          alt=""
          className="rounded border object-fit-contain flex-shrink-0"
          width={48}
          height={48}
        />
      ) : (
        <div
          className="rounded border bg-light d-flex align-items-center justify-content-center text-muted fw-semibold flex-shrink-0"
          style={{ width: 48, height: 48 }}
        >
          {(product.alias || product.product.name).charAt(0).toUpperCase()}
        </div>
      )}*/}
      <div className="mw-100">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-break">
            {product.alias || product.product.name}
          </span>
          {product.popular ? (
            <BsStarFill
              className="text-warning flex-shrink-0"
              aria-label="Popular product"
              title="Popular product"
            />
          ) : null}
        </div>
        <div className="small text-muted text-break">
          <span className="font-monospace">{product.number}</span>
        </div>
        <div className="d-flex flex-wrap gap-1 mt-1">
          <span
            className={`badge text-bg-${product.active ? "success" : "danger"}`}
          >
            {product.active ? "Active" : "Inactive"}
          </span>
          <span
            className={`badge text-bg-${product.publish ? "primary" : "secondary"}`}
          >
            {product.publish ? "Published" : "Unpublished"}
          </span>
        </div>
        {visibleInformations.length ? (
          <div className="d-flex flex-wrap gap-1 mt-2">
            {visibleInformations.map((information) => (
              <span
                key={information.id}
                className="badge text-bg-light border text-dark fw-normal"
              >
                {information.name}
              </span>
            ))}
            {remainingInformations > 0 ? (
              <span className="badge text-bg-light border text-muted fw-normal">
                +{remainingInformations} more
              </span>
            ) : null}
          </div>
        ) : null}
        {validAddOns.length || product.techvisitFree > 0 ? (
          <div className="d-flex flex-wrap gap-1 mt-1">
            {validAddOns.map((addOn) => (
              <span
                key={addOn.id}
                className="badge text-bg-primary-subtle border border-primary-subtle text-primary-emphasis fw-normal text-break"
                title={addOn.description || undefined}
              >
                <span className="fw-semibold">{addOn.name}</span>
                {addOn.description && addOn.description !== addOn.name
                  ? ` · ${addOn.description}`
                  : ""}
                {addOn.additionalDiscount > 0
                  ? ` · Discount ${formatCurrency(addOn.additionalDiscount)}`
                  : ""}
              </span>
            ))}
            {product.techvisitFree > 0 ? (
              <span className="badge text-bg-success-subtle border border-success-subtle text-success-emphasis fw-normal">
                {product.techvisitFree} free tech visit
                {product.techvisitFree > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>,
    // ---- END PRODUCT VARIANT ----

    // ---- START BILLING & NETWORK ----
    <div style={{ minWidth: "100px" }}>
      <div className="fw-semibold">{product.networkSetting?.name ?? "-"}</div>
      <div className="small text-muted">
        {product.billingCycle?.name ?? "No billing cycle"}
        {product.billingCycle
          ? ` · ${billingMonths} month${billingMonths > 1 ? "s" : ""}`
          : ""}
      </div>
      <div className="small text-muted">Billing Date: {product.billNDate}</div>
    </div>,
    // ---- END BILLING & NETWORK ----

    // ---- START PRICING ----
    <div style={{ maxWidth: "190px" }}>
      <div className="fw-semibold">
        {formatCurrency(finalPrice)}
        <span
          className="small fw-normal text-muted ms-1"
          style={{ fontSize: "12px" }}
        >
          /{product.billingCycle?.name.toLowerCase() ?? "billing cycle"}
        </span>
      </div>
      {hasDiscount ? (
        <div style={{ fontSize: "12px" }}>
          <span className="text-muted text-decoration-line-through">
            {formatCurrency(product.finalBaseFee)}
          </span>{" "}
          <br />
          <span className="text-success fw-semibold">
            Save {formatCurrency(discountAmount)} ({discountPercentage}%)
          </span>
        </div>
      ) : null}
      {monthlyEquivalent ? (
        <div className="text-muted" style={{ fontSize: "12px" }}>
          ≈ {formatCurrency(monthlyEquivalent)}/month
        </div>
      ) : null}
      <div className="text-muted" style={{ fontSize: "12px" }}>
        {product.includeTax ? "Tax included" : "Tax excluded"}
        {product.taxFee > 0 ? (
          <span>{` · ${formatCurrency(product.taxFee)} tax`}</span>
        ) : null}
      </div>
      <div className="text-muted" style={{ fontSize: "12px" }}>
        Setup:{" "}
        {product.setupFee > 0 ? (
          <span>{formatCurrency(product.setupFee)}</span>
        ) : (
          "Free"
        )}
      </div>
    </div>,
    // ---- END PRICING ----

    // ---- START BRANCHES ----
    <div style={{ minWidth: "190px" }}>
      <div className="fw-semibold mb-1">
        {branches.length} branch{branches.length !== 1 ? "es" : ""}
      </div>
      {branches.length ? (
        <ul
          className="branch-list list-unstyled mb-0 overflow-y-auto pe-1"
          style={{ maxHeight: "96px", fontSize: "12px" }}
        >
          {branches.map((branch) => (
            <li key={branch.id} className="text-break">
              <span className="font-monospace text-muted">{branch.code}</span>
              {" · "}
              <span>{branch.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted" style={{ fontSize: "12px" }}>
          No assigned branches
        </div>
      )}
    </div>,
    // ---- END BRANCHES ----

    // ---- START CREATOR ----
    <div
      className="d-flex align-items-center gap-2"
      style={{ minWidth: "165px" }}
    >
      <div
        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
        style={{ width: 32, height: 32 }}
      >
        {getNameInitials(creatorName)}
      </div>
      <div>
        <div className="fw-semibold text-break" style={{ fontSize: "12px" }}>
          {creatorName}
        </div>
        <div className="text-muted" style={{ fontSize: "10px" }}>
          {formatApiDateTime(product.product.createdAt)}
        </div>
      </div>
    </div>,
    // ---- END CREATOR ----
  ];

  return (
    <tr>
      {tds.map((td, index) => {
        const cell =
          typeof td === "object" && td !== null && "content" in td
            ? td
            : { content: td };

        return (
          <td key={index} className={cell.className}>
            {cell.content}
          </td>
        );
      })}
    </tr>
  );
}
