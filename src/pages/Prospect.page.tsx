import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import {
  ProspectFormModal,
  type ProspectFormValues,
} from "@/components/ProspectFormModal";
import {
  prospectTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useProspects } from "@/hooks/useProspects";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Prospect } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function ProspectPage() {
  const permissions = useAuthStore((state) => state.permissions);
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

  const prospectFormModal = useModal(MODAL_TARGETS.PROSPECT_FORM);
  const {
    selectedItem: selectedProspect,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Prospect>({
    deleteTitle: "Hapus prospect",
    deleteMessage: (prospect) =>
      `Apakah Anda yakin ingin menghapus ${prospect.name}?`,
    modal: prospectFormModal,
    onDelete: deleteProspect,
  });

  const table = useDataTable({
    data: prospects,
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
        canEdit: hasPermission(permissions, PERMISSION_KEYS.PROSPECT.UPDATE),
        canDelete: hasPermission(permissions, PERMISSION_KEYS.PROSPECT.DELETE),
        getLabel: (prospect: Prospect) => prospect.name,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm, permissions],
  );

  return (
    <div>
      <PageHeader
        title="Prospect"
        description="Manajemen data calon pelanggan (prospek)."
        actions={[
          {
            id: "reset",
            permission: PERMISSION_KEYS.PROSPECT.UPDATE,
            content: (
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
                onClick={() => resetProspects()}
              >
                <BsArrowClockwise className="me-2" />
                Reset Data
              </button>
            ),
          },
          {
            id: "create",
            permission: PERMISSION_KEYS.PROSPECT.CREATE,
            content: (
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
            ),
          },
        ]}
      />

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
