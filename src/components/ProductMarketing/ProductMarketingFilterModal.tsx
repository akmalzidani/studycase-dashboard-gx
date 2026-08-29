import { Modal } from "@/components/common/Modal";
import {
  MultiSelectField,
  type MultiSelectOption,
} from "@/components/common/MultiSelectField";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { hideModal } from "@/helpers/modal.helpers";
import type { ProductMarketingFilters } from "@/types/product-marketing.types";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

interface ProductMarketingFilterModalProps {
  filters: ProductMarketingFilters;
  searchInput: string;
  pageSize: number;
  actions: {
    handleApply: (filters: ProductMarketingFilters, pageSize: number) => void;
    handleSearchInputChange: (search: string) => void;
    handleResetAll: () => void;
    handleSaveSearch: (
      filters: ProductMarketingFilters,
      pageSize: number,
    ) => void;
  };
}

const PRODUCTS: readonly MultiSelectOption[] = [
  { id: 1, name: "Lite" },
  { id: 2, name: "Lite+" },
  { id: 3, name: "Signature" },
  { id: 4, name: "Dedicated Link" },
];

const BILLING_CYCLES: readonly MultiSelectOption[] = [
  { id: 4, name: "Monthly" },
  { id: 1, name: "Quarterly" },
  { id: 2, name: "Semester" },
  { id: 3, name: "Annual" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export function ProductMarketingFilterModal({
  filters,
  searchInput,
  pageSize,
  actions,
}: ProductMarketingFilterModalProps) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftPageSize, setDraftPageSize] = useState(pageSize);

  useEffect(() => {
    setDraftFilters(filters);
    setDraftPageSize(pageSize);
  }, [filters, pageSize]);

  const _handleReset = () => {
    actions.handleResetAll();
    hideModal(OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER);
  };
  const _handleApply = (event?: SyntheticEvent<HTMLFormElement>) => {
    event?.preventDefault();
    actions.handleApply(
      { ...draftFilters, search: searchInput },
      draftPageSize,
    );
    hideModal(OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER);
  };
  const _handleSaveSearch = () => {
    actions.handleSaveSearch(
      { ...draftFilters, search: searchInput },
      draftPageSize,
    );
  };

  return (
    <Modal
      target={OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER}
      title="Advanced Search"
      size="lg"
      footer={
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex gap-2 align-items-center">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                hideModal(OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER)
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-marketing-filter-form"
              className="btn btn-primary"
            >
              Apply filter
            </button>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={_handleSaveSearch}
            >
              Save search
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={_handleReset}
            >
              Clear all
            </button>
          </div>
        </div>
      }
    >
      <form
        id="product-marketing-filter-form"
        onSubmit={_handleApply}
        className="row g-3 align-items-start"
      >
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold" htmlFor="product-search">
            Search
          </label>
          <input
            id="product-search"
            type="search"
            className="form-control"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) =>
              actions.handleSearchInputChange(event.target.value)
            }
          />
        </div>
        <div className="col-12 col-md-6">
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
        <div className="col-12 col-md-6">
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
        <div className="col-12 col-md-6">
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

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold" htmlFor="page-size-filter">
            Limit
          </label>
          <select
            id="page-size-filter"
            className="form-select"
            value={draftPageSize}
            onChange={(event) => setDraftPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
}
