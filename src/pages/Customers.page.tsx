import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import {
  CustomerForm,
  type CustomerFormValues,
} from "@/components/Forms/CustomerForm";
import {
  customerTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useCustomers } from "@/hooks/useCustomers";
import { useDataTable } from "@/hooks/useDataTable";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Customer } from "@/types";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function CustomersPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const {
    customers,
    isLoading,
    isSubmitting,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();
  const { subscriptions, isLoading: isLoadingSubscriptions } =
    useSubscriptions();

  const handleFormOpen = useCallback(
    () => showOffcanvas(OVERLAY_TARGETS.CUSTOMER_FORM),
    [],
  );
  const {
    selectedItem: selectedCustomer,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Customer>({
    deleteTitle: "Delete customer",
    deleteMessage: (customer) =>
      `Are you sure you want to delete ${customer.name}?`,
    onOpenForm: handleFormOpen,
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
    <>
      <DataTable<Customer>
        {...table}
        columns={customerTableColumns}
        rowActions={rowActions}
        keyExtractor={(customer) => customer.id ?? customer.email}
        emptyMessage="There are no customers yet. Add your first customer."
        isLoading={isLoading}
        actions={
          hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.CREATE) && (
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
              Add Customer
            </button>
          )
        }
      />

      <CustomerForm
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedCustomer}
        subscriptions={subscriptions}
        onSubmit={handleSubmit}
      />
    </>
  );
}
