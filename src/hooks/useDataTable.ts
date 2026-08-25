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
  data: T[];
  search: string;
  isSearching: boolean;
  sortConfig: { key: keyof T | null; direction: "asc" | "desc" };
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  actions: {
    handleSearch: (value: string) => void;
    handleSort: (key: keyof T) => void;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;
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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

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

  const _handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  return {
    data: paginatedData,
    search,
    isSearching,
    sortConfig,
    page,
    pageSize,
    totalPages,
    totalItems: sortedData.length,
    actions: {
      handleSearch: setSearch,
      handleSort: _handleSort,
      handlePageChange: setPage,
      handlePageSizeChange: setPageSize,
    },
  };
}
