import { ClientDetail } from "@/components/Details/ClientDetail";

import { Table } from "@/components/common/Table";
import { TableFilter } from "@/components/common/TableFilter";
import { TablePagination } from "@/components/common/TablePagination";
import { TableSearch } from "@/components/common/TableSearch";
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

import { Badge } from "@/components/common/Badge";
import { formatSpeed, getWhatsAppUrl } from "@/helpers/formatters.helpers";
import { Tooltip } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import {
  BsEnvelope,
  BsEye,
  BsPencilSquare,
  BsPlusLg,
  BsTrash,
  BsWhatsapp,
} from "react-icons/bs";

export default function ProspectPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const permissions = useAuthStore((store) => store.__permissions);
  const [filters, setFilters] = useState({ subscription: "", status: "" });
  const [selectedDetail, setSelectedDetail] = useState<Prospect | null>(null);
  const {
    __prospects,
    __isLoading: isLoadingProspects,
    __isSubmitting,
    __handleCreateProspect,
    __handleUpdateProspect,
    __handleDeleteProspect,
  } = useProspects();
  const { __subscriptions, __isLoading: isLoadingSubscriptions } =
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
  const subscriptionOptions = __subscriptions.flatMap((subscription) =>
    subscription.id
      ? [{ value: subscription.id, label: subscription.packageName }]
      : [],
  );
  const {
    __data,
    __search,
    __sortConfig,
    __page,
    __pageSize,
    __totalPages,
    __totalItems,
    __actions: {
      __handleSearch,
      __handleSort,
      __handlePageChange,
      __handlePageSizeChange,
    },
  } = useTable({
    data: __prospects,
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
    handleDelete: __handleDeleteProspect,
  });

  const _handleSubmit = async (values: ProspectFormValues) => {
    const subscription = __subscriptions.find(
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
      ? __handleUpdateProspect(selectedProspect.id, payload)
      : __handleCreateProspect(payload);
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
                  value={__search}
                  actions={{ handleChange: __handleSearch }}
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
                  __isSubmitting ||
                  isLoadingSubscriptions ||
                  __subscriptions.length === 0
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
              tds={__data.map((prospect) => [
                prospect.id ?? "-",
                <div className="d-flex flex-column gap-1">
                  <span className="fw-semibold">{prospect.name}</span>
                  <a
                    className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
                    href={`mailto:${prospect.email}`}
                  >
                    <BsEnvelope aria-hidden="true" />
                    {prospect.email}
                  </a>
                  <a
                    className="d-inline-flex align-self-start align-items-center gap-2 small text-decoration-none"
                    href={getWhatsAppUrl(prospect.phoneNumber)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsWhatsapp aria-hidden="true" />
                    {prospect.phoneNumber}
                  </a>
                </div>,
                <div>
                  <div className="fw-medium">
                    {prospect.subscription.packageName}
                  </div>
                  <small className="text-muted">
                    {formatSpeed(prospect.subscription.speed)}
                  </small>
                </div>,
                <Badge
                  variant={
                    prospect.status === "Completed" ? "success" : "warning"
                  }
                >
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
                        data-bs-title={`View ${prospect.name} details`}
                        data-bs-toggle="tooltip"
                        onClick={() => _handleOpenDetail(prospect)}
                      >
                        <BsEye />
                      </button>
                      {hasPermission(
                        permissions,
                        PERMISSION_KEYS.PROSPECT.UPDATE,
                      ) ? (
                        <button
                          type="button"
                          className="btn btn-sm border-0 bg-transparent p-0 text-primary"
                          aria-label={`Edit ${prospect.name}`}
                          data-bs-title={`Edit ${prospect.name}`}
                          data-bs-toggle="tooltip"
                          disabled={__isSubmitting}
                          onClick={() => _handleOpenEditForm(prospect)}
                        >
                          <BsPencilSquare />
                        </button>
                      ) : null}
                      {hasPermission(
                        permissions,
                        PERMISSION_KEYS.PROSPECT.DELETE,
                      ) ? (
                        <button
                          type="button"
                          className="btn btn-sm border-0 bg-transparent p-0 text-danger"
                          aria-label={`Hapus ${prospect.name}`}
                          data-bs-title={`Hapus ${prospect.name}`}
                          data-bs-toggle="tooltip"
                          disabled={__isSubmitting}
                          onClick={() => _handleConfirmDelete(prospect)}
                        >
                          <BsTrash />
                        </button>
                      ) : null}
                    </div>
                  ),
                },
              ])}
              isLoading={isLoadingProspects}
              sortConfig={__sortConfig}
              actions={{ handleSort: __handleSort }}
              isWrapHeader
              emptyMessage="There are no prospects yet. Add your first prospect."
            />
          </div>

          {!isLoadingProspects ? (
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

      <ClientDetail item={selectedDetail} type="prospect" />

      <ProspectForm
        isSubmitting={__isSubmitting || isLoadingSubscriptions}
        item={selectedProspect}
        subscriptions={__subscriptions}
        actions={{ handleSubmit: _handleSubmit }}
      />
    </>
  );
}
