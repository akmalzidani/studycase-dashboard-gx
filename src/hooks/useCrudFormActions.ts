import { useCallback, useState } from "react";

type Confirm = (options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning" | "success";
  onConfirm: () => void;
}) => void;

interface UseCrudFormActionsOptions<T extends { id?: string }> {
  confirm: Confirm;
  deleteTitle: string;
  deleteMessage: (item: T) => string;
  modal: {
    open: () => void;
  };
  onDelete: (id: string) => Promise<void>;
}

export function useCrudFormActions<T extends { id?: string }>({
  confirm,
  deleteTitle,
  deleteMessage,
  modal,
  onDelete,
}: UseCrudFormActionsOptions<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openCreateForm = useCallback(() => {
    setSelectedItem(null);
    modal.open();
  }, [modal]);

  const openEditForm = useCallback(
    (item: T) => {
      setSelectedItem(item);
      modal.open();
    },
    [modal],
  );

  const confirmDelete = useCallback(
    (item: T) => {
      if (!item.id) return;

      confirm({
        title: deleteTitle,
        message: deleteMessage(item),
        confirmText: "Hapus",
        cancelText: "Batal",
        variant: "danger",
        onConfirm: () => onDelete(item.id!),
      });
    },
    [confirm, deleteMessage, deleteTitle, onDelete],
  );

  return {
    selectedItem,
    openCreateForm,
    openEditForm,
    confirmDelete,
  };
}
