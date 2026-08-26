import { create } from "zustand";
import type { Role } from "@/types";

interface RoleState {
  __roles: Role[];
  __handleSetRoles: (roles: Role[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  __roles: [],
  __handleSetRoles: (__roles) => set({ __roles }),
}));
