import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  users: User[];
  hasLoaded: boolean;
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  hasLoaded: false,
  isLoading: false,
  setUsers: (users) => set({ users, hasLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
