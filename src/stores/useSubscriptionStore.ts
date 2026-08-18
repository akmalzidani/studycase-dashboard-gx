import { create } from "zustand";
import type { Subscription } from "@/types";

interface SubscriptionState {
  subscriptions: Subscription[];
  hasLoaded: boolean;
  isLoading: boolean;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [],
  hasLoaded: false,
  isLoading: false,
  setSubscriptions: (subscriptions) => set({ subscriptions, hasLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
