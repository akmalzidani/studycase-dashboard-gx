import {
  SubscriptionForm,
  type SubscriptionFormValues,
} from "@/components/Forms/SubscriptionForm";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { TableRowSubscription } from "@/components/TableRows/TableRowSubscription";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useTable } from "@/hooks/useTable";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Subscription } from "@/types";

import { initializeTooltips } from "@/helpers/tooltip.helpers";
import { useEffect, useRef } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function SubscriptionPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const {
    __subscriptions,
    __isLoading,
    __isSubmitting,
    __handleCreateSubscription,
    __handleUpdateSubscription,
    __handleDeleteSubscription,
  } = useSubscriptions();

  const _handleFormOpen = () =>
    showOffcanvas(OVERLAY_TARGETS.SUBSCRIPTION_FORM);
  const {
    __selectedItem,
    __handleOpenCreateForm,
    __handleOpenEditForm,
    __handleConfirmDelete,
  } = useCrudFormActions<Subscription>({
    deleteTitle: "Delete subscription package",
    deleteMessage: (subscription) =>
      `Are you sure you want to delete the ${subscription.packageName} package?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: __handleDeleteSubscription,
  });

  const tableFields = [
    {
      key: "packageName",
      getValue: (subscription: Subscription) => subscription.packageName,
      searchable: true,
    },
    {
      key: "speed",
      getValue: (subscription: Subscription) => subscription.speed,
      searchable: true,
    },
    {
      key: "monthlyFee",
      getValue: (subscription: Subscription) => subscription.monthlyFee,
      searchable: true,
    },
  ];
  const {
    __data,
    __search,
    __page,
    __pageSize,
    __totalPages,
    __totalItems,
    __actions: { __handleSearch, __handlePageChange, __handlePageSizeChange },
  } = useTable({ data: __subscriptions, fields: tableFields });

  const _handleSubmit = (values: SubscriptionFormValues) => {
    const payload = {
      packageName: values.packageName.trim(),
      speed: values.speed,
      monthlyFee: values.monthlyFee,
    };

    return __selectedItem?.id
      ? __handleUpdateSubscription(__selectedItem.id, payload)
      : __handleCreateSubscription(payload);
  };

  useEffect(() => initializeTooltips(tableContainerRef.current));

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <div className="w-100" style={{ maxWidth: "320px" }}>
              <TableSearch
                value={__search}
                actions={{ handleChange: __handleSearch }}
              />
            </div>
            {hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.CREATE) ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={__isSubmitting}
                onClick={__handleOpenCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Package
              </button>
            ) : null}
          </div>

          <div ref={tableContainerRef}>
            <Table
              ths={[
                { content: "Package" },
                { content: "Speed" },
                { content: "Monthly fee" },
                { className: "text-end", content: "Actions" },
              ]}
              tds={__data}
              isLoading={__isLoading}
              isWrapHeader
              emptyMessage="There are no subscription packages yet. Add your first package."
            >
              {__data.map((subscription) => (
                <TableRowSubscription
                  key={subscription.id}
                  subscription={subscription}
                  permissions={permissions}
                  isSubmitting={__isSubmitting}
                  actions={{
                    handleEdit: __handleOpenEditForm,
                    handleDelete: __handleConfirmDelete,
                  }}
                />
              ))}
            </Table>
          </div>

          {!__isLoading ? (
            <TablePagination
              page={__page}
              totalPages={__totalPages}
              totalItems={__totalItems}
              pageSize={__pageSize}
              actions={{
                handlePageChange: __handlePageChange,
                handlePageSizeChange: __handlePageSizeChange,
              }}
            />
          ) : null}
        </div>
      </div>

      <SubscriptionForm
        isSubmitting={__isSubmitting}
        item={__selectedItem}
        actions={{ handleSubmit: _handleSubmit }}
      />
    </>
  );
}
