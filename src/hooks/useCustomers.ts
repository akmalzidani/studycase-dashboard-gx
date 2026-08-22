import { toast } from "@/components/Overlay";
import {
  customerService,
  type CustomerPayload,
} from "@/services/customer.service";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useCallback, useEffect, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useCustomers() {
  const customers = useCustomerStore((state) => state.customers);

  const isLoading = useCustomerStore((state) => state.isLoading);
  const setCustomers = useCustomerStore((state) => state.setCustomers);
  const setIsLoading = useCustomerStore((state) => state.setIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      setCustomers(await customerService.getAll());
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load customer data."));
    } finally {
      setIsLoading(false);
    }
  }, [setCustomers, setIsLoading]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = async (payload: CustomerPayload) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.create(payload);
      setCustomers([...useCustomerStore.getState().customers, customer]);
      toast.success("Customer added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add customer."));
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
      toast.success("Customer updated successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update customer."));
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
      toast.success("Customer deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete customer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCustomers = async () => {
    setIsSubmitting(true);
    try {
      setCustomers(await customerService.reset());
      toast.info("Customer data has been restored to its initial state.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset customer data."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customers,
    isLoading,
    isSubmitting,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    resetCustomers,
  };
}
