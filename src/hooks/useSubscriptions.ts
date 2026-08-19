import { useCallback, useEffect, useRef, useState } from "react";
import {
  subscriptionService,
  type SubscriptionPayload,
} from "@/services/subscription.service";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { toast } from "@/components/Overlay";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useSubscriptions() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const hasLoaded = useSubscriptionStore((state) => state.hasLoaded);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const setSubscriptions = useSubscriptionStore(
    (state) => state.setSubscriptions,
  );
  const setIsLoading = useSubscriptionStore((state) => state.setIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      setSubscriptions(await subscriptionService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat subscription."));
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setSubscriptions]);

  useEffect(() => {
    if (!hasLoaded && !hasFetched.current) {
      hasFetched.current = true;
      fetchSubscriptions();
    }
  }, [fetchSubscriptions, hasLoaded]);

  const createSubscription = async (payload: SubscriptionPayload) => {
    setIsSubmitting(true);
    try {
      const subscription = await subscriptionService.create(payload);
      setSubscriptions([
        ...useSubscriptionStore.getState().subscriptions,
        subscription,
      ]);
      toast.success("Paket subscription berhasil ditambahkan.");
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal menambahkan paket subscription."),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSubscription = async (
    id: string,
    payload: SubscriptionPayload,
  ) => {
    setIsSubmitting(true);
    try {
      const subscription = await subscriptionService.update(id, payload);
      setSubscriptions(
        useSubscriptionStore
          .getState()
          .subscriptions.map((item) => (item.id === id ? subscription : item)),
      );
      toast.success("Paket subscription berhasil diperbarui.");
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui paket subscription."),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    setIsSubmitting(true);
    try {
      await subscriptionService.remove(id);
      setSubscriptions(
        useSubscriptionStore
          .getState()
          .subscriptions.filter((item) => item.id !== id),
      );
      toast.success("Paket subscription berhasil dihapus.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal menghapus paket subscription."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubscriptions = async () => {
    setIsSubmitting(true);
    try {
      setSubscriptions(await subscriptionService.reset());
      toast.success("Data subscription berhasil direset.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mereset subscription."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    subscriptions,
    isLoading,
    isSubmitting,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    resetSubscriptions,
  };
}
