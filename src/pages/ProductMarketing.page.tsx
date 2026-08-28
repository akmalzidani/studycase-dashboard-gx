import { ProductMarketingFilterModal } from "@/components/ProductMarketing/ProductMarketingFilterModal";
import { ProductMarketingTable } from "@/components/ProductMarketing/ProductMarketingTable";
import { useProductMarketing } from "@/hooks/useProductMarketing";
import type { ProductMarketingFilters } from "@/types/product-marketing.types";
import { useState } from "react";

const INITIAL_FILTERS: ProductMarketingFilters = {
  search: "",
  productIds: [],
  billingCycleIds: [],
  publish: undefined,
};

function ProductMarketingPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { __products, __pagination, __isLoading, __error, __handleRetry } =
    useProductMarketing(filters, page, limit);
  const activeFilterCount =
    Number(filters.productIds.length > 0) +
    Number(filters.billingCycleIds.length > 0) +
    Number(filters.publish !== undefined);

  return (
    <>
      {__error ? (
        <div className="alert alert-danger d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <span>{__error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={__handleRetry}
          >
            Retry
          </button>
        </div>
      ) : null}
      <ProductMarketingTable
        products={__products}
        isLoading={__isLoading}
        search={filters.search}
        pagination={__pagination}
        activeFilterCount={activeFilterCount}
        actions={{
          handleSearch: (search) => {
            setPage(1);
            setFilters((current) => ({ ...current, search }));
          },
          handlePageChange: setPage,
          handlePageSizeChange: (nextLimit) => {
            setPage(1);
            setLimit(nextLimit);
          },
          handleResetAll: () => {
            setPage(1);
            setFilters(INITIAL_FILTERS);
          },
        }}
      />
      <ProductMarketingFilterModal
        filters={filters}
        actions={{
          handleApply: (nextFilters) => {
            setPage(1);
            setFilters((current) => ({ ...current, ...nextFilters }));
          },
        }}
      />
    </>
  );
}

export default ProductMarketingPage;
