import { confirm } from "@/components/Overlay";
import { useState } from "react";

interface UseCrudFormActionsOptions<T extends { id?: string }> {
  deleteTitle: string;
  deleteMessage: (item: T) => string;
  handleOpenForm: () => void;
  handleDelete: (id: string) => Promise<void>;
}

export function useCrudFormActions<T extends { id?: string }>({
  deleteTitle,
  deleteMessage,
  handleOpenForm,
  handleDelete,
}: UseCrudFormActionsOptions<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const _handleOpenCreateForm = () => {
    setSelectedItem(null);
    handleOpenForm();
  };

  const _handleOpenEditForm = (item: T) => {
    setSelectedItem(item);
    handleOpenForm();
  };

  const _handleConfirmDelete = (item: T) => {
    if (!item.id) return;

    confirm({
      title: deleteTitle,
      message: deleteMessage(item),
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      handleConfirm: () => handleDelete(item.id!),
    });
  };

  return {
    __selectedItem: selectedItem,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  };
}
