import { BsSearch } from "react-icons/bs";

export interface TableControlsProps {
  showPagination?: boolean;
  showSearch?: boolean;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  search: string;
  setSearch: (search: string) => void;
}

export function TableControls({
  showPagination,
  showSearch,
  pageSize,
  setPageSize,
  pageSizeOptions,
  search,
  setSearch,
}: TableControlsProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
      {showPagination && (
        <div className="d-flex align-items-center">
          <span className="me-2 text-muted small">Show</span>
          <select
            className="form-select form-select-sm w-auto"
            style={{ cursor: "pointer" }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="ms-2 text-muted small">entries</span>
        </div>
      )}

      {showSearch && (
        <div className="d-flex align-items-center">
          <div className="input-group input-group-sm">
            <span className="input-group-text border-end-0">
              <BsSearch className="text-muted" />
            </span>
            <input
              type="search"
              className="form-control border-start-0"
              placeholder="Search..."
              value={search}

              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
