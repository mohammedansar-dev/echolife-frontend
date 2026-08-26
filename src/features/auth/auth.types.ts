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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  preferredLanguage: string;
}

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

export interface CurrentUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  mfaVerified: boolean;
  active: boolean;
  tokenExpiresAt: string;
}

export interface AuthContextValue {
  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (email: string, password: string) => Promise<LoginResponse>;

  completeMfaLogin: (mfaToken: string, code: string) => Promise<LoginResponse>;

  logout: () => void | Promise<void>;
}

/* =========================================================
   MFA ENROLLMENT RESPONSE
   Backend:
   POST /api/v1/auth/mfa/enroll
   ========================================================= */

export interface MfaEnrollResponse {
  otpauthUri: string;
}
