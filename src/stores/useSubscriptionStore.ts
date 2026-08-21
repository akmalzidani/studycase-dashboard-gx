import { create } from "zustand";
import type { Subscription } from "@/types";

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoaded: boolean;
  isLoading: boolean;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [],
  isLoaded: false,
  isLoading: false,
  setSubscriptions: (subscriptions) => set({ subscriptions, isLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
