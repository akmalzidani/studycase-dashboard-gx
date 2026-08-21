export interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function Pagination({
  page,
  totalPages,
  setPage,
  totalItems,
  pageSize,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (i === page - 2 || i === page + 2) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div className="text-muted small mb-2 mb-md-0">
        Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
        {Math.min(page * pageSize, totalItems)} of {totalItems} entries
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>

          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              );
            }

            return (
              <li
                key={pageNum}
                className={`page-item ${page === pageNum ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(pageNum as number)}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
