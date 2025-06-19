export interface User {
  id: string;
  email: string;
  fullName: string | null;
  location: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  usagePurpose: string | null;
  industries: string[] | null;
  referralSource: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  emailVerificationRequired: boolean;
  onboardingRequired: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface OnboardingData {
  phoneNumber: string;
  usagePurpose: string;
  industries: string[];
  referralSource: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
  emailVerificationRequired?: boolean;
  onboardingRequired?: boolean;
}