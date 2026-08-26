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

import { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";
import { BsPencilSquare, BsPlusLg, BsTrash } from "react-icons/bs";

export default function SubscriptionPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const {
    __subscriptions: subscriptions,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateSubscription: _handleCreateSubscription,
    __handleUpdateSubscription: _handleUpdateSubscription,
    __handleDeleteSubscription: _handleDeleteSubscription,
  } = useSubscriptions();

  const _handleFormOpen = () =>
    showOffcanvas(OVERLAY_TARGETS.SUBSCRIPTION_FORM);
  const {
    __selectedItem: selectedSubscription,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  } = useCrudFormActions<Subscription>({
    deleteTitle: "Delete subscription package",
    deleteMessage: (subscription) =>
      `Are you sure you want to delete the ${subscription.packageName} package?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: _handleDeleteSubscription,
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
  } = useTable({ data: subscriptions, fields: tableFields });

  const _handleSubmit = (values: SubscriptionFormValues) => {
    const payload = {
      packageName: values.packageName.trim(),
      speed: values.speed,
      monthlyFee: values.monthlyFee,
    };

    return selectedSubscription?.id
      ? _handleUpdateSubscription(selectedSubscription.id, payload)
      : _handleCreateSubscription(payload);
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

  const tableRows = data.map((subscription) => [
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
              data-bs-title={`Edit ${subscription.packageName}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => _handleOpenEditForm(subscription)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Hapus ${subscription.packageName}`}
              data-bs-title={`Hapus ${subscription.packageName}`}
              data-bs-toggle="tooltip"
              disabled={isSubmitting}
              onClick={() => _handleConfirmDelete(subscription)}
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
              <TableSearch
                value={search}
                actions={{ handleChange: _handleSearch }}
              />
            </div>
            {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.CREATE) ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={_handleOpenCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Package
              </button>
            ) : null}
          </div>

          <div ref={tableContainerRef}>
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
              sortConfig={sortConfig}
              actions={{ handleSort: _handleSort }}
            />
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

      <SubscriptionForm
        isSubmitting={isSubmitting}
        item={selectedSubscription}
        actions={{ handleSubmit: _handleSubmit }}
      />
    </>
  );
}
