import type { RowActionsConfig } from "./types";

interface CreateCrudRowActionsOptions<T> {
  disabled?: boolean;
  getLabel: (item: T) => string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export function createCrudRowActions<T>({
  disabled = false,
  getLabel,
  onEdit,
  onDelete,
}: CreateCrudRowActionsOptions<T>): RowActionsConfig<T> {
  return {
    edit: {
      disabled,
      ariaLabel: (item) => `Edit ${getLabel(item)}`,
      onClick: onEdit,
    },
    delete: {
      disabled,
      ariaLabel: (item) => `Hapus ${getLabel(item)}`,
      onClick: onDelete,
    },
  };
}
