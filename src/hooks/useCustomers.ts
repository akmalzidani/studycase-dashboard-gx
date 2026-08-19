import { toast } from "@/components/Overlay";
import {
  customerService,
  type CustomerPayload,
} from "@/services/customer.service";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      setCustomers(await customerService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memuat data customer."));
    } finally {
      setIsLoading(false);
    }
  }, [setCustomers, setIsLoading]);

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
      toast.success("Customer berhasil ditambahkan.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menambahkan customer."));
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
      toast.success("Customer berhasil diperbarui.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui customer."));
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
      toast.success("Customer berhasil dihapus.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus customer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCustomers = async () => {
    setIsSubmitting(true);
    try {
      setCustomers(await customerService.reset());
      toast.info("Data customer telah dikembalikan ke data awal.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mereset data customer."));
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
