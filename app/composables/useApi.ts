// app/composables/useApi.ts
// Central API wrapper.
// Automatically injects JWT Authorization header from localStorage.
// Typed response via generics.
// Throws a structured ApiError on non-2xx responses.

import type { ApiResponse, ApiError } from "~/types/api";

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const baseURL = config.public.apiBase as string;

  /**
   * Use for SSR-safe data fetching inside setup() / pages.
   * Wraps useFetch with automatic auth headers.
   */
  function apiFetch<T>(
    path: string,
    options: Parameters<typeof useFetch>[1] = {},
  ) {
    return useFetch<ApiResponse<T>>(path, {
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : {}),
      },
      ...((options as Record<string, unknown>) || {}),
    });
  }

  /**
   * Use for imperative calls (form submissions, mutations).
   * Wraps $fetch with auth headers.
   */
  async function apiCall<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await $fetch<unknown>(path, {
        baseURL,
        headers: {
          "Content-Type": "application/json",
          ...(authStore.token
            ? { Authorization: `Bearer ${authStore.token}` }
            : {}),
        },
        ...((options as Record<string, unknown>) || {}),
      });
      return response as ApiResponse<T>;
    }
    catch (error: unknown) {
      const e = error as { data?: ApiError; status?: number };
      throw {
        message: e.data?.message ?? "An unexpected error occurred",
        errors: e.data?.errors ?? {},
        status: e.status ?? 500,
      } satisfies ApiError;
    }
  }

  return { apiFetch, apiCall };
}
