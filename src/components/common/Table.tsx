import type { ReactNode } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { Spinner } from "./Spinner";

export interface TableCell {
  className?: string;
  content: ReactNode;
  sortKey?: string;
}

export type TableValue = ReactNode | TableCell;

export interface TableProps {
  ths: TableValue[];
  tds: TableValue[][];
  className?: string;
  emptyMessage?: ReactNode;
  isLoading?: boolean;
  isWrapHeader?: boolean;
  sortConfig?: { key: string | null; direction: "asc" | "desc" };
  onSort?: (key: string) => void;
  children?: ReactNode;
}

function isTableCell(value: TableValue): value is TableCell {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "content" in value
  );
}

function getCellValue(value: TableValue) {
  return isTableCell(value)
    ? { className: value.className, content: value.content }
    : { className: undefined, content: value };
}

export function Table({
  ths,
  tds,
  className = "table table-hover table-striped mb-0",
  emptyMessage = "Tidak ada data",
  isLoading = false,
  isWrapHeader = false,
  sortConfig,
  onSort,
  children,
}: TableProps) {
  return (
    <div className="table-responsive-lg border rounded mb-3">
      {children}
      <table className={className}>
        <thead>
          <tr>
            {ths.map((th, index) => {
              const { className: cellClassName, content } = getCellValue(th);
              const sortKey = isTableCell(th) ? th.sortKey : undefined;
              const isSortable = Boolean(sortKey && onSort);
              const isSorted = sortConfig?.key === sortKey;

              return (
                <th
                  key={index}
                  scope="col"
                  className={`position-sticky z-1 ${cellClassName ?? ""} ${isSortable ? "user-select-none" : ""}`.trim()}
                  style={{
                    top: "var(--app-header-height)",
                    cursor: isSortable ? "pointer" : undefined,
                    whiteSpace: isWrapHeader ? "normal" : "nowrap",
                  }}
                  onClick={() => sortKey && onSort?.(sortKey)}
                >
                  {isSortable ? (
                    <span className="d-inline-flex align-items-center gap-2">
                      {content}
                      <span
                        className="d-flex flex-column"
                        style={{ fontSize: "0.65rem", lineHeight: "0.6" }}
                      >
                        <BsCaretUpFill
                          className={
                            isSorted && sortConfig?.direction === "asc"
                              ? "text-primary"
                              : "text-muted"
                          }
                        />
                        <BsCaretDownFill
                          className={
                            isSorted && sortConfig?.direction === "desc"
                              ? "text-primary"
                              : "text-muted"
                          }
                        />
                      </span>
                    </span>
                  ) : (
                    content
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={ths.length} className="py-5 text-center">
                <Spinner
                  size="sm"
                  className="text-primary"
                  label="Loading..."
                />
              </td>
            </tr>
          ) : tds.length > 0 ? (
            tds.map((td, rowIndex) => (
              <tr key={rowIndex}>
                {td.map((cell, cellIndex) => {
                  const { className: cellClassName, content } =
                    getCellValue(cell);

                  return (
                    <td key={cellIndex} className={cellClassName}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={ths.length} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
