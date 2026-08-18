import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_USERS } from "@/data/user.mock";
import { simulateApiDelay } from "@/services/api-delay.service";
import type { AuthSession, User } from "@/types";

const AUTH_API_DELAY_MS = 800;
const SESSION_DURATION_MS = 60 * 60 * 1000;

const createToken = () =>
  `mock-token-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

const readUsers = (): User[] => {
  const value = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!value) {
    const users = structuredClone(MOCK_USERS);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users;
  }

  try {
    return JSON.parse(value) as User[];
  } catch {
    const users = structuredClone(MOCK_USERS);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users;
  }
};

const readSession = (): AuthSession | null => {
  const value = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    return null;
  }
};

export const authService = {
  getDemoAccounts(): User[] {
    return readUsers();
  },

  async login(email: string, password: string): Promise<AuthSession> {
    await simulateApiDelay(AUTH_API_DELAY_MS);

    const user = readUsers().find(
      (candidate) =>
        candidate.email === email && candidate.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }

    return {
      user,
      token: createToken(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
  },

  getValidSession(): AuthSession | null {
    const session = readSession();

    if (!session?.token || !session.user || session.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      return null;
    }

    return session;
  },

  requireValidSession(): AuthSession {
    const session = this.getValidSession();
    if (!session) throw new Error("Sesi tidak valid atau telah berakhir.");

    return session;
  },

  saveSession(session: AuthSession) {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
  },

  updateSessionUser(user: User) {
    const session = this.requireValidSession();
    this.saveSession({ ...session, user });
  },

  async logout(): Promise<void> {
    this.requireValidSession();
    await simulateApiDelay();
    this.requireValidSession();
    this.clearSession();
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },
};
