import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  users: User[];
  isLoaded: boolean;
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoaded: false,
  isLoading: false,
  setUsers: (users) => set({ users, isLoaded: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
