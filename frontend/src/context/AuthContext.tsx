import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { User } from "../api/types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user = null, isLoading } = useQuery({
    queryKey: authApi.meKey,
    queryFn: authApi.fetchMe,
    staleTime: Infinity,
  });

  async function login(email: string, password: string) {
    const loggedIn = await authApi.login(email, password);
    queryClient.setQueryData(authApi.meKey, loggedIn);
  }

  async function logout() {
    await authApi.logout();
    queryClient.setQueryData(authApi.meKey, null);
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== authApi.meKey[0] });
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
