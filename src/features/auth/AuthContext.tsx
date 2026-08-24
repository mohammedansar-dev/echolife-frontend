import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { login as loginApi, logout as logoutApi } from "./auth.api";

import type { AuthContextValue, LoginResponse, User } from "./auth.types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_USER_KEY = "echolife_auth_user";

/* =========================================================
   Convert backend AuthResponse → frontend User
   ========================================================= */

function convertBackendUser(response: LoginResponse): User | null {
  if (response.userId === undefined || !response.email) {
    return null;
  }

  return {
    id: String(response.userId),

    email: response.email,

    displayName: response.name || response.email.split("@")[0],

    role: response.role || "USER",

    status: "active",
  };
}

/* =========================================================
   Provider
   ========================================================= */

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);

      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  /* =======================================================
     Restore local authentication
     ======================================================= */

  useEffect(() => {
    setIsLoading(false);
  }, []);

  /* =======================================================
     LOGIN
     ======================================================= */

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    const response = await loginApi({
      email,
      password,
    });

    const loggedInUser = convertBackendUser(response);

    if (!loggedInUser) {
      throw new Error("The backend returned an invalid login response.");
    }

    setUser(loggedInUser);

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));
    } catch {
      // Ignore localStorage errors.
    }

    return response;
  };

  /* =======================================================
     LOGOUT
     ======================================================= */

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Local logout still happens.
    } finally {
      setUser(null);

      try {
        localStorage.removeItem(AUTH_USER_KEY);
      } catch {
        // Ignore localStorage errors.
      }
    }
  };

  const value: AuthContextValue = {
    user,

    isAuthenticated: Boolean(user),

    isLoading,

    login,

    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================================================
   Hook
   ========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
