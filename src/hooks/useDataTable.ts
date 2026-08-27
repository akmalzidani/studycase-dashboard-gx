import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

export interface UseDataTableOptions<T> {
  data: T[];
  initialSortKey?: keyof T;
  initialSortDirection?: "asc" | "desc";
  initialPageSize?: number;
  searchPredicate?: (item: T, keyword: string) => boolean;
}

export interface UseDataTableReturn<T> {
  __data: T[];
  __search: string;
  __isSearching: boolean;
  __sortConfig: { key: keyof T | null; direction: "asc" | "desc" };
  __page: number;
  __pageSize: number;
  __totalPages: number;
  __totalItems: number;
  __actions: {
    __handleSearch: (value: string) => void;
    __handleSort: (key: keyof T) => void;
    __handlePageChange: (page: number) => void;
    __handlePageSizeChange: (size: number) => void;
  };
}

export function useDataTable<T extends object>({
  data,
  initialSortKey,
  initialSortDirection = "asc",
  initialPageSize = 10,
  searchPredicate,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const isSearching = search !== debouncedSearch;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({
    key: initialSortKey || null,
    direction: initialSortDirection,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const keyword = debouncedSearch.toLowerCase();
  const filteredData = !debouncedSearch
    ? data
    : searchPredicate
      ? data.filter((item) => searchPredicate(item, keyword))
      : data.filter((item) =>
          Object.values(item as Record<string, unknown>).some(
            (value) =>
              value != null && String(value).toLowerCase().includes(keyword),
          ),
        );

  const sortedData = [...filteredData];
  if (sortConfig.key !== null) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key!] as string | number;
      const bVal = b[sortConfig.key!] as string | number;

      if (aVal == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (bVal == null) return sortConfig.direction === "asc" ? -1 : 1;

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const _handleSearch = (value: string) => setSearch(value);
  const _handlePageChange = (nextPage: number) => setPage(nextPage);
  const _handlePageSizeChange = (size: number) => setPageSize(size);

  const _handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  return {
    __data: paginatedData,
    __search: search,
    __isSearching: isSearching,
    __sortConfig: sortConfig,
    __page: page,
    __pageSize: pageSize,
    __totalPages: totalPages,
    __totalItems: sortedData.length,
    __actions: {
      __handleSearch: _handleSearch,
      __handleSort: _handleSort,
      __handlePageChange: _handlePageChange,
      __handlePageSizeChange: _handlePageSizeChange,
    },
  };
}
