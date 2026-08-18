import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_USERS } from "@/data/user.mock";
import { authService } from "@/services/auth.service";
import { simulateApiDelay } from "@/services/api-delay.service";
import type { User } from "@/types";

export interface ProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readUsers = (): User[] => {
  const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!storedUsers) {
    const users = structuredClone(MOCK_USERS);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users;
  }

  try {
    return JSON.parse(storedUsers) as User[];
  } catch {
    const users = structuredClone(MOCK_USERS);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users;
  }
};

export const userService = {
  async updateProfile(id: string, payload: ProfilePayload): Promise<User> {
    authService.requireValidSession();
    await simulateApiDelay();
    authService.requireValidSession();

    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) throw new Error("User tidak ditemukan.");

    const email = normalizeEmail(payload.email);
    if (users.some((user) => user.id !== id && user.email === email)) {
      throw new Error("Email sudah digunakan oleh user lain.");
    }

    const updatedUser: User = {
      ...users[index],
      name: payload.name.trim(),
      email,
    };
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return updatedUser;
  },

  async changePassword(
    id: string,
    payload: ChangePasswordPayload,
  ): Promise<User> {
    authService.requireValidSession();
    await simulateApiDelay();
    authService.requireValidSession();

    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) throw new Error("User tidak ditemukan.");

    if (users[index].password !== payload.currentPassword) {
      throw new Error("Password saat ini tidak sesuai.");
    }

    const updatedUser: User = {
      ...users[index],
      password: payload.newPassword,
    };
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return updatedUser;
  },
};
