import { api, ApiError } from "./client";
import type { User } from "./types";

export const meKey = ["me"];

export async function fetchMe(): Promise<User | null> {
  try {
    const { user } = await api<{ user: User }>("/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const { user } = await api<{ user: User }>("/auth/login", { method: "POST", body: { email, password } });
  return user;
}

export function logout(): Promise<void> {
  return api<void>("/auth/logout", { method: "POST" });
}
