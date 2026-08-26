import { useEffect, useState } from "react";
import {
  subscriptionService,
  type SubscriptionPayload,
} from "@/services/subscription.service";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { toast } from "@/components/Overlay";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useSubscriptions() {
  const subscriptions = useSubscriptionStore((state) => state.__subscriptions);
  const isLoading = useSubscriptionStore((state) => state.__isLoading);
  const setSubscriptions = useSubscriptionStore(
    (state) => state.__handleSetSubscriptions,
  );
  const setIsLoading = useSubscriptionStore(
    (state) => state.__handleSetIsLoading,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSubscriptions() {
      setIsLoading(true);
      try {
        setSubscriptions(await subscriptionService.getAll());
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load subscriptions."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptions();
  }, [setIsLoading, setSubscriptions]);

  const __handleCreateSubscription = async (payload: SubscriptionPayload) => {
    setIsSubmitting(true);
    try {
      const subscription = await subscriptionService.create(payload);
      setSubscriptions([
        ...useSubscriptionStore.getState().__subscriptions,
        subscription,
      ]);
      toast.success("Subscription package added successfully.");
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to add subscription package."),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleUpdateSubscription = async (
    id: string,
    payload: SubscriptionPayload,
  ) => {
    setIsSubmitting(true);
    try {
      const subscription = await subscriptionService.update(id, payload);
      setSubscriptions(
        useSubscriptionStore
          .getState()
          .__subscriptions.map((item) =>
            item.id === id ? subscription : item,
          ),
      );
      toast.success("Subscription package updated successfully.");
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update subscription package."),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleDeleteSubscription = async (id: string) => {
    setIsSubmitting(true);
    try {
      await subscriptionService.remove(id);
      setSubscriptions(
        useSubscriptionStore
          .getState()
          .__subscriptions.filter((item) => item.id !== id),
      );
      toast.success("Subscription package deleted successfully.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to delete subscription package."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleResetSubscriptions = async () => {
    setIsSubmitting(true);
    try {
      setSubscriptions(await subscriptionService.reset());
      toast.info("Subscription data has been restored to its initial state.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset subscription data."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    __subscriptions: subscriptions,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateSubscription,
    __handleUpdateSubscription,
    __handleDeleteSubscription,
    __handleResetSubscriptions,
  };
}
