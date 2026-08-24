import api from "../../api/axios";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "./auth.types";

/* =========================================================
   REGISTER
   Backend:
   POST /api/auth/register
   ========================================================= */

export async function register(
  payload: RegisterRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/register", {
    name: payload.displayName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  return response.data;
}

/* =========================================================
   LOGIN
   Backend:
   POST /api/auth/login
   ========================================================= */

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  return response.data;
}

/* =========================================================
   CURRENT USER
   =========================================================
   Current backend does not expose /api/auth/me.
   ========================================================= */

export async function getCurrentUser() {
  return null;
}

/* =========================================================
   LOGOUT
   =========================================================
   Current backend does not expose a logout endpoint.
   ========================================================= */

export async function logout() {
  return;
}

/* =========================================================
   FORGOT PASSWORD
   =========================================================
   Kept as an export because ForgotPasswordPage imports it.

   The current backend does NOT expose:
   POST /api/auth/forgot-password

   Therefore we don't make a fake backend request.
   ========================================================= */

export async function forgotPassword(email: string) {
  void email;

  throw new Error("Forgot password is not available yet.");
}

/* =========================================================
   RESET PASSWORD
   =========================================================
   Kept as an export because ResetPasswordPage imports it.

   The current backend does NOT expose:
   POST /api/auth/reset-password
   ========================================================= */

export async function resetPassword(token: string, password: string) {
  void token;
  void password;

  throw new Error("Reset password is not available yet.");
}
