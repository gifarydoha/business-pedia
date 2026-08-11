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
    userRole: (state) => state.user?.role ?? null,
    isAdmin: (state) => state.user?.role === "admin",
    isEditor: (state) => ["admin", "editor"].includes(state.user?.role ?? ""),
    isAuthor: (state) => ["admin", "editor", "author"].includes(state.user?.role ?? ""),
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
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? "Quick registration failed.";
        throw err;
      }
      finally { this.loading = false; }
    },

    async initAuth() {
      if (this.initialized) return;
      const { accessToken, userCookie } = useAuthTokens();

      const userCookieVal = userCookie.value;
      // Fast path — hydrate from cookie (no network call)
      if (userCookieVal) {
        try {
          this.user = JSON.parse(userCookieVal) as User;
        }
        catch { this.user = null; }
      }
      // Slow path — cookie missing but access token present: fetch fresh user from server
      else if (accessToken.value) {
        const authService = useAuthService();
        try {
          this.user = await authService.fetchUser();
          userCookie.value = JSON.stringify(this.user);
        }
        catch { this.user = null; }
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
