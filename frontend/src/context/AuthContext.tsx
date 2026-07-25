import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { setAuthToken } from "../services/api";
import * as authService from "../services/authService";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginUser: (credentials: LoginPayload) => Promise<AuthResponse>;
  registerUser: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const loginUser = useCallback(async (credentials: LoginPayload) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser({ name: data.name, firstName: data.firstName, role: data.role });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      if (data?.token) {
        setUser({
          name: data.name,
          firstName: data.firstName,
          role: data.role,
        });
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}
