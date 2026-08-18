import { create } from "zustand";
import type { Customer } from "@/types";

interface CustomerState {
  customers: Customer[];
  hasLoaded: boolean;
  isLoading: boolean;
  setCustomers: (customers: Customer[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  hasLoaded: false,
  isLoading: false,
  setCustomers: (customers) => set({ customers, hasLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
