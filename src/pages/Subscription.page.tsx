import {
  SubscriptionFormModal,
  type SubscriptionFormValues,
} from "@/components/SubscriptionFormModal";
import { subscriptionTableColumns } from "@/components/TableColumns";
import {
  createCrudRowActions,
  DataTable,
  matchesSearchKeyword,
} from "@/components/common/DataTable";
import { MODAL_TARGETS } from "@/config/modal.config";
import { useConfirm } from "@/hooks/useConfirm";
import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { Subscription } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function SubscriptionPage() {
  const {
    subscriptions,
    isLoading,
    isSubmitting,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    resetSubscriptions,
  } = useSubscriptions();
  const confirm = useConfirm();
  const subscriptionFormModal = useModal(MODAL_TARGETS.SUBSCRIPTION_FORM);
  const {
    selectedItem: selectedSubscription,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Subscription>({
    confirm,
    deleteTitle: "Hapus paket subscription",
    deleteMessage: (subscription) =>
      `Apakah Anda yakin ingin menghapus paket ${subscription.packageName}?`,
    modal: subscriptionFormModal,
    onDelete: deleteSubscription,
  });

  const table = useDataTable({
    data: subscriptions,
    initialSortKey: "packageName",
    searchPredicate: (subscription, keyword) =>
      matchesSearchKeyword(
        [
          subscription.id,
          subscription.packageName,
          subscription.speed,
          subscription.monthlyFee,
        ],
        keyword,
      ),
  });

  const handleSubmit = useCallback(
    (values: SubscriptionFormValues) => {
      const payload = {
        packageName: values.packageName.trim(),
        speed: values.speed.trim(),
        monthlyFee: values.monthlyFee,
      };

      return selectedSubscription?.id
        ? updateSubscription(selectedSubscription.id, payload)
        : createSubscription(payload);
    },
    [createSubscription, selectedSubscription, updateSubscription],
  );

  const rowActions = useMemo(
    () =>
      createCrudRowActions({
        disabled: isSubmitting,
        getLabel: (subscription: Subscription) => subscription.packageName,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm],
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold">Subscription</h1>
          <p className="text-muted mb-0">Kelola paket dan langganan.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
            onClick={() => resetSubscriptions()}
          >
            <BsArrowClockwise className="me-2" />
            Reset Data
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={openCreateForm}
          >
            <BsPlusLg className="me-2" />
            Tambah Paket
          </button>
        </div>
      </div>

      <DataTable<Subscription>
        {...table}
        columns={subscriptionTableColumns}
        rowActions={rowActions}
        keyExtractor={(subscription) =>
          subscription.id ?? subscription.packageName
        }
        emptyMessage="Belum ada paket subscription. Tambahkan paket pertama Anda."
        isLoading={isLoading}
      />

      <SubscriptionFormModal
        isOpen={subscriptionFormModal.isOpen}
        isSubmitting={isSubmitting}
        item={selectedSubscription}
        onClose={subscriptionFormModal.close}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
