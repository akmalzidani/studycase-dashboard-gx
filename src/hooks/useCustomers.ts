import { useCallback, useEffect, useRef, useState } from "react";
import {
  customerService,
  type CustomerPayload,
} from "@/services/customer.service";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useToastStore } from "@/stores/useToastStore";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useCustomers() {
  const customers = useCustomerStore((state) => state.customers);
  const hasLoaded = useCustomerStore((state) => state.hasLoaded);
  const isLoading = useCustomerStore((state) => state.isLoading);
  const setCustomers = useCustomerStore((state) => state.setCustomers);
  const setIsLoading = useCustomerStore((state) => state.setIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);
  const addToast = useToastStore((state) => state.addToast);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      setCustomers(await customerService.getAll());
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal memuat data customer."), "danger");
    } finally {
      setIsLoading(false);
    }
  }, [addToast, setCustomers, setIsLoading]);

  useEffect(() => {
    if (!hasLoaded && !hasFetched.current) {
      hasFetched.current = true;
      fetchCustomers();
    }
  }, [fetchCustomers, hasLoaded]);

  const createCustomer = async (payload: CustomerPayload) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.create(payload);
      setCustomers([...useCustomerStore.getState().customers, customer]);
      addToast("Customer berhasil ditambahkan.", "success");
      return true;
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal menambahkan customer."), "danger");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomer = async (id: string, payload: CustomerPayload) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.update(id, payload);
      setCustomers(
        useCustomerStore
          .getState()
          .customers.map((item) => (item.id === id ? customer : item)),
      );
      addToast("Customer berhasil diperbarui.", "success");
      return true;
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal memperbarui customer."), "danger");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsSubmitting(true);
    try {
      await customerService.remove(id);
      setCustomers(
        useCustomerStore.getState().customers.filter((item) => item.id !== id),
      );
      addToast("Customer berhasil dihapus.", "success");
    } catch (error) {
      addToast(getErrorMessage(error, "Gagal menghapus customer."), "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCustomers = async () => {
    setIsSubmitting(true);
    try {
      setCustomers(await customerService.reset());
      addToast("Data customer telah dikembalikan ke data awal.", "info");
    } catch (error) {
      addToast(
        getErrorMessage(error, "Gagal mereset data customer."),
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customers,
    isLoading: isLoading || !hasLoaded,
    isSubmitting,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    resetCustomers,
  };
}
