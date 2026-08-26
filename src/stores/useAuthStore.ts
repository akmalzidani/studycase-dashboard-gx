import { STORAGE_KEYS } from "@/config/storage.config";
import {
  AUTH_SESSION_INVALIDATED_EVENT,
  authService,
} from "@/services/auth.service";
import { getRoles } from "@/services/role.service";
import { create } from "zustand";
import type { AuthSession, Permissions, User } from "@/types";

interface AuthState {
  __user: User | null;
  __isAuthenticated: boolean;
  __permissions: Permissions;
  __handleLogin: (session: AuthSession) => void;
  __handleLogout: () => void;
  __handleCheckSession: () => void;
}

const getPermissions = (user: User | null): Permissions =>
  getRoles().find((role) => role.id === user?.roleId)?.permissions ?? {};

const initialSession = authService.getValidSession();

export const useAuthStore = create<AuthState>((set) => ({
  __user: initialSession?.user ?? null,
  __isAuthenticated: Boolean(initialSession),
  __permissions: getPermissions(initialSession?.user ?? null),
  __handleLogin: (session) => {
    authService.saveSession(session);
    set({
      __user: session.user,
      __isAuthenticated: true,
      __permissions: getPermissions(session.user),
    });
  },
  __handleLogout: () => {
    authService.clearSession();
    set({ __user: null, __isAuthenticated: false, __permissions: {} });
  },
  __handleCheckSession: () => {
    const session = authService.getValidSession();
    set({
      __user: session?.user ?? null,
      __isAuthenticated: Boolean(session),
      __permissions: getPermissions(session?.user ?? null),
    });
  },
}));

if (typeof window !== "undefined") {
  const _handleCheckSession = () => {
    const _handleCheckSession = useAuthStore.getState().__handleCheckSession;
    _handleCheckSession();
  };

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.AUTH_SESSION) {
      _handleCheckSession();
    }
  });
  window.addEventListener(AUTH_SESSION_INVALIDATED_EVENT, _handleCheckSession);
}
