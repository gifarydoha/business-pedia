import { defineStore } from "pinia";
import { navigateTo } from "#imports";
import { useAuthTokens } from "~~/layers/base/composables/useAuthTokens";
import type { User } from "~~/layers/base/types/user";
import type {
  CISimpleResponse,
  LoginPayload,
  RegisterPayload,
  GoogleLoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  QuickRegisterPayload,
} from "~~/layers/base/types/auth";
import { useAuthService } from "~~/layers/base/services/auth.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    resetToken: null as string | null, // Temporary reset_token — held only while user is on /reset-password, cleared on submit
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isEmailVerified: (state) => !!state.user?.emailVerified,
    // Role-based getters — required by middleware/role.ts
    userRoles: (state) => state.user?.role?.map((r) => r.role_alias) ?? [],
    userRoleNames: (state) => state.user?.role?.map((r) => r.role_name).join(", ") ?? "",
    isAdmin: (state) => state.user?.role?.some((r) => ["super-admin", "admin"].includes(r.role_alias)) ?? false,
    isAuthor: (state) => state.user?.role?.some((r) => ["super-admin", "admin", "author"].includes(r.role_alias)) ?? false,
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    // ── Pre-login actions (no tokens involved)
    async register(payload: RegisterPayload) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        return await authService.register(payload);
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Registration failed.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async verifyOtp(payload: VerifyOtpPayload) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        const res = await authService.verifyOtp(payload);
        if (payload.purpose === "reset_password" && res.data?.reset_token) {
          this.resetToken = res.data.reset_token;
        }
        return res;
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Invalid or expired code.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async resendOtp(payload: ResendOtpPayload) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        return await authService.resendOtp(payload);
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Could not resend code.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async forgotPassword(payload: ForgotPasswordPayload) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        return await authService.forgotPassword(payload);
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Could not send reset code.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async resetPassword(payload: ResetPasswordPayload) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        const res = await authService.resetPassword(payload);
        this.resetToken = null; // clear after use — one-time token
        return res;
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Could not reset password.";
        throw err;
      }
      finally { this.loading = false; }
    },

    // ── Authenticated actions

    async login(payload: LoginPayload) {
      const authService = useAuthService();
      const { setTokens, userCookie } = useAuthTokens();
      this.loading = true;
      this.error = null;
      try {
        const result = await authService.login(payload);
        setTokens(result.tokens);
        this.user = result.user;
        // Persist user in cookie — initAuth() can hydrate from here without a network call
        userCookie.value = JSON.stringify(result.user);
        return result;
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Login failed. Please check your credentials.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async loginWithGoogle(payload: GoogleLoginPayload) {
      const authService = useAuthService();
      const { setTokens, userCookie } = useAuthTokens();
      this.loading = true;
      this.error = null;
      try {
        const result = await authService.loginWithGoogle(payload);
        setTokens(result.tokens);
        this.user = result.user;
        userCookie.value = JSON.stringify(result.user);
        return result;
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Google sign-in failed.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async decodeRk(rk: string) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;
      try {
        return await authService.decodeRk(rk);
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Failed to decode link.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async quickRegister(payload: QuickRegisterPayload) {
      const authService = useAuthService();
      const { setTokens, userCookie } = useAuthTokens();
      this.loading = true;
      this.error = null;
      try {
        const result = await authService.quickRegister(payload);
        setTokens(result.tokens);
        this.user = result.user;
        userCookie.value = JSON.stringify(result.user);
        return result;
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Registration failed.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async initAuth() {
      if (this.initialized) return;
      const { accessToken, refreshToken, userCookie } = useAuthTokens();

      const userCookieVal = userCookie.value;

      // Fast path — hydrate from cookie (no network call)
      if (userCookieVal) {
        try {
          this.user = typeof userCookieVal === "string" ? JSON.parse(userCookieVal) : userCookieVal;
        }
        catch { this.user = null; }
      }

      // Slow path — cookie missing or invalid but tokens present: fetch fresh user from server
      if (!this.user && (accessToken.value || refreshToken.value)) {
        const authService = useAuthService();
        try {
          this.user = await authService.fetchUser();
          userCookie.value = JSON.stringify(this.user);
        }
        catch (err: unknown) {
          console.error("[Store] fetchUser FAILED:", err);
          this.user = null;
        }
      }

      this.initialized = true;
    },

    async logout() {
      const authService = useAuthService();
      const { refreshToken, clearTokens } = useAuthTokens();
      const refreshTokenVal = refreshToken.value;
      if (refreshTokenVal) {
        await authService.logout(refreshTokenVal);
      }
      clearTokens();
      this.user = null;
      this.initialized = false;
      await navigateTo("/login");
    },
  },
});
