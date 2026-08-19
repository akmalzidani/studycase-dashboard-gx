interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <div
      className="table-responsive border rounded mb-3 table-skeleton placeholder-glow"
      aria-busy="true"
      aria-label="Memuat data tabel"
    >
      <table className="table mb-0">
        <thead>
          <tr>
            {Array.from({ length: columnCount }, (_, columnIndex) => {
              const isActionColumn = columnIndex === columnCount - 1;

              return (
                <th
                  key={columnIndex}
                  scope="col"
                  className={
                    isActionColumn ? "table-skeleton__action-column" : undefined
                  }
                >
                  <span
                    className={`placeholder bg-yellow-800 ${
                      isActionColumn
                        ? "table-skeleton__action-header"
                        : "table-skeleton__header"
                    }`}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columnCount }, (_, columnIndex) => {
                const isActionColumn = columnIndex === columnCount - 1;

                return (
                  <td
                    key={columnIndex}
                    className={
                      isActionColumn
                        ? "table-skeleton__action-column"
                        : undefined
                    }
                  >
                    <span
                      className={`placeholder bg-yellow-600 ${
                        isActionColumn
                          ? "table-skeleton__action"
                          : "table-skeleton__cell"
                      }`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
