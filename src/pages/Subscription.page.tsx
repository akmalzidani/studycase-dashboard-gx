import {
  SubscriptionFormModal,
  type SubscriptionFormValues,
} from "@/components/SubscriptionFormModal";
import { subscriptionTableColumns } from "@/components/TableColumns";
import { MODAL_TARGETS } from "@/config/modal.config";
import { showModal } from "@/helpers/modal.helpers";
import {
  createCrudRowActions,
  DataTable,
  matchesSearchKeyword,
} from "@/components/common/DataTable";


import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";

import { useCrudFormActions } from "@/hooks/useCrudFormActions";
import { useDataTable } from "@/hooks/useDataTable";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Subscription } from "@/types";
import { useCallback, useMemo } from "react";
import { BsPlusLg } from "react-icons/bs";

export default function SubscriptionPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const {
    subscriptions,
    isLoading,
    isSubmitting,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();


  const {
    selectedItem: selectedSubscription,
    openCreateForm,
    openEditForm,
    confirmDelete,
  } = useCrudFormActions<Subscription>({
    deleteTitle: "Delete subscription package",
    deleteMessage: (subscription) =>
      `Are you sure you want to delete the ${subscription.packageName} package?`,
    onOpenForm: () => showModal(MODAL_TARGETS.SUBSCRIPTION_FORM),
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

      <DataTable<Subscription>
        {...table}
        columns={subscriptionTableColumns}
        rowActions={rowActions}
        keyExtractor={(subscription) =>
          subscription.id ?? subscription.packageName
        }
        emptyMessage="There are no subscription packages yet. Add your first package."
        isLoading={isLoading}
        actions={
          hasPermission(permissions, PERMISSION_KEYS.SUBSCRIPTION.CREATE) && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={openCreateForm}
            >
              <BsPlusLg className="me-2" />
              Add Package
            </button>
          )
        }
      />

      <SubscriptionFormModal
        isSubmitting={isSubmitting}
        item={selectedSubscription}
        onSubmit={handleSubmit}
      />
    </>
  );
}
