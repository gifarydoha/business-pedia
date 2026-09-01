import { $fetch } from "ofetch";
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
  QuickRegisterPayload,
  DecodeRkResponse,
  ChangePasswordPayload,
  SetPasswordPayload,
} from "~/types/auth";
import type { User, RoleItem } from "~/types/user";
import { toFormData } from "../utils/toFormData";

function processRole(rawRole: RoleItem[]): RoleItem[] {
  if (!rawRole || rawRole.length === 0 || (rawRole.length === 1 && rawRole[0]?.role_alias === "default-user")) {
    return [{
      role_name: "Author",
      role_alias: "author",
      role_parent_name: "System User",
    }];
  }
  return rawRole;
}

function mapCIResponse(res: CIAuthResponse): AuthResult {
  return {
    user: {
      id: String(res.data.user.id),
      name: res.data.user.name,
      email: res.data.user.email,
      phone: res.data.user.phone ?? "",
      role: processRole(res.data.user.role),
      avatar: res.data.user.avatar,
      emailVerified: res.data.user.email_verified,
      isDefaultPassword: !!res.data.user.is_default_password,
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
    role: processRole(raw.role),
    avatar: raw.avatar,
    emailVerified: raw.email_verified,
    isDefaultPassword: !!raw.is_default_password,
    createdAt: raw.created_at,
  };
}

export function useAuthService() {
  const { $api } = useNuxtApp();
  const config = useRuntimeConfig();
  const base = config.public.apiBase as string;
  // console.log(base);

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
    const res = await $fetch<CIAuthResponse>("/ciaur/secure_api/password_login", {
      baseURL: base,
      method: "POST",
      body: payload,
    });
    return mapCIResponse(res);
  }

  async function loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResult> {
    const res = await $fetch<CIAuthResponse>("/ciaur/secure_api/google", {
      baseURL: base,
      method: "POST",
      body: { id_token: payload.idToken },
    });
    return mapCIResponse(res);
  }

  async function decodeRk(rk: string): Promise<DecodeRkResponse> {
    const formData = new FormData();
    formData.append("rk", rk);

    return $fetch<DecodeRkResponse>("/ciaur/secure_api/decode", {
      baseURL: base,
      method: "POST",
      body: formData,
    });
  }

  async function quickRegister(payload: QuickRegisterPayload): Promise<AuthResult> {
    const res = await $fetch<CIAuthResponse>("/ciaur/secure_api/quick_account", {
      baseURL: base,
      method: "POST",
      body: toFormData(payload),
    });
    return mapCIResponse(res);
  }

  async function fetchUser(): Promise<User> {
    const res = await ($api as typeof $fetch)<CIMeResponse>("/auth/me");
    return mapCIUser(res.data.user);
  }

  async function logout(refreshToken: string): Promise<void> {
    try {
      await ($api as typeof $fetch)("/ciaur/secure_api/logout", {
        method: "POST",
        body: { refresh_token: refreshToken },
      });
    }
    catch {
      // ignore — we clear local tokens regardless
    }
  }

  async function changePassword(payload: ChangePasswordPayload, userId: string): Promise<CISimpleResponse> {
    return ($api as typeof $fetch)<CISimpleResponse>(`/ciaur/secure_api/change_password/${userId}`, {
      method: "POST",
      body: toFormData(payload),
    });
  }

  async function setPassword(payload: SetPasswordPayload, userId: string): Promise<CISimpleResponse> {
    return ($api as typeof $fetch)<CISimpleResponse>(`/ciaur/secure_api/set_password/${userId}`, {
      method: "POST",
      body: toFormData(payload),
    });
  }

  return {
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    login,
    loginWithGoogle,
    decodeRk,
    quickRegister,
    fetchUser,
    logout,
    changePassword,
    setPassword,
  };
}
