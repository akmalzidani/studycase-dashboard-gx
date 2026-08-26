import { ClientDetail } from "@/components/Details/ClientDetail";

import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { TableRowProspect } from "@/components/TableRows/TableRowProspect";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import {
  ProspectForm,
  type ProspectFormValues,
} from "@/components/Forms/ProspectForm";

import { PERMISSION_KEYS } from "@/config/permission.config";
import { hasPermission } from "@/config/permission.helpers";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useTable } from "@/hooks/useTable";

import { useProspects } from "@/hooks/useProspects";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Prospect } from "@/types";

import { Tooltip } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function ProspectPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const [filters, setFilters] = useState({ subscription: "", status: "" });
  const [selectedDetail, setSelectedDetail] = useState<Prospect | null>(null);
  const {
    __prospects: prospects,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateProspect: _handleCreateProspect,
    __handleUpdateProspect: _handleUpdateProspect,
    __handleDeleteProspect: _handleDeleteProspect,
  } = useProspects();
  const {
    __subscriptions: subscriptions,
    __isLoading: isLoadingSubscriptions,
  } = useSubscriptions();

  const tableFields = [
    {
      key: "id",
      getValue: (prospect: Prospect) => prospect.id,
      searchable: true,
      sortable: true,
    },
    {
      key: "userInformation",
      getValue: (prospect: Prospect) => prospect.name,
      searchable: true,
      sortable: true,
    },
    {
      key: "subscription",
      getValue: (prospect: Prospect) => prospect.subscription.packageName,
      searchable: true,
    },
    {
      key: "status",
      getValue: (prospect: Prospect) => prospect.status,
      searchable: true,
    },
  ];
  const tableFilters = [
    (prospect: Prospect) =>
      !filters.subscription ||
      prospect.subscription.id === filters.subscription,
    (prospect: Prospect) =>
      !filters.status || prospect.status === filters.status,
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
    data: prospects,
    fields: tableFields,
    filters: tableFilters,
  });

  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.PROSPECT_FORM);
  const _handleOpenDetail = (prospect: Prospect) => {
    setSelectedDetail(prospect);
    showOffcanvas(OVERLAY_TARGETS.PROSPECT_DETAIL);
  };
  const {
    __selectedItem: selectedProspect,
    __handleOpenCreateForm: _handleOpenCreateForm,
    __handleOpenEditForm: _handleOpenEditForm,
    __handleConfirmDelete: _handleConfirmDelete,
  } = useCrudFormActions<Prospect>({
    deleteTitle: "Delete prospect",
    deleteMessage: (prospect) =>
      `Are you sure you want to delete ${prospect.name}?`,
    handleOpenForm: _handleFormOpen,
    handleDelete: _handleDeleteProspect,
  });

  const _handleSubmit = async (values: ProspectFormValues) => {
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

    return selectedProspect?.id
      ? _handleUpdateProspect(selectedProspect.id, payload)
      : _handleCreateProspect(payload);
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
                      { value: "Pending", label: "Pending" },
                      { value: "Completed", label: "Completed" },
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
            {hasPermission(permissions, PERMISSION_KEYS.PROSPECT.CREATE) ? (
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
                Add Prospect
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
              sortConfig={sortConfig}
              actions={{ handleSort: _handleSort }}
              isWrapHeader
              emptyMessage="There are no prospects yet. Add your first prospect."
            >
              {data.map((prospect) => (
                <TableRowProspect
                  key={prospect.id}
                  prospect={prospect}
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

      <ClientDetail item={selectedDetail} type="prospect" />

      <ProspectForm
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedProspect}
        subscriptions={subscriptions}
        actions={{ handleSubmit: _handleSubmit }}
      />
    </>
  );
}
