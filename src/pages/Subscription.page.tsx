import {
  SubscriptionForm,
  type SubscriptionFormValues,
} from "@/components/Forms/SubscriptionForm";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useTable } from "@/hooks/useTable";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Subscription } from "@/types";
import { formatCurrency, formatSpeed } from "@/helpers/formatters.helpers";

import { BsPencilSquare, BsPlusLg, BsTrash } from "react-icons/bs";

export default function SubscriptionPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const {
    subscriptions,
    isLoading,
    isSubmitting,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.SUBSCRIPTION_FORM);
  const {
    selectedItem: selectedSubscription,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Subscription>({
    deleteTitle: "Delete subscription package",
    deleteMessage: (subscription) =>
      `Are you sure you want to delete the ${subscription.packageName} package?`,
    onOpenForm: handleFormOpen,
    onDelete: deleteSubscription,
  });

  const tableFields = [
    {
      key: "packageName",
      getValue: (subscription: Subscription) => subscription.packageName,
      searchable: true,
      sortable: true,
    },
    {
      key: "speed",
      getValue: (subscription: Subscription) => subscription.speed,
      searchable: true,
      sortable: true,
    },
    {
      key: "monthlyFee",
      getValue: (subscription: Subscription) => subscription.monthlyFee,
      searchable: true,
      sortable: true,
    },
  ];
  const table = useTable({ data: subscriptions, fields: tableFields });

  const handleSubmit = (values: SubscriptionFormValues) => {
    const payload = {
      packageName: values.packageName.trim(),
      speed: values.speed,
      monthlyFee: values.monthlyFee,
    };

    return selectedSubscription?.id
      ? updateSubscription(selectedSubscription.id, payload)
      : createSubscription(payload);
  };

  const tableRows = table.data.map((subscription) => [
    <span className="fw-semibold">{subscription.packageName}</span>,
    formatSpeed(subscription.speed),
    <span className="font-monospace">
      {formatCurrency(subscription.monthlyFee)}
    </span>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${subscription.packageName}`}
              disabled={isSubmitting}
              onClick={() => openEditForm(subscription)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Hapus ${subscription.packageName}`}
              disabled={isSubmitting}
              onClick={() => confirmDelete(subscription)}
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
            <div className="w-100" style={{ maxWidth: "320px" }}>
              <TableSearch value={table.search} onChange={table.setSearch} />
            </div>
            {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.CREATE) ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Package
              </button>
            ) : null}
          </div>

          <Table
            ths={[
              { content: "Package", sortKey: "packageName" },
              { content: "Speed", sortKey: "speed" },
              { content: "Monthly fee", sortKey: "monthlyFee" },
              { className: "text-end", content: "Actions" },
            ]}
            tds={tableRows}
            isLoading={isLoading}
            isWrapHeader
            emptyMessage="There are no subscription packages yet. Add your first package."
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

      <SubscriptionForm
        isSubmitting={isSubmitting}
        item={selectedSubscription}
        onSubmit={handleSubmit}
      />
    </>
  );
}
