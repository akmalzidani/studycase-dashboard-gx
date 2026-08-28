import { Modal } from "@/components/common/Modal";
import {
    MultiSelectField,
    type MultiSelectOption,
} from "@/components/common/MultiSelectField";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideModal } from "@/helpers/modal.helpers";
import type { ProductMarketingFilters } from "@/types/product-marketing.types";
import { useEffect, useState } from "react";

interface ProductMarketingFilterModalProps {
  filters: ProductMarketingFilters;
  actions: {
    handleApply: (filters: Omit<ProductMarketingFilters, "search">) => void;
  };
}

const PRODUCTS: readonly MultiSelectOption[] = [
  { id: 1, name: "Lite" },
  { id: 2, name: "Lite+" },
  { id: 3, name: "Signature" },
  { id: 4, name: "Dedicated Link" },
];

const BILLING_CYCLES: readonly MultiSelectOption[] = [
  { id: 1, name: "Quarterly" },
  { id: 2, name: "Semester" },
  { id: 3, name: "Annual" },
  { id: 4, name: "Monthly" },
];

const EMPTY_FILTERS: Omit<ProductMarketingFilters, "search"> = {
  productIds: [],
  billingCycleIds: [],
  publish: undefined,
};

export function ProductMarketingFilterModal({
  filters,
  actions,
}: ProductMarketingFilterModalProps) {
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    setDraftFilters({
      productIds: filters.productIds,
      billingCycleIds: filters.billingCycleIds,
      publish: filters.publish,
    });
  }, [filters]);

  const handleReset = () => setDraftFilters(EMPTY_FILTERS);
  const handleApply = () => {
    actions.handleApply(draftFilters);
    hideModal(OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER);
  };

  return (
    <Modal
      target={OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER}
      title="Filter Product Marketing"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleApply}
          >
            Apply filter
          </button>
        </>
      }
    >
      <div className="row g-3 align-items-start">
        <div className="col-12">
          <MultiSelectField
            id="product-filter"
            label="Product"
            options={PRODUCTS}
            selectedIds={draftFilters.productIds}
            onChange={(productIds) =>
              setDraftFilters((current) => ({ ...current, productIds }))
            }
          />
        </div>
        <div className="col-12">
          <MultiSelectField
            id="billing-cycle-filter"
            label="Billing cycle"
            options={BILLING_CYCLES}
            selectedIds={draftFilters.billingCycleIds}
            onChange={(billingCycleIds) =>
              setDraftFilters((current) => ({ ...current, billingCycleIds }))
            }
          />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold" htmlFor="publish-filter">
            Publish
          </label>
          <select
            id="publish-filter"
            className="form-select"
            value={
              draftFilters.publish === undefined
                ? ""
                : String(draftFilters.publish)
            }
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                publish:
                  event.target.value === ""
                    ? undefined
                    : event.target.value === "true",
              }))
            }
          >
            <option value="">All publication statuses</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
