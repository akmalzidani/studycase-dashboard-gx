import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  __users: User[];
  __isLoading: boolean;
  __handleSetUsers: (users: User[]) => void;
  __handleSetIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  __users: [],
  __isLoading: false,
  __handleSetUsers: (__users) => set({ __users }),
  __handleSetIsLoading: (__isLoading) => set({ __isLoading }),
}));
