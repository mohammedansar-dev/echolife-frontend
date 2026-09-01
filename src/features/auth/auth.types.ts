/* =========================================================
   USER
========================================================= */

export interface User {
  id: string;

  email: string;

  displayName: string;

  role: string;

  status: string;

  mfaVerified?: boolean;

  active?: boolean;

  tokenExpiresAt?: string;
}

/* =========================================================
   LOGIN REQUEST
========================================================= */

export interface LoginRequest {
  email: string;

  password: string;
}

/* =========================================================
   REGISTER REQUEST
========================================================= */

export interface RegisterRequest {
  displayName: string;

  email: string;

  password: string;

  dateOfBirth: string;

  preferredLanguage: string;
}

/* =========================================================
   LOGIN RESPONSE
========================================================= */

export interface LoginResponse {
  mfaRequired: boolean;

  mfaToken?: string | null;

  accessToken?: string;

  userId?: number | string;

  name?: string;

  email?: string;

  role?: string;

  accessTokenExpiresAt?: string;

  message?: string;
}

/* =========================================================
   CURRENT USER
========================================================= */

export interface CurrentUser {
  userId: string;

  email: string;

  name: string;

  role: string;

  mfaVerified: boolean;

  active: boolean;

  tokenExpiresAt: string;
}

/* =========================================================
   MFA ENROLLMENT
========================================================= */

export interface MfaEnrollResponse {
  otpauthUri: string;
}

/* =========================================================
   AUTH CONTEXT
========================================================= */

export interface AuthContextValue {
  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (email: string, password: string) => Promise<LoginResponse>;

  completeMfaLogin: (mfaToken: string, code: string) => Promise<LoginResponse>;

  refreshCurrentUser: () => Promise<User>;

  logout: () => void | Promise<void>;
}
