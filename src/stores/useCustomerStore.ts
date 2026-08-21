import { create } from "zustand";
import type { Customer } from "@/types";

interface CustomerState {
  customers: Customer[];
  isLoaded: boolean;
  isLoading: boolean;
  setCustomers: (customers: Customer[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoaded: false,
  isLoading: false,
  setCustomers: (customers) => set({ customers, isLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
