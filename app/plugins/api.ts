import type { CIRefreshResponse } from "~/types/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  let refreshPromise: Promise<string | null> | null = null;

  async function performRefresh(): Promise<string | null> {
    const { refreshToken, setTokens, clearTokens } = useAuthTokens();
    if (!refreshToken.value) return null;

    try {
      const res = await $fetch<CIRefreshResponse>("/auth/refresh", {
        baseURL: config.public.apiBase,
        method: "POST",
        body: { refresh_token: refreshToken.value },
      });
      setTokens({
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      });
      return res.data.access_token;
    }
    catch {
      clearTokens();
      return null;
    }
  }

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const { accessToken } = useAuthTokens();
      if (accessToken.value) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${accessToken.value}`);
        options.headers = headers;
      }
    },
    async onResponseError({ response, request, options }) {
      if (response.status !== 401) return;

      // De-dupe: if multiple requests 401 at once, only one refresh fires
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        // Retry the original request once with the fresh token
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        return $fetch(request, {
          ...options,
          headers,
        } as Parameters<typeof $fetch>[1]);
      }
      else {
        await navigateTo("/login");
      }
    },
  });

  return { provide: { api } };
});
