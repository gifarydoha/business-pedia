// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Do not run auth middleware during static site generation
  if (import.meta.prerender) {
    return;
  }

  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.initAuth();
  }
  if (!authStore.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
