import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  users: User[];
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  setUsers: (users) => set({ users }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
