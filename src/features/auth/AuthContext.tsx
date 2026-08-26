import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
  verifyMfa,
} from "./auth.api";

import type { AuthContextValue, LoginResponse, User } from "./auth.types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = "echolife_auth_token";
const AUTH_USER_KEY = "echolife_auth_user";

interface AuthProviderProps {
  children: ReactNode;
}

/* =========================================================
   Convert backend /me response → frontend User
   ========================================================= */

function convertCurrentUser(
  response: Awaited<ReturnType<typeof getCurrentUser>>,
): User {
  return {
    id: String(response.userId),
    email: response.email,
    displayName: response.name,
    role: response.role,
    status: response.active ? "active" : "inactive",
    mfaVerified: response.mfaVerified,
    active: response.active,
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
     RESTORE AUTHENTICATION ON APPLICATION STARTUP
     ======================================================= */

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        const convertedUser = convertCurrentUser(currentUser);

        setUser(convertedUser);

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(convertedUser));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  /* =======================================================
     NORMAL LOGIN
     ======================================================= */

  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    const response = await loginApi({
      email,
      password,
    });

    /*
     * MFA required.
     *
     * Do NOT authenticate the user yet.
     * LoginPage will redirect to /mfa.
     */
    if (response.mfaRequired) {
      return response;
    }

    if (!response.accessToken) {
      throw new Error("The backend did not return an access token.");
    }

    /*
     * Store JWT.
     */
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

    /*
     * Fetch authoritative user.
     */
    const currentUser = await getCurrentUser();

    const loggedInUser = convertCurrentUser(currentUser);

    setUser(loggedInUser);

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));

    return response;
  };

  /* =======================================================
     MFA LOGIN
     ======================================================= */

  const completeMfaLogin = async (
    mfaToken: string,
    code: string,
  ): Promise<LoginResponse> => {
    /*
     * Verify the temporary MFA challenge.
     */
    const response = await verifyMfa(mfaToken, code);

    /*
     * MFA verification must return
     * the final access token.
     */
    if (!response.accessToken) {
      throw new Error(
        "MFA verification succeeded, but the backend did not return an access token.",
      );
    }

    /*
     * Store final JWT.
     */
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

    /*
     * Get authoritative user information.
     */
    const currentUser = await getCurrentUser();

    const loggedInUser = convertCurrentUser(currentUser);

    /*
     * THIS IS THE IMPORTANT PART.
     *
     * ProtectedRoute uses AuthContext.user.
     */
    setUser(loggedInUser);

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));

    return response;
  };

  /* =======================================================
     LOGOUT
     ======================================================= */

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      /*
       * Even if backend logout fails,
       * local authentication must be cleared.
       */
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      setUser(null);
    }
  };

  /* =======================================================
     CONTEXT VALUE
     ======================================================= */

  const value: AuthContextValue = {
    user,

    isAuthenticated: Boolean(user),

    isLoading,

    login,

    completeMfaLogin,

    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================================================
   HOOK
   ========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
