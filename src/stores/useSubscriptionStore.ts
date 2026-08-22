import { create } from "zustand";
import type { Subscription } from "@/types";

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [],
  isLoading: false,
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
