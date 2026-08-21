import { createCrudRowActions, DataTable } from "@/components/common/DataTable";
import { MODAL_TARGETS } from "@/config/modal.config";
import { showModal } from "@/helpers/modal.helpers";

import {
  ProspectFormModal,
  type ProspectFormValues,
} from "@/components/ProspectFormModal";
import {
  prospectTableColumns,
  searchClientTableItem,
} from "@/components/TableColumns";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";

import { useProspects } from "@/hooks/useProspects";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Prospect } from "@/types";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function ProspectPage() {
  const permissions = useAuthStore((store) => store.permissions);
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


  const {
    selectedItem: selectedProspect,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Prospect>({
    deleteTitle: "Delete prospect",
    deleteMessage: (prospect) =>
      `Are you sure you want to delete ${prospect.name}?`,
    onOpenForm: () => showModal(MODAL_TARGETS.PROSPECT_FORM),
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
    <>

      <DataTable<Prospect>
        {...table}
        columns={prospectTableColumns}
        rowActions={rowActions}
        keyExtractor={(prospect) => prospect.id ?? prospect.email}
        emptyMessage="There are no prospects yet. Add your first prospect."
        isLoading={isLoading}
        actions={
          hasPermission(permissions, PERMISSION_KEYS.PROSPECT.CREATE) && (
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
          )
        }
      />

      <ProspectFormModal
        isSubmitting={isSubmitting || isLoadingSubscriptions}
        item={selectedProspect}
        subscriptions={subscriptions}
        onSubmit={handleSubmit}
      />
    </>
  );
}
