import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

export interface TableField<T> {
  key: string;
  getValue: (item: T) => string | number | null | undefined;
  searchable?: boolean;
  sortable?: boolean;
}

interface UseTableOptions<T> {
  data: T[];
  fields: TableField<T>[];
  filters?: Array<(item: T) => boolean>;
  initialPageSize?: number;
}

export interface UseTableReturn<T> {
  data: T[];
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  totalItems: number;
  sortConfig: { key: string | null; direction: "asc" | "desc" };
  handleSort: (key: string) => void;
}

export function useTable<T>({
  data,
  fields,
  filters = [],
  initialPageSize = 10,
}: UseTableOptions<T>): UseTableReturn<T> {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const debouncedSearch = useDebounce(search);

  const searchableFields = useMemo(
    () => fields.filter((field) => field.searchable),
    [fields],
  );
  const sortableFields = useMemo(
    () =>
      new Map(
        fields
          .filter((field) => field.sortable)
          .map((field) => [field.key, field]),
      ),
    [fields],
  );

  const filteredData = useMemo(() => {
    const dataAfterFilters = filters.length
      ? data.filter((item) => filters.every((filter) => filter(item)))
      : data;
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return dataAfterFilters;

    return dataAfterFilters.filter((item) =>
      searchableFields.some((field) =>
        String(field.getValue(item) ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [data, debouncedSearch, filters, searchableFields]);

  const sortedData = useMemo(() => {
    const field = sortConfig.key
      ? sortableFields.get(sortConfig.key)
      : undefined;
    if (!field) return filteredData;

    return [...filteredData].sort((left, right) => {
      const leftValue = field.getValue(left);
      const rightValue = field.getValue(right);
      const direction = sortConfig.direction === "asc" ? 1 : -1;

      if (leftValue == null) return direction;
      if (rightValue == null) return -direction;

      return (
        String(leftValue).localeCompare(String(rightValue), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * direction
      );
    });
  }, [filteredData, sortConfig, sortableFields]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [page, pageSize, sortedData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const handleSort = (key: string) => {
    if (!sortableFields.has(key)) return;

    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return {
    data: paginatedData,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems: sortedData.length,
    sortConfig,
    handleSort,
  };
}
