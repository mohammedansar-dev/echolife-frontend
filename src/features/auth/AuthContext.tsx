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

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* =========================================================
   STORAGE KEYS
========================================================= */

const AUTH_TOKEN_KEY = "echolife_auth_token";
const AUTH_USER_KEY = "echolife_auth_user";

/* =========================================================
   PROVIDER PROPS
========================================================= */

interface AuthProviderProps {
  children: ReactNode;
}

/* =========================================================
   CONVERT BACKEND USER
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
    mfaVerified: Boolean(response.mfaVerified),
    active: Boolean(response.active),
    tokenExpiresAt: response.tokenExpiresAt,
  };
}

/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({ children }: AuthProviderProps) {
  /* =======================================================
     INITIAL USER
  ======================================================= */

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

  /* =======================================================
     LOADING
  ======================================================= */

  const [isLoading, setIsLoading] = useState(true);

  /* =======================================================
     SAVE USER
  ======================================================= */

  const saveUser = (nextUser: User) => {
    setUser(nextUser);

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  /* =======================================================
     CLEAR SESSION
  ======================================================= */

  const clearSession = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setUser(null);
  };

  /* =======================================================
     REFRESH CURRENT USER
  ======================================================= */

  const refreshCurrentUser = async (): Promise<User> => {
    const response = await getCurrentUser();

    const convertedUser = convertCurrentUser(response);

    saveUser(convertedUser);

    return convertedUser;
  };

  /* =======================================================
     RESTORE SESSION
  ======================================================= */

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      /*
       * No JWT means the user is logged out.
       */
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        /*
         * Validate the stored JWT through /me.
         *
         * This also retrieves the latest MFA status.
         */
        await refreshCurrentUser();
      } catch (error) {
        console.error("EchoLife session restoration failed:", error);

        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
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

    /* =====================================================
       MFA REQUIRED
       
       IMPORTANT:
       
       Do NOT create an authenticated session here.
       
       LoginPage should redirect to /mfa using the
       temporary mfaToken returned by the backend.
    ===================================================== */

    if (response.mfaRequired) {
      return response;
    }

    /* =====================================================
       NORMAL LOGIN WITHOUT MFA
    ===================================================== */

    if (!response.accessToken) {
      throw new Error("The backend did not return an access token.");
    }

    /*
     * Store JWT only after successful authentication.
     */
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

    /*
     * Get authoritative user information.
     */
    await refreshCurrentUser();

    return response;
  };

  /* =======================================================
     COMPLETE MFA LOGIN
     
     Login
       ↓
     mfaToken
       ↓
     verification code
       ↓
     final JWT
  ======================================================= */

  const completeMfaLogin = async (
    mfaToken: string,
    code: string,
  ): Promise<LoginResponse> => {
    const response = await verifyMfa(mfaToken, code);

    /*
     * MFA verification must return the final JWT.
     */
    if (!response.accessToken) {
      throw new Error(
        "MFA verification succeeded, but the backend did not return an access token.",
      );
    }

    /*
     * Store final authenticated JWT.
     */
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

    /*
     * Get the authoritative authenticated user.
     *
     * This should now contain:
     *
     * mfaVerified: true
     */
    await refreshCurrentUser();

    return response;
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      /*
       * Even if backend logout fails,
       * local authentication must be removed.
       */
      console.warn("EchoLife logout request failed:", error);
    } finally {
      clearSession();
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

    refreshCurrentUser,

    logout,
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================================================
   useAuth
========================================================= */

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
