import { ClientDetail } from "@/components/Details/ClientDetail";
import { Badge } from "@/components/common/Badge";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
import { Table } from "@/components/common/Table";
import { OVERLAY_TARGETS } from "@/config/overlay.config";
import { showOffcanvas } from "@/helpers/offcanvas.helpers";

import {
  ProspectForm,
  type ProspectFormValues,
} from "@/components/Forms/ProspectForm";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useTable } from "@/hooks/useTable";

import { useProspects } from "@/hooks/useProspects";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Prospect } from "@/types";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import { useState } from "react";
import {
  BsEnvelope,
  BsEye,
  BsPencilSquare,
  BsPlusLg,
  BsWhatsapp,
  BsTrash,
} from "react-icons/bs";

export default function ProspectPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const [filters, setFilters] = useState({ subscription: "", status: "" });
  const [selectedDetail, setSelectedDetail] = useState<Prospect | null>(null);
  const {
    prospects,
    isLoading,
    isSubmitting,
    createProspect,
    updateProspect,
    deleteProspect,
  } = useProspects();
  const { subscriptions, isLoading: isLoadingSubscriptions } =
    useSubscriptions();

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
  const table = useTable({
    data: prospects,
    fields: tableFields,
    filters: tableFilters,
  });

  const _handleFormOpen = () => showOffcanvas(OVERLAY_TARGETS.PROSPECT_FORM);
  const openDetail = (prospect: Prospect) => {
    setSelectedDetail(prospect);
    showOffcanvas(OVERLAY_TARGETS.PROSPECT_DETAIL);
  };
  const {
    selectedItem: selectedProspect,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Prospect>({
    deleteTitle: "Delete prospect",
    deleteMessage: (prospect) =>
      `Are you sure you want to delete ${prospect.name}?`,
    onOpenForm: _handleFormOpen,
    onDelete: deleteProspect,
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
      ? updateProspect(selectedProspect.id, payload)
      : createProspect(payload);
  };

  const tableRows = table.data.map((prospect) => [
    prospect.id ?? "-",
    <div className="d-grid gap-1">
      <span className="fw-semibold">{prospect.name}</span>
      <a
        className="d-flex align-items-center gap-2 small text-decoration-none"
        href={`mailto:${prospect.email}`}
      >
        <BsEnvelope aria-hidden="true" />
        {prospect.email}
      </a>
      <a
        className="d-flex align-items-center gap-2 small text-decoration-none"
        href={getWhatsAppUrl(prospect.phoneNumber)}
        target="_blank"
        rel="noreferrer"
      >
        <BsWhatsapp aria-hidden="true" />
        {prospect.phoneNumber}
      </a>
    </div>,
    <div>
      <div className="fw-medium">{prospect.subscription.packageName}</div>
      <small className="text-muted">
        {formatSpeed(prospect.subscription.speed)}
      </small>
    </div>,
    <Badge variant={prospect.status === "Completed" ? "success" : "warning"}>
      {prospect.status}
    </Badge>,
    {
      className: "text-end",
      content: (
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm border-0 bg-transparent p-0 text-body-secondary"
            aria-label={`View ${prospect.name} details`}
            onClick={() => openDetail(prospect)}
          >
            <BsEye />
          </button>
          {hasPermission(permissions, PERMISSION_KEYS.PROSPECT.UPDATE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-primary"
              aria-label={`Edit ${prospect.name}`}
              disabled={isSubmitting}
              onClick={() => openEditForm(prospect)}
            >
              <BsPencilSquare />
            </button>
          ) : null}
          {hasPermission(permissions, PERMISSION_KEYS.PROSPECT.DELETE) ? (
            <button
              type="button"
              className="btn btn-sm border-0 bg-transparent p-0 text-danger"
              aria-label={`Hapus ${prospect.name}`}
              disabled={isSubmitting}
              onClick={() => confirmDelete(prospect)}
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
                <TableSearch
                  value={table.search}
                  actions={{ handleChange: table.actions.handleSearch }}
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
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Prospect
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
            sortConfig={table.sortConfig}
            actions={{ handleSort: table.actions.handleSort }}
            isWrapHeader
            emptyMessage="There are no prospects yet. Add your first prospect."
          ></Table>

          {!isLoading ? (
            <TablePagination
              page={table.page}
              totalPages={table.totalPages}
              totalItems={table.totalItems}
              pageSize={table.pageSize}
              actions={{
                handlePageChange: table.actions.handlePageChange,
                handlePageSizeChange: table.actions.handlePageSizeChange,
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
