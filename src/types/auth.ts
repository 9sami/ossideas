export interface User {
  id: string;
  email: string;
  fullName: string | null;
  location: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  emailVerificationRequired: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
  emailVerificationRequired?: boolean;
}