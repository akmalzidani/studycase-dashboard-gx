import { create } from "zustand";
import type { Customer } from "@/types";

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  setCustomers: (customers: Customer[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoading: false,
  setCustomers: (customers) => set({ customers }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
