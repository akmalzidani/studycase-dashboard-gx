import { STORAGE_KEYS } from "@/config/storage.config";
import { authService } from "@/services/auth.service";
import { getRoles } from "@/services/role.service";
import { create } from "zustand";
import type { AuthSession, Permissions, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permissions;
  login: (session: AuthSession) => void;
  logout: () => void;
  checkSession: () => void;
}

const getPermissions = (user: User | null): Permissions =>
  getRoles().find((role) => role.id === user?.roleId)?.permissions ?? {};

const initialSession = authService.getValidSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialSession?.user ?? null,
  isAuthenticated: Boolean(initialSession),
  permissions: getPermissions(initialSession?.user ?? null),
  login: (session) => {
    authService.saveSession(session);
    set({
      user: session.user,
      isAuthenticated: true,
      permissions: getPermissions(session.user),
    });
  },
  logout: () => {
    authService.clearSession();
    set({ user: null, isAuthenticated: false, permissions: {} });
  },
  checkSession: () => {
    const session = authService.getValidSession();
    set({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      permissions: getPermissions(session?.user ?? null),
    });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.AUTH_SESSION) {
      useAuthStore.getState().checkSession();
    }
  });
}
