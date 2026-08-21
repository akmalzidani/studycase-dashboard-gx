import { confirm } from "@/components/Overlay";
import { useCallback, useState } from "react";

interface UseCrudFormActionsOptions<T extends { id?: string }> {
  deleteTitle: string;
  deleteMessage: (item: T) => string;
  onOpenForm: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function useCrudFormActions<T extends { id?: string }>({
  deleteTitle,
  deleteMessage,
  onOpenForm,
  onDelete,
}: UseCrudFormActionsOptions<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openCreateForm = useCallback(() => {
    setSelectedItem(null);
    onOpenForm();
  }, [onOpenForm]);

  const openEditForm = useCallback(
    (item: T) => {
      setSelectedItem(item);
      onOpenForm();
    },
    [onOpenForm],
  );

  const confirmDelete = useCallback(
    (item: T) => {
      if (!item.id) return;

      confirm({
        title: deleteTitle,
        message: deleteMessage(item),
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "danger",
        onConfirm: () => onDelete(item.id!),
      });
    },
    [deleteMessage, deleteTitle, onDelete],
  );

  return {
    selectedItem,
    openCreateForm,
    openEditForm,
    confirmDelete,
  };
}
