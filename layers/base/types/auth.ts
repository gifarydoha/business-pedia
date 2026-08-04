import type { User, UserRole } from "~/types/user";

export type { User, UserRole };

export interface AuthTokents {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokents;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose: "register" | "reset_password";
}

export interface ResendOtpPayload {
  email: string;
  purpose: "register" | "reset_password";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  password: string;
  passwordConfirmation: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

// ─── Raw CodeIgniter response shapes ───────────────────────────────────────────
// These are the ONLY interfaces that change on NestJS migration.

export interface CIAuthResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      role: UserRole;
      avatar?: string;
      email_verified: boolean;
      created_at: string;
    };
    access_token: string;
    refresh_token: string;
  };
}

export interface CIRefreshResponse {
  status: boolean;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface CISimpleResponse {
  status: boolean;
  message: string;
}

// OTP verify for reset_password purpose returns a reset_token inside data
export interface CIVerifyOtpResponse {
  status: boolean;
  message: string;
  data?: {
    reset_token?: string;
  };
}

export interface CIMeResponse {
  status: boolean;
  data: {
    user: CIAuthResponse["data"]["user"];
  };
}
