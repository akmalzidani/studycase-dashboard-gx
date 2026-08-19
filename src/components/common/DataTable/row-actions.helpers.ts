import type { RowActionsConfig } from "./types";

interface CreateCrudRowActionsOptions<T> {
  disabled?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  getLabel: (item: T) => string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export function createCrudRowActions<T>({
  disabled = false,
  canEdit = true,
  canDelete = true,
  getLabel,
  onEdit,
  onDelete,
}: CreateCrudRowActionsOptions<T>): RowActionsConfig<T> {
  return {
    edit: canEdit
      ? {
          disabled,
          ariaLabel: (item) => `Edit ${getLabel(item)}`,
          onClick: onEdit,
        }
      : undefined,
    delete: canDelete
      ? {
          disabled,
          ariaLabel: (item) => `Hapus ${getLabel(item)}`,
          onClick: onDelete,
        }
      : undefined,
  };
}
