import { toast } from "@/components/Overlay";
import {
  customerService,
  type CustomerPayload,
} from "@/services/customer.service";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useEffect, useState } from "react";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export function useCustomers() {
  const customers = useCustomerStore((state) => state.__customers);
  const isLoading = useCustomerStore((state) => state.__isLoading);
  const setCustomers = useCustomerStore((state) => state.__handleSetCustomers);
  const setIsLoading = useCustomerStore((state) => state.__handleSetIsLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        setCustomers(await customerService.getAll());
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load customer data."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, [setCustomers, setIsLoading]);

  const __handleCreateCustomer = async (payload: CustomerPayload) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.create(payload);
      setCustomers([...useCustomerStore.getState().__customers, customer]);
      toast.success("Customer added successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add customer."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleUpdateCustomer = async (
    id: string,
    payload: CustomerPayload,
  ) => {
    setIsSubmitting(true);
    try {
      const customer = await customerService.update(id, payload);
      setCustomers(
        useCustomerStore
          .getState()
          .__customers.map((item) => (item.id === id ? customer : item)),
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

  const __handleDeleteCustomer = async (id: string) => {
    setIsSubmitting(true);
    try {
      await customerService.remove(id);
      setCustomers(
        useCustomerStore
          .getState()
          .__customers.filter((item) => item.id !== id),
      );
      toast.success("Customer deleted successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete customer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const __handleResetCustomers = async () => {
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
    __customers: customers,
    __isLoading: isLoading,
    __isSubmitting: isSubmitting,
    __handleCreateCustomer,
    __handleUpdateCustomer,
    __handleDeleteCustomer,
    __handleResetCustomers,
  };
}
