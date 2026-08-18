import {
  customerTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";
import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import {
  CustomerFormModal,
  type CustomerFormValues,
} from "@/components/CustomerFormModal";
import { MODAL_TARGETS } from "@/config/modal.config";

import { useConfirm } from "@/hooks/useConfirm";
import { useCustomers } from "@/hooks/useCustomers";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { Customer } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function CustomersPage() {
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
  const confirm = useConfirm();
  const customerFormModal = useModal(MODAL_TARGETS.CUSTOMER_FORM);
  const {
    selectedItem: selectedCustomer,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Customer>({
    confirm,
    deleteTitle: "Hapus customer",
    deleteMessage: (customer) =>
      `Apakah Anda yakin ingin menghapus ${customer.name}?`,
    modal: customerFormModal,
    onDelete: deleteCustomer,
  });

  const table = useDataTable({
    data: customers,
    initialSortKey: "name",
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
        getLabel: (customer: Customer) => customer.name,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm],
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold">Customers</h1>
          <p className="text-muted mb-0">Manajemen data pelanggan aktif.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
            onClick={() => resetCustomers()}
          >
            <BsArrowClockwise className="me-2" />
            Reset Data
          </button>
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
        </div>
      </div>

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
