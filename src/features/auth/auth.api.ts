import api from "../../api/axios";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  MfaEnrollResponse,
} from "./auth.types";

/* =========================================================
   REGISTER
   Backend:
   POST /api/v1/auth/register
   ========================================================= */

export async function register(payload: RegisterRequest): Promise<void> {
  await api.post("/api/v1/auth/register", {
    name: payload.displayName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    dateOfBirth: payload.dateOfBirth,
    preferredLanguage: payload.preferredLanguage,
  });
}

/* =========================================================
   LOGIN
   Backend:
   POST /api/v1/auth/login
   ========================================================= */

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/v1/auth/login", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  return response.data;
}

/* =========================================================
   CURRENT USER
   Backend:
   GET /api/v1/auth/me
   ========================================================= */

export async function getCurrentUser() {
  const response = await api.get("/api/v1/auth/me");

  return response.data;
}

/* =========================================================
   LOGOUT
   Backend:
   POST /api/v1/auth/logout
   ========================================================= */

export async function logout(): Promise<void> {
  await api.post("/api/v1/auth/logout");
}

/* =========================================================
   MFA VERIFY
   Backend:
   POST /api/v1/auth/mfa/verify
   ========================================================= */

export async function verifyMfa(
  mfaToken: string,
  code: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/v1/auth/mfa/verify", {
    mfaToken,
    code,
  });

  return response.data;
}

/* =========================================================
   MFA ENROLLMENT
   Backend:
   POST /api/v1/auth/mfa/enroll
   ========================================================= */

export async function enrollMfa(): Promise<MfaEnrollResponse> {
  const response = await api.post<MfaEnrollResponse>("/api/v1/auth/mfa/enroll");

  return response.data;
}

/* =========================================================
   MFA CONFIRM
   Backend:
   POST /api/v1/auth/mfa/confirm
   ========================================================= */

export async function confirmMfa(code: string): Promise<void> {
  await api.post("/api/v1/auth/mfa/confirm", {
    code,
  });
}

/* =========================================================
   FORGOT PASSWORD
   =========================================================
   Basavaraj backend does not currently expose this endpoint.
   ========================================================= */

export async function forgotPassword(_email: string): Promise<void> {
  throw new Error("Forgot password is not available yet.");
}

/* =========================================================
   RESET PASSWORD
   =========================================================
   Basavaraj backend does not currently expose this endpoint.
   ========================================================= */

export async function resetPassword(
  _token: string,
  _password: string,
): Promise<void> {
  throw new Error("Reset password is not available yet.");
}
