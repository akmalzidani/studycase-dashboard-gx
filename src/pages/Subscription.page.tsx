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
import { PageHeader } from "@/components/common/PageHeader";
import { MODAL_TARGETS } from "@/config/modal.config";
import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";
import { useModal } from "@/hooks/useModal";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Subscription } from "@/types";
import { useCallback, useMemo } from "react";
import { BsArrowClockwise, BsPlusLg } from "react-icons/bs";

export default function SubscriptionPage() {
  const permissions = useAuthStore((state) => state.permissions);
  const {
    subscriptions,
    isLoading,
    isSubmitting,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    resetSubscriptions,
  } = useSubscriptions();

  const subscriptionFormModal = useModal(MODAL_TARGETS.SUBSCRIPTION_FORM);
  const {
    selectedItem: selectedSubscription,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Subscription>({
    deleteTitle: "Delete subscription package",
    deleteMessage: (subscription) =>
      `Are you sure you want to delete the ${subscription.packageName} package?`,
    modal: subscriptionFormModal,
    onDelete: deleteSubscription,
  });

  const table = useDataTable({
    data: subscriptions,
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
        speed: values.speed,
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
        canEdit: hasPermission(
          permissions,
          PERMISSION_KEYS.SUBSCRIPTION.UPDATE,
        ),
        canDelete: hasPermission(
          permissions,
          PERMISSION_KEYS.SUBSCRIPTION.DELETE,
        ),
        getLabel: (subscription: Subscription) => subscription.packageName,
        onEdit: openEditForm,
        onDelete: confirmDelete,
      }),
    [confirmDelete, isSubmitting, openEditForm, permissions],
  );

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Manage packages and subscriptions."
        actions={[
          // {
          //   id: "reset",
          //   permission: PERMISSION_KEYS.SUBSCRIPTION.UPDATE,
          //   content: (
          //     <button
          //       type="button"
          //       className="btn btn-outline-secondary"
          //       disabled={isSubmitting}
          //       onClick={() => resetSubscriptions()}
          //     >
          //       <BsArrowClockwise className="me-2" />
          //       Reset Data
          //     </button>
          //   ),
          // },
          {
            id: "create",
            permission: PERMISSION_KEYS.SUBSCRIPTION.CREATE,
            content: (
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={openCreateForm}
              >
                <BsPlusLg className="me-2" />
                Add Package
              </button>
            ),
          },
        ]}
      />

      <DataTable<Subscription>
        {...table}
        columns={subscriptionTableColumns}
        rowActions={rowActions}
        keyExtractor={(subscription) =>
          subscription.id ?? subscription.packageName
        }
        emptyMessage="There are no subscription packages yet. Add your first package."
        isLoading={isLoading}
      />

      <SubscriptionFormModal
        isOpen={subscriptionFormModal.isOpen}
        isSubmitting={isSubmitting}
        item={selectedSubscription}
        onClose={subscriptionFormModal.close}
        onSubmit={handleSubmit}
      />
    </>
  );
}
