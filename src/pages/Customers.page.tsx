import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import {
  CustomerFormModal,
  type CustomerFormValues,
} from "@/components/CustomerFormModal";
import {
  customerTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useCustomers } from "@/hooks/useCustomers";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Customer } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function CustomersPage() {
  const permissions = useAuthStore((state) => state.permissions);
  const {
    customers,
    isLoading,
    isSubmitting,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    resetCustomers,
  } = useCustomers();
  const { subscriptions, isLoading: isLoadingSubscriptions } =
    useSubscriptions();

  const customerFormModal = useModal(MODAL_TARGETS.CUSTOMER_FORM);
  const {
    selectedItem: selectedCustomer,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Customer>({
    deleteTitle: "Hapus customer",
    deleteMessage: (customer) =>
      `Apakah Anda yakin ingin menghapus ${customer.name}?`,
    modal: customerFormModal,
    onDelete: deleteCustomer,
  });

  const table = useDataTable({
    data: customers,
    searchPredicate: searchClientTableItem,
  });

  const handleSubmit = useCallback(
    async (values: CustomerFormValues) => {
      const subscription = subscriptions.find(
        (item) => item.id === values.subscriptionId,
      );
      if (!subscription) return false;

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        subscription,
        status: values.status,
      };

      return selectedCustomer?.id
        ? updateCustomer(selectedCustomer.id, payload)
        : createCustomer(payload);
    },
    [createCustomer, selectedCustomer, subscriptions, updateCustomer],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        canEdit: hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.UPDATE),
        canDelete: hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.DELETE),
        getLabel: (customer: Customer) => customer.name,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm, permissions],
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manajemen data pelanggan aktif."
        actions={[
          {
            id: "reset",
            permission: PERMISSION_KEYS.CUSTOMERS.UPDATE,
            content: (
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
                onClick={() => resetCustomers()}
              >
                <BsArrowClockwise className="me-2" />
                Reset Data
              </button>
            ),
          },
          {
            id: "create",
            permission: PERMISSION_KEYS.CUSTOMERS.CREATE,
            content: (
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  isSubmitting ||
                  isLoadingSubscriptions ||
                  subscriptions.length === 0
                }
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Tambah Customer
              </button>
            ),
          },
        ]}
      />

      <DataTable<Customer>
        {...table}
        columns={customerTableColumns}
        rowActions={rowActions}
        keyExtractor={(customer) => customer.id ?? customer.email}
        emptyMessage="Belum ada customer. Tambahkan customer pertama Anda."
        isLoading={isLoading}
      />

      <CustomerFormModal
        isOpen={customerFormModal.isOpen}
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedCustomer}
        subscriptions={subscriptions}
        onClose={customerFormModal.close}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
