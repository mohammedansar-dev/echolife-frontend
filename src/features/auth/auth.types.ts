export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  userId?: number | string;
  name?: string;
  email?: string;
  role?: string;
  message?: string;
}

export interface AuthContextValue {
  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (email: string, password: string) => Promise<LoginResponse>;

  logout: () => void | Promise<void>;
}
