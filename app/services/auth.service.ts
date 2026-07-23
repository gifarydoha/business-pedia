import type {
  AuthResult,
  CIAuthResponse,
  CISimpleResponse,
  CIVerifyOtpResponse,
  CIMeResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleLoginPayload,
} from "~/types/auth";
import type { User } from "~/types/user";

function mapCIResponse(res: CIAuthResponse): AuthResult {
  return {
    user: {
      id: String(res.data.user.id),
      name: res.data.user.name,
      email: res.data.user.email,
      phone: res.data.user.phone ?? "",
      role: res.data.user.role,
      avatar: res.data.user.avatar,
      emailVerified: res.data.user.email_verified,
      createdAt: res.data.user.created_at,
    },
    tokens: {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    },
  };
}

function mapCIUser(raw: CIAuthResponse["data"]["user"]): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? "",
    role: raw.role,
    avatar: raw.avatar,
    emailVerified: raw.email_verified,
    createdAt: raw.created_at,
  };
}

export function useAuthService() {
  const { $api } = useNuxtApp();
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  async function register(payload: RegisterPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>("/auth/register", {
      baseURL: base,
      method: "POST",
      body: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      },
    });
  }

  async function verifyOtp(payload: VerifyOtpPayload): Promise<CIVerifyOtpResponse> {
    return $fetch<CIVerifyOtpResponse>("/auth/verify-otp", {
      baseURL: base,
      method: "POST",
      body: {
        email: payload.email,
        otp: payload.otp,
        purpose: payload.purpose,
      },
    });
  }

  async function resendOtp(payload: ResendOtpPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>("/auth/resend-otp", {
      baseURL: base,
      method: "POST",
      body: { email: payload.email, purpose: payload.purpose },
    });
  }

  async function forgotPassword(payload: ForgotPasswordPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>("/auth/forgot-password", {
      baseURL: base,
      method: "POST",
      body: { email: payload.email },
    });
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>("/auth/reset-password", {
      baseURL: base,
      method: "POST",
      body: {
        email: payload.email,
        reset_token: payload.resetToken,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      },
    });
  }

  // ── Authenticated — $api (Bearer token auto-attached + auto-refreshed) ───────

  async function login(payload: LoginPayload): Promise<AuthResult> {
    const res = await $fetch<CIAuthResponse>("/auth/login", {
      baseURL: base,
      method: "POST",
      body: payload,
    });
    return mapCIResponse(res);
  }

  async function loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResult> {
    const res = await $fetch<CIAuthResponse>("/auth/google", {
      baseURL: base,
      method: "POST",
      body: { id_token: payload.idToken },
    });
    return mapCIResponse(res);
  }

  async function fetchUser(): Promise<User> {
    const res = await ($api as typeof $fetch)<CIMeResponse>("/auth/me");
    return mapCIUser(res.data.user);
  }

  async function logout(refreshToken: string): Promise<void> {
    try {
      await ($api as typeof $fetch)("/auth/logout", {
        method: "POST",
        body: { refresh_token: refreshToken },
      });
    }
    catch {
      // ignore — we clear local tokens regardless
    }
  }

  return {
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    login,
    loginWithGoogle,
    fetchUser,
    logout,
  };
}
