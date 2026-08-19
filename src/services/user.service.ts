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

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
  status: User["status"];
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
  async getAll(): Promise<User[]> {
    authService.requireValidSession();
    await simulateApiDelay();
    authService.requireValidSession();
    return readUsers();
  },

  async create(payload: UserPayload): Promise<User> {
    authService.requireValidSession();
    await simulateApiDelay();
    authService.requireValidSession();

    const users = readUsers();
    const email = normalizeEmail(payload.email);
    if (users.some((user) => user.email === email)) {
      throw new Error("Email sudah digunakan oleh user lain.");
    }

    const user: User = {
      id: `USR-${crypto.randomUUID()}`,
      name: payload.name.trim(),
      email,
      password: payload.password,
      roleId: payload.roleId,
      status: payload.status,
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
    return user;
  },

  async update(id: string, payload: UserPayload): Promise<User> {
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

    const user: User = {
      ...users[index],
      name: payload.name.trim(),
      email,
      password: payload.password,
      roleId: payload.roleId,
      status: payload.status,
    };
    users[index] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return user;
  },

  async remove(id: string): Promise<void> {
    authService.requireValidSession();
    await simulateApiDelay();
    authService.requireValidSession();

    const users = readUsers();
    if (!users.some((user) => user.id === id)) {
      throw new Error("User tidak ditemukan.");
    }
    localStorage.setItem(
      STORAGE_KEYS.USERS,
      JSON.stringify(users.filter((user) => user.id !== id)),
    );
  },

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
