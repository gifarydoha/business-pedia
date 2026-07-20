// app/stores/auth.ts
// JWT authentication store.
// Stores token and user in localStorage (client-only).
// Auth endpoints TBD — configure via NUXT_PUBLIC_AUTH_BASE when ready.

import type { User } from "~/types/user";

const TOKEN_KEY = "bp_jwt_token";
const USER_KEY = "bp_user";

export const useAuthStore = defineStore("auth", () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  // ─── Getters ─────────────────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role ?? null);
  const isAdmin = computed(() => userRole.value === "admin");
  const isEditor = computed(() => ["admin", "editor"].includes(userRole.value ?? ""));
  const isAuthor = computed(() => ["admin", "editor", "author"].includes(userRole.value ?? ""));

  // ─── Actions ─────────────────────────────────────────────────────────────
  function restoreFromStorage() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) token.value = savedToken;
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser) as User;
        }
        catch {
          // Ignore corrupt data
        }
      }
    }
  }

  async function login(email: string, password: string) {
    const config = useRuntimeConfig();
    // TODO: Replace with real auth endpoint when available
    // e.g. `${config.public.apiBase}/auth/login`
    const response = await $fetch<{ token: string; user: User }>(
      `${config.public.apiBase}/auth/login`,
      { method: "POST", body: { email, password } },
    );

    token.value = response.token;
    user.value = response.user;

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  }

  async function register(payload: { name: string; email: string; password: string }) {
    const config = useRuntimeConfig();
    // TODO: Replace with real auth endpoint when available
    return await $fetch<{ token: string; user: User }>(
      `${config.public.apiBase}/auth/register`,
      { method: "POST", body: payload },
    );
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    return navigateTo("/login");
  }

  return {
    token,
    user,
    isLoggedIn,
    userRole,
    isAdmin,
    isEditor,
    isAuthor,
    restoreFromStorage,
    login,
    register,
    logout,
  };
});
