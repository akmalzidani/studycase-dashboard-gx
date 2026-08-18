import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_CUSTOMERS } from "@/data/client.mock";
import { createLocalStorageCrudService } from "@/services/base-crud.service";
import type { Customer } from "@/types";

export type CustomerPayload = Omit<Customer, "id">;

export const customerService = createLocalStorageCrudService<Customer>({
  storageKey: STORAGE_KEYS.CUSTOMERS,
  initialData: MOCK_CUSTOMERS,
  idPrefix: "CUST",
  entityName: "Customer",
  normalizePayload: (payload) => ({
    ...payload,
    email: payload.email.trim().toLowerCase(),
  }),
  getConflictMessage: (customers, payload, excludedId) =>
    customers.some(
      (customer) =>
        customer.id !== excludedId && customer.email === payload.email,
    )
      ? "Email sudah digunakan oleh customer lain."
      : undefined,
});
