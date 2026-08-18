import { STORAGE_KEYS } from "@/config/storage.config";
import { authService } from "@/services/auth.service";
import { create } from "zustand";
import type { AuthSession, User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  checkSession: () => void;
}

const initialSession = authService.getValidSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialSession?.user ?? null,
  isAuthenticated: Boolean(initialSession),
  login: (session) => {
    authService.saveSession(session);
    set({ user: session.user, isAuthenticated: true });
  },
  logout: () => {
    authService.clearSession();
    set({ user: null, isAuthenticated: false });
  },
  checkSession: () => {
    const session = authService.getValidSession();
    set({ user: session?.user ?? null, isAuthenticated: Boolean(session) });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.AUTH_SESSION) {
      useAuthStore.getState().checkSession();
    }
  });
}
