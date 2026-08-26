import type { RowActionsConfig } from "./types";

interface CreateCrudRowActionsOptions<T> {
  disabled?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  getLabel: (item: T) => string;
  handleEdit: (item: T) => void;
  handleDelete: (item: T) => void;
}

export function createCrudRowActions<T>({
  disabled = false,
  canEdit = true,
  canDelete = true,
  getLabel,
  handleEdit,
  handleDelete,
}: CreateCrudRowActionsOptions<T>): RowActionsConfig<T> {
  return {
    edit: canEdit
      ? {
          disabled,
          ariaLabel: (item) => `Edit ${getLabel(item)}`,
          handleClick: handleEdit,
        }
      : undefined,
    delete: canDelete
      ? {
          disabled,
          ariaLabel: (item) => `Hapus ${getLabel(item)}`,
          handleClick: handleDelete,
        }
      : undefined,
  };
}
