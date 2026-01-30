import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getToken, setToken, clearToken } from "../storage/token";
import * as AuthApi from "../api/auth";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Ladataan token käynnistyksessä
  useEffect(() => {
    (async () => {
      const storedToken = await getToken();
      setTokenState(storedToken);
      setIsLoading(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isLoading,

      // 🔑 LOGIN
      signIn: async (email: string, password: string) => {
        const accessToken = await AuthApi.login({ email, password });
        await setToken(accessToken);
        setTokenState(accessToken);
      },

      // 🚪 LOGOUT
      signOut: async () => {
        await clearToken();
        setTokenState(null);
      },
    }),
    [token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
