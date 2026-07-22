"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  getSession,
  loginUser,
  registerUser,
  type Session,
} from "@/lib/auth";

// ── Types ────────────────────────────────────────────────────────

interface AuthState {
  user: Session | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: true } | { success: false; error: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: true } | { success: false; error: string }>;
  logout: () => void;
}

// ── Context ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  // Restore session on mount
  useEffect(() => {
    const session = getSession();
    setState({ user: session, loading: false });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success) {
      setState((s) => ({ ...s, user: result.session }));
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerUser(name, email, password);
    if (result.success) {
      setState((s) => ({ ...s, user: result.session }));
      return { success: true as const };
    }
    return { success: false as const, error: result.error };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setState((s) => ({ ...s, user: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
