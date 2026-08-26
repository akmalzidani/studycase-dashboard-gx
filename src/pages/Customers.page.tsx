import { ClientDetail } from "@/components/Details/ClientDetail";

import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { TableRowCustomer } from "@/components/TableRows/TableRowCustomer";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import {
  CustomerForm,
  type CustomerFormValues,
} from "@/components/Forms/CustomerForm";

import { showOffcanvas } from "@/helpers/offcanvas.helpers";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useCustomers } from "@/hooks/useCustomers";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useTable } from "@/hooks/useTable";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Customer } from "@/types";
import { Tooltip } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function CustomersPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const [filters, setFilters] = useState({ subscription: "", status: "" });
  const [selectedDetail, setSelectedDetail] = useState<Customer | null>(null);
  const {
    __customers: customers,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateCustomer: _handleCreateCustomer,
    __handleUpdateCustomer: _handleUpdateCustomer,
    __handleDeleteCustomer: _handleDeleteCustomer,
  } = useCustomers();
  const {
    __subscriptions: subscriptions,
    __isLoading: isLoadingSubscriptions,
  } = useSubscriptions();

  const tableFields = [
    {
      key: "id",
      getValue: (customer: Customer) => customer.id,
      searchable: true,
      sortable: true,
    },
    {
      key: "userInformation",
      getValue: (customer: Customer) =>
        `${customer.name} ${customer.email} ${customer.phoneNumber}`,
      searchable: true,
      sortable: true,
    },
    {
      key: "subscription",
      getValue: (customer: Customer) => customer.subscription.packageName,
      searchable: true,
    },
    {
      key: "status",
      getValue: (customer: Customer) => customer.status,
      searchable: true,
    },
  ];
  const tableFilters = [
    (customer: Customer) =>
      !filters.subscription ||
      customer.subscription.id === filters.subscription,
    (customer: Customer) =>
      !filters.status || customer.status === filters.status,
  ];
  const subscriptionOptions = subscriptions.flatMap((subscription) =>
    subscription.id
      ? [{ value: subscription.id, label: subscription.packageName }]
      : [],
  );
  const {
    __data: data,
    __search: search,
    __sortConfig: sortConfig,
    __page: page,
    __pageSize: pageSize,
    __totalPages: totalPages,
    __totalItems: totalItems,
    __actions: {
      __handleSearch: _handleSearch,
      __handleSort: _handleSort,
      __handlePageChange: _handlePageChange,
      __handlePageSizeChange: _handlePageSizeChange,
    },
  } = useTable({
    data: customers,
    fields: tableFields,
    filters: tableFilters,
  });

  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.CUSTOMER_FORM);
  const _handleOpenDetail = (customer: Customer) => {
    setSelectedDetail(customer);
    showOffcanvas(OVERLAY_TARGETS.CUSTOMER_DETAIL);
  };
  const {
    __selectedItem: selectedCustomer,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  } = useCrudFormActions<Customer>({
    deleteTitle: "Delete customer",
    deleteMessage: (customer) =>
      `Are you sure you want to delete ${customer.name}?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: _handleDeleteCustomer,
  });

  const _handleSubmit = async (values: CustomerFormValues) => {
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
      ? _handleUpdateCustomer(selectedCustomer.id, payload)
      : _handleCreateCustomer(payload);
  };

  useEffect(() => {
    const tooltips = Array.from(
      tableContainerRef.current?.querySelectorAll<HTMLElement>(
        '[data-bs-toggle="tooltip"]',
      ) ?? [],
      (element) => Tooltip.getOrCreateInstance(element),
    );

    return () => tooltips.forEach((tooltip) => tooltip.dispose());
  });

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <div className="d-flex flex-column flex-md-row gap-2">
              <div style={{ maxWidth: "320px" }}>
                <TableSearch
                  value={search}
                  actions={{ handleChange: _handleSearch }}
                />
              </div>
              <TableFilter
                fields={[
                  {
                    key: "subscription",
                    label: "Subscription",
                    options: subscriptionOptions,
                    disabled: isLoadingSubscriptions,
                  },
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { value: "Active", label: "Active" },
                      { value: "Blocked", label: "Blocked" },
                    ],
                  },
                ]}
                values={filters}
                actions={{
                  handleChange: (key, value) =>
                    setFilters((current) => ({ ...current, [key]: value })),
                  handleReset: () =>
                    setFilters({ subscription: "", status: "" }),
                }}
              />
            </div>
            {hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.CREATE) ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  isSubmitting ||
                  isLoadingSubscriptions ||
                  subscriptions.length === 0
                }
                onClick={_handleOpenCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Customer
              </button>
            ) : null}
          </div>

          <div ref={tableContainerRef}>
            <Table
              ths={[
                { content: "ID", sortKey: "id" },
                { content: "User Information", sortKey: "userInformation" },
                "Subscription",
                "Status",
                { className: "text-end", content: "Actions" },
              ]}
              tds={data}
              isLoading={isLoading}
              isWrapHeader
              emptyMessage="There are no customers yet. Add your first customer."
              sortConfig={sortConfig}
              actions={{ handleSort: _handleSort }}
            >
              {data.map((customer) => (
                <TableRowCustomer
                  key={customer.id}
                  customer={customer}
                  permissions={permissions}
                  isSubmitting={isSubmitting}
                  actions={{
                    handleView: _handleOpenDetail,
                    handleEdit: _handleOpenEditForm,
                    handleDelete: _handleConfirmDelete,
                  }}
                />
              ))}
            </Table>
          </div>

          {!isLoading ? (
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              actions={{
                handlePageChange: _handlePageChange,
                handlePageSizeChange: _handlePageSizeChange,
              }}
            />
          ) : null}
        </div>
      </div>

      <ClientDetail item={selectedDetail} type="customer" />

      <CustomerForm
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedCustomer}
        subscriptions={subscriptions}
        actions={{ handleSubmit: _handleSubmit }}
      />
    </>
  );
}
