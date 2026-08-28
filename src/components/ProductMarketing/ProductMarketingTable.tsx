import { TableRowProductMarketing } from "@/components/TableRows/TableRowProductMarketing";
import { Table } from "@/components/common/Table";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showModal } from "@/helpers/modal.helpers";
import type { ApiPagination } from "@/types/common.types";
import type { ProductMarketing } from "@/types/product-marketing.types";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { BsFunnel } from "react-icons/bs";

interface ProductMarketingTableProps {
  products: ProductMarketing[];
  isLoading: boolean;
  search: string;
  pagination: ApiPagination | null;
  activeFilterCount: number;
  actions: {
    handleSearch: (search: string) => void;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
    handleResetAll: () => void;
  };
}

export function ProductMarketingTable({
  products,
  isLoading,
  search,
  pagination,
  activeFilterCount,
  actions,
}: ProductMarketingTableProps) {
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    actions.handleSearch(searchInput.trim());
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-center mb-3 gap-3">
          <form className="d-flex gap-2" onSubmit={handleSearch}>
            <div style={{ maxWidth: "320px" }}>
              <TableSearch
                value={searchInput}
                placeholder="Search products..."
                actions={{ handleChange: setSearchInput }}
              />
            </div>
            <button type="submit" className="btn btn-sm btn-primary">
              Search
            </button>
          </form>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary position-relative ${
                activeFilterCount ? "active" : ""
              }`}
              aria-label="Filter product marketing"
              onClick={() =>
                showModal(OVERLAY_TARGETS.PRODUCT_MARKETING_FILTER)
              }
            >
              <BsFunnel aria-hidden="true" />
              {activeFilterCount ? (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-light">
                  {activeFilterCount}
                  <span className="visually-hidden"> active filters</span>
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link"
              disabled={!search && activeFilterCount === 0}
              onClick={() => {
                setSearchInput("");
                actions.handleResetAll();
              }}
            >
              Reset all
            </button>
          </div>
        </div>

        <Table
          ths={[
            "Product Information",
            "Billing & Network",
            "Pricing",
            "Branches",
            "Status",
            "Created by",
          ]}
          tds={products}
          isLoading={isLoading}
          isWrapHeader
          emptyMessage="No product marketing data is available."
        >
          {products.map((product) => (
            <TableRowProductMarketing key={product.id} product={product} />
          ))}
        </Table>

        {!isLoading && pagination ? (
          <TablePagination
            page={pagination.currentPage}
            pageSize={pagination.perPage}
            totalPages={pagination.totalPage}
            totalItems={pagination.total}
            actions={{
              handlePageChange: actions.handlePageChange,
              handlePageSizeChange: actions.handlePageSizeChange,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
