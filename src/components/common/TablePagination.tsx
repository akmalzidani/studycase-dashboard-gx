interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  actions: {
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
  };
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
  actions,
}: TablePaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div className="d-flex align-items-center gap-2 text-muted small mb-2 mb-md-0">
        <label className="d-flex align-items-center gap-2">
          <span>Show</span>
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(event) =>
              actions.handlePageSizeChange(Number(event.target.value))
            }
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
            {hasPreviousPage ? (
              <>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => actions.handlePageChange(1)}
                    aria-label="Go to first page"
                  >
                    First
                  </button>
                </li>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => actions.handlePageChange(page - 1)}
                  >
                    Prev
                  </button>
                </li>
              </>
            ) : null}

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
                    onClick={() => actions.handlePageChange(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                </li>
              ),
            )}

            {hasNextPage ? (
              <>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => actions.handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </li>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => actions.handlePageChange(totalPages)}
                    aria-label="Go to last page"
                  >
                    Last
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </nav>
      </div>
    </div>
  );
}
