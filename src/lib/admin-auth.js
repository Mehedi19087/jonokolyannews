"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  authApi,
  usersApi,
  getAccessToken,
  setTokens,
  clearTokens,
  isOwnerRole,
} from "./api-client.js";

const STORAGE_KEY = "bdn_admin_session";

const AdminAuthContext = createContext(null);

export function normalizeRole(roleStr) {
  if (!roleStr) return "READER";
  const r = String(roleStr).toUpperCase();
  if (r === "OWNER" || r === "ADMIN" || r === "SUPERADMIN") return "OWNER";
  if (r === "EIC") return "EIC";
  if (r === "EDITOR" || r === "EDIT") return "EDITOR";
  if (r === "REPORTER" || r === "JOURNALIST") return "REPORTER";
  if (r === "READER") return "READER";
  return "READER";
}

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialUser = null;
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        initialUser = JSON.parse(raw);
        if (initialUser) {
          initialUser.role = normalizeRole(initialUser.role);
          setUser(initialUser);
        }
      }
    } catch {
      // ignore JSON parse error
    }
    setLoading(false);

    // Sync real role from backend if access token is present
    if (initialUser && getAccessToken() && isOwnerRole(initialUser.role)) {
      usersApi
        .list()
        .then((userList) => {
          if (!Array.isArray(userList)) return;
          const fresh = userList.find(
            (u) =>
              (u.email && u.email.toLowerCase() === initialUser?.email?.toLowerCase()) ||
              u.id === initialUser?.id
          );
          if (fresh && fresh.role) {
            const freshRole = normalizeRole(fresh.role);
            const updated = { ...initialUser, ...fresh, role: freshRole };
            setUser(updated);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {
              /* noop */
            }
          }
        })
        .catch(() => {
          /* noop if non-owner endpoint fetch fails */
        });
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setTokens(res.access, res.refresh);
    const normalizedUser = {
      ...res.user,
      role: normalizeRole(res.user?.role),
    };
    setUser(normalizedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
    } catch {
      // ignore
    }
    return normalizedUser;
  };

  const logout = async () => {
    clearTokens();
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: true,
      login: async () => {},
      logout: async () => {},
    };
  }
  return ctx;
}
