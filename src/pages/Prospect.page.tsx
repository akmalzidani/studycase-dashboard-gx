import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import {
  ProspectFormModal,
  type ProspectFormValues,
} from "@/components/ProspectFormModal";
import {
  prospectTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";

import { useConfirm } from "@/hooks/useConfirm";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useProspects } from "@/hooks/useProspects";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { Prospect } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function ProspectPage() {
  const {
    prospects,
    isLoading,
    isSubmitting,
    createProspect,
    updateProspect,
    deleteProspect,
    resetProspects,
  } = useProspects();
  const { subscriptions, isLoading: isLoadingSubscriptions } =
    useSubscriptions();
  const confirm = useConfirm();
  const prospectFormModal = useModal(MODAL_TARGETS.PROSPECT_FORM);
  const {
    selectedItem: selectedProspect,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Prospect>({
    confirm,
    deleteTitle: "Hapus prospect",
    deleteMessage: (prospect) =>
      `Apakah Anda yakin ingin menghapus ${prospect.name}?`,
    modal: prospectFormModal,
    onDelete: deleteProspect,
  });

  const table = useDataTable({
    data: prospects,
    initialSortKey: "name",
    searchPredicate: searchClientTableItem,
  });

  const handleSubmit = useCallback(
    async (values: ProspectFormValues) => {
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
    },
    [createProspect, selectedProspect, subscriptions, updateProspect],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        getLabel: (prospect: Prospect) => prospect.name,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm],
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1
            className="h3 mb-1 fw-bold
"
          >
            Prospect
          </h1>
          <p className="text-muted mb-0">
            Manajemen data calon pelanggan (prospek).
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
            onClick={() => resetProspects()}
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
            Tambah Prospect
          </button>
        </div>
      </div>

      <DataTable<Prospect>
        {...table}
        columns={prospectTableColumns}
        rowActions={rowActions}
        keyExtractor={(prospect) => prospect.id ?? prospect.email}
        emptyMessage="Belum ada prospect. Tambahkan prospect pertama Anda."
        isLoading={isLoading}
      />

      <ProspectFormModal
        isOpen={prospectFormModal.isOpen}
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedProspect}
        subscriptions={subscriptions}
        onClose={prospectFormModal.close}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
