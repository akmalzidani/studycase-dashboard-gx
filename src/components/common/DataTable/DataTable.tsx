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
  controls?: ReactNode;
}

export function DataTable<T extends object>({
  __data: data,
  columns,
  rowActions,
  keyExtractor,
  __search: search,
  __isSearching: isSearching,
  __sortConfig: sortConfig,
  __page: page,
  __pageSize: pageSize,
  __actions: {
    __handleSearch: _handleSearch,
    __handleSort: _handleSort,
    __handlePageChange: _handlePageChange,
    __handlePageSizeChange: _handlePageSizeChange,
  },
  __totalPages: totalPages,
  __totalItems: totalItems,
  tableClassName,
  containerClassName = "card",
  pageSizeOptions = [5, 10, 25, 50, 100],
  showSearch = true,
  showPagination = true,
  emptyMessage,
  isLoading = false,
  controls,
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
          actions={{ handleSearch: _handleSearch }}
          children={controls}
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
            actions={{ handleSort: _handleSort }}
            tableClassName={tableClassName}
            emptyMessage={emptyMessage}
          />
        )}

        {showPagination && !isLoading && !isSearching ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            actions={{
              handlePageChange: _handlePageChange,
              handlePageSizeChange: _handlePageSizeChange,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
