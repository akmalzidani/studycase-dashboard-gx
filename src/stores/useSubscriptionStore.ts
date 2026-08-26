import { create } from "zustand";
import type { Subscription } from "@/types";

interface SubscriptionState {
  __subscriptions: Subscription[];
  __isLoading: boolean;
  __handleSetSubscriptions: (subscriptions: Subscription[]) => void;
  __handleSetIsLoading: (isLoading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  __subscriptions: [],
  __isLoading: false,
  __handleSetSubscriptions: (__subscriptions) => set({ __subscriptions }),
  __handleSetIsLoading: (__isLoading) => set({ __isLoading }),
}));
