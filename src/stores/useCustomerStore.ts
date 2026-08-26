import { create } from "zustand";
import type { Customer } from "@/types";

interface CustomerState {
  __customers: Customer[];
  __isLoading: boolean;
  __handleSetCustomers: (customers: Customer[]) => void;
  __handleSetIsLoading: (isLoading: boolean) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  __customers: [],
  __isLoading: false,
  __handleSetCustomers: (__customers) => set({ __customers }),
  __handleSetIsLoading: (__isLoading) => set({ __isLoading }),
}));
