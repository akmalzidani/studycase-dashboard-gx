interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];

  for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
    if (
      currentPage === 1 ||
      currentPage === totalPages ||
      (currentPage >= page - 1 && currentPage <= page + 1)
    ) {
      pages.push(currentPage);
    } else if (currentPage === page - 2 || currentPage === page + 2) {
      pages.push("...");
    }
  }

  return pages;
}

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div className="d-flex align-items-center gap-2 text-muted small mb-2 mb-md-0">
        <label className="d-flex align-items-center gap-2">
          <span>Show</span>
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            aria-label="Entries per page"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small">
          Showing {firstItem} to {lastItem} of {totalItems} entries
        </span>
        <nav aria-label="Page navigation">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                type="button"
                className="page-link"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </button>
            </li>

            {getPageNumbers(page, totalPages).map((pageNumber, index) =>
              pageNumber === "..." ? (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ) : (
                <li
                  key={pageNumber}
                  className={`page-item ${page === pageNumber ? "active" : ""}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => onPageChange(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                </li>
              ),
            )}

            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                type="button"
                className="page-link"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
