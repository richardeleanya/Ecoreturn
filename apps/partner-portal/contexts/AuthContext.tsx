"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth as sdkAuth, authStore } from "sdk";
import { useRouter } from "next/router";

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
  getToken: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await sdkAuth.login({ email, password });
    authStore.setToken(res.accessToken);
    setToken(res.accessToken);
    localStorage.setItem("token", res.accessToken);
  };

  const logout = async () => {
    await sdkAuth.logout();
    authStore.setToken(undefined);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}