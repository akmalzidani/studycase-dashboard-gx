import { useCallback, useEffect, useRef, useState } from "react";
import {
  subscriptionService,
  type SubscriptionPayload,
} from "@/services/subscription.service";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useToastStore } from "@/stores/useToastStore";

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
  const addToast = useToastStore((state) => state.addToast);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      setSubscriptions(await subscriptionService.getAll());
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal memuat subscription."), "danger");
    } finally {
      setIsLoading(false);
    }
  }, [addToast, setIsLoading, setSubscriptions]);

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
      addToast("Paket subscription berhasil ditambahkan.", "success");
      return true;
    } catch (error) {
      addToast(
        getErrorMessage(error, "Gagal menambahkan paket subscription."),
        "danger",
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
      addToast("Paket subscription berhasil diperbarui.", "success");
      return true;
    } catch (error) {
      addToast(
        getErrorMessage(error, "Gagal memperbarui paket subscription."),
        "danger",
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
      addToast("Paket subscription berhasil dihapus.", "success");
    } catch (error) {
      addToast(
        getErrorMessage(error, "Gagal menghapus paket subscription."),
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubscriptions = async () => {
    setIsSubmitting(true);
    try {
      setSubscriptions(await subscriptionService.reset());
      addToast("Data subscription berhasil direset.", "success");
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal mereset subscription."), "danger");
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
