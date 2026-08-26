import type { ReactNode } from "react";

export interface RowAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel?: (item: T) => string;
  handleClick: (item: T) => void;
}

export interface DefaultRowAction<T> {
  disabled?: boolean;
  ariaLabel?: (item: T) => string;
  handleClick: (item: T) => void;
}

export interface RowActionsConfig<T> {
  detail?: DefaultRowAction<T>;
  edit?: DefaultRowAction<T>;
  delete?: DefaultRowAction<T>;
  children?: ReactNode | ((item: T) => ReactNode);
}

export interface Column<T> {
  key: Extract<keyof T, string> | string;
  header: ReactNode;
  render?: (item: T) => ReactNode;
  sortKey?: keyof T;
  className?: string;
  headerClassName?: string;
}
