import { ClientDetail } from "@/components/Details/ClientDetail";
import { Badge } from "@/components/common/Badge";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import {
  CustomerForm,
  type CustomerFormValues,
} from "@/components/Forms/CustomerForm";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useCustomers } from "@/hooks/useCustomers";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useTable } from "@/hooks/useTable";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Customer } from "@/types";
import { useState } from "react";
import {
  BsEnvelope,
  BsEye,
  BsPencilSquare,
  BsPlusLg,
  BsWhatsapp,
  BsTrash,
} from "react-icons/bs";

export default function CustomersPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const [filters, setFilters] = useState({ subscription: "", status: "" });
  const [selectedDetail, setSelectedDetail] = useState<Customer | null>(null);
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
  const table = useTable({
    data: customers,
    fields: tableFields,
    filters: tableFilters,
  });

  const handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.CUSTOMER_FORM);
  const openDetail = (customer: Customer) => {
    setSelectedDetail(customer);
    showOffcanvas(OVERLAY_TARGETS.CUSTOMER_DETAIL);
  };
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

  const handleSubmit = async (values: CustomerFormValues) => {
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
  };

  const tableRows = table.data.map((customer: Customer) => [
    customer.id ?? "-",
    <div className="d-grid gap-1">
      <span className="fw-semibold">{customer.name}</span>
      <a
        className="d-flex align-items-center gap-2 small text-decoration-none"
        href={`mailto:${customer.email}`}
      >
        <BsEnvelope aria-hidden="true" />
        {customer.email}
      </a>
      <a
        className="d-flex align-items-center gap-2 small text-decoration-none"
        href={getWhatsAppUrl(customer.phoneNumber)}
        target="_blank"
        rel="noreferrer"
      >
        <BsWhatsapp aria-hidden="true" />
        {customer.phoneNumber}
      </a>
    </div>,
    <div>
      <div className="fw-medium">{customer.subscription.packageName}</div>
      <small className="text-muted">
        {formatSpeed(customer.subscription.speed)}
      </small>
    </div>,
    <Badge variant={customer.status === "Active" ? "success" : "danger"}>
      {customer.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm border-0 bg-transparent p-0 text-body-secondary"
            aria-label={`View ${customer.name} details`}
            onClick={() => openDetail(customer)}
          >
            <BsEye />
          </button>
          {hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${customer.name}`}
              disabled={isSubmitting}
              onClick={() => openEditForm(customer)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.CUSTOMERS.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Delete ${customer.name}`}
              disabled={isSubmitting}
              onClick={() => confirmDelete(customer)}
            >
              <BsTrash />
            </button>
          ) : null}
        </div>
      ),
    },
  ]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <div className="d-flex flex-column flex-md-row gap-2">
              <div style={{ maxWidth: "320px" }}>
                <TableSearch value={table.search} onChange={table.setSearch} />
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
                onChange={(key, value) =>
                  setFilters((current) => ({ ...current, [key]: value }))
                }
                onReset={() => setFilters({ subscription: "", status: "" })}
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
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Customer
              </button>
            ) : null}
          </div>

          <Table
            ths={[
              { content: "ID", sortKey: "id" },
              { content: "User Information", sortKey: "userInformation" },
              "Subscription",
              "Status",
              { className: "text-end", content: "Actions" },
            ]}
            tds={tableRows}
            isLoading={isLoading}
            isWrapHeader
            emptyMessage="There are no customers yet. Add your first customer."
            sortConfig={table.sortConfig}
            onSort={table.handleSort}
          />

          {!isLoading ? (
            <TablePagination
              page={table.page}
              totalPages={table.totalPages}
              totalItems={table.totalItems}
              pageSize={table.pageSize}
              onPageChange={table.setPage}
              onPageSizeChange={table.setPageSize}
            />
          ) : null}
        </div>
      </div>

      <ClientDetail item={selectedDetail} type="customer" />

      <CustomerForm
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedCustomer}
        subscriptions={subscriptions}
        onSubmit={handleSubmit}
      />
    </>
  );
}
