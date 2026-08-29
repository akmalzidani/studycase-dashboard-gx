import { ProductMarketingFilterModal } from "@/components/ProductMarketing/ProductMarketingFilterModal";
import { ProductMarketingTable } from "@/components/ProductMarketing/ProductMarketingTable";
import { toast } from "@/components/Overlay/toast";
import {
  getStoredJson,
  removeStoredValue,
  setStoredJson,
} from "@/helpers/storage.helpers";
import { useProductMarketing } from "@/hooks/useProductMarketing";
import type { ProductMarketingFilters } from "@/types/product-marketing.types";
import { useState } from "react";

const DEFAULT_PAGE_SIZE = 10;
const SAVED_SEARCH_STORAGE_KEY = "product-marketing-saved-search";

const INITIAL_FILTERS: ProductMarketingFilters = {
  search: "",
  productIds: [],
  billingCycleIds: [],
  publish: undefined,
};

interface SavedProductMarketingSearch {
  filters: ProductMarketingFilters;
  limit: number;
}

function getSavedSearch(): SavedProductMarketingSearch | null {
  const savedSearch = getStoredJson<SavedProductMarketingSearch>(
    SAVED_SEARCH_STORAGE_KEY,
  );

  if (
    typeof savedSearch?.filters?.search !== "string" ||
    !Array.isArray(savedSearch.filters.productIds) ||
    !Array.isArray(savedSearch.filters.billingCycleIds) ||
    !Number.isInteger(savedSearch.limit) ||
    savedSearch.limit <= 0
  ) {
    return null;
  }

  return savedSearch;
}

function ProductMarketingPage() {
  const [savedSearch] = useState(getSavedSearch);
  const [filters, setFilters] = useState<ProductMarketingFilters>(
    savedSearch?.filters ?? INITIAL_FILTERS,
  );
  const [searchInput, setSearchInput] = useState(filters.search);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(savedSearch?.limit ?? DEFAULT_PAGE_SIZE);
  const { __products, __pagination, __isLoading, __error, __handleRetry } =
    useProductMarketing(filters, page, limit);
  const activeFilterCount =
    Number(filters.productIds.length > 0) +
    Number(filters.billingCycleIds.length > 0) +
    Number(filters.publish !== undefined);

  const _handleApply = (
    nextFilters: ProductMarketingFilters,
    nextLimit = limit,
  ) => {
    setPage(1);
    setFilters(nextFilters);
    setSearchInput(nextFilters.search);
    setLimit(nextLimit);
  };
  const _handleSearch = (search: string) => {
    _handleApply({ ...filters, search });
  };
  const _handlePageSizeChange = (nextLimit: number) => {
    _handleApply(filters, nextLimit);
  };
  const _handleResetAll = () => {
    setPage(1);
    setFilters(INITIAL_FILTERS);
    setSearchInput("");
    setLimit(DEFAULT_PAGE_SIZE);
    removeStoredValue(SAVED_SEARCH_STORAGE_KEY);
  };
  const _handleSaveSearch = (
    nextFilters: ProductMarketingFilters,
    nextLimit: number,
  ) => {
    setStoredJson(SAVED_SEARCH_STORAGE_KEY, {
      filters: nextFilters,
      limit: nextLimit,
    });
    _handleApply(nextFilters, nextLimit);
    toast.success("Search filters saved.");
  };

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
        searchInput={searchInput}
        pagination={__pagination}
        activeFilterCount={activeFilterCount}
        actions={{
          handleSearch: _handleSearch,
          handleSearchInputChange: setSearchInput,
          handlePageChange: setPage,
          handlePageSizeChange: _handlePageSizeChange,
          handleResetAll: _handleResetAll,
        }}
      />
      <ProductMarketingFilterModal
        filters={filters}
        searchInput={searchInput}
        pageSize={limit}
        actions={{
          handleApply: _handleApply,
          handleSearchInputChange: setSearchInput,
          handleResetAll: _handleResetAll,
          handleSaveSearch: _handleSaveSearch,
        }}
      />
    </>
  );
}

export default ProductMarketingPage;
