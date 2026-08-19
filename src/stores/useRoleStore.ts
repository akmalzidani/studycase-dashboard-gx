import { create } from "zustand";
import type { Role } from "@/types";

interface RoleState {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
}));
