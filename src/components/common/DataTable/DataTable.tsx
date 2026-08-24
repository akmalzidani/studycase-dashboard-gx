import { type ReactNode } from "react";
import type { UseDataTableReturn } from "@/hooks/useDataTable";
import { CoreTable } from "./CoreTable";
import { Pagination } from "./Pagination";
import { TableControls } from "./TableControls";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { RowActions } from "./RowActions";
import type { Column, RowActionsConfig } from "./types";

export interface DataTableProps<T> extends UseDataTableReturn<T> {
  columns: Column<T>[];
  rowActions?: RowActionsConfig<T>;
  keyExtractor: (item: T) => string | number;
  tableClassName?: string;
  containerClassName?: string;
  pageSizeOptions?: number[];
  showSearch?: boolean;
  showPagination?: boolean;
  emptyMessage?: ReactNode;
  isLoading?: boolean;
  actions?: ReactNode;
}

export function DataTable<T extends object>({
  data,
  columns,
  rowActions,
  keyExtractor,
  search,
  setSearch,
  isSearching,
  sortConfig,
  handleSort,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  totalItems,
  tableClassName,
  containerClassName = "card",
  pageSizeOptions = [5, 10, 25, 50, 100],
  showSearch = true,
  showPagination = true,
  emptyMessage,
  isLoading = false,
  actions,
}: DataTableProps<T>) {
  const hasRowActions = Boolean(
    rowActions &&
    (rowActions.detail ||
      rowActions.edit ||
      rowActions.delete ||
      rowActions.children),
  );
  const tableColumns = hasRowActions
    ? [
        ...columns,
        {
          key: "actions",
          header: "Actions",
          className: "text-end",
          headerClassName: "text-end",
          render: (item: T) => <RowActions item={item} actions={rowActions!} />,
        },
      ]
    : columns;

  return (
    <div className={containerClassName}>
      <div className="card-body">
        <TableControls
          showSearch={showSearch}
          search={search}
          setSearch={setSearch}
          actions={actions}
        />

        {isLoading || isSearching ? (
          <DataTableSkeleton
            columnCount={tableColumns.length}
            rowCount={pageSize}
          />
        ) : (
          <CoreTable
            data={data}
            columns={tableColumns}
            keyExtractor={keyExtractor}
            sortConfig={sortConfig}
            handleSort={handleSort}
            tableClassName={tableClassName}
            emptyMessage={emptyMessage}
          />
        )}

        {showPagination && !isLoading && !isSearching ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            totalItems={totalItems}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageSizeOptions={pageSizeOptions}
          />
        ) : null}
      </div>
    </div>
  );
}
