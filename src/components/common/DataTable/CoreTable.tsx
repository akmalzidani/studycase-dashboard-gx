import type { ReactNode } from "react";
import type { Column } from "./types";
import { BsCaretUpFill, BsCaretDownFill, BsInbox } from "react-icons/bs";

export interface CoreTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  sortConfig: { key: keyof T | null; direction: "asc" | "desc" };
  handleSort: (key: keyof T) => void;
  tableClassName?: string;
  emptyMessage?: ReactNode;
}

export function CoreTable<T extends object>({
  data,
  columns,
  keyExtractor,
  sortConfig,
  handleSort,
  tableClassName = "table table-hover table-striped mb-0",
  emptyMessage = "Tidak ada data",
}: CoreTableProps<T>) {
  return (
    <div className="table-responsive-lg border rounded mb-3">
      <table className={tableClassName}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = !!col.sortKey;
              const isSorted = sortConfig.key === col.sortKey;
              const isAsc = sortConfig.direction === "asc";

              return (
                <th
                  key={col.key}
                  className={`position-sticky py-3 ${col.headerClassName || ""} border-end ${isSortable ? "user-select-none" : ""}`}
                  onClick={() =>
                    isSortable && col.sortKey && handleSort(col.sortKey)
                  }
                  style={{
                    cursor: isSortable ? "pointer" : "default",
                    top: "var(--app-header-height)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isSortable ? (
                    <div className="position-relative">
                      <span
                        className={
                          col.headerClassName?.includes("text-end")
                            ? "pe-3"
                            : undefined
                        }
                      >
                        {col.header}
                      </span>
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y d-flex flex-column"
                        style={{ fontSize: "0.65rem", lineHeight: "0.6" }}
                      >
                        <BsCaretUpFill
                          className={
                            isSorted && isAsc
                              ? "text-primary"
                              : "text-muted opacity-25"
                          }
                        />
                        <BsCaretDownFill
                          className={
                            isSorted && !isAsc
                              ? "text-primary"
                              : "text-muted opacity-25"
                          }
                        />
                      </span>
                    </div>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={keyExtractor(item)}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-5 text-muted"
              >
                <div className="d-flex flex-column align-items-center">
                  <BsInbox className="fs-1 mb-2 opacity-50" />
                  <p className="mb-0">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
