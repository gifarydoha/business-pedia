// app/middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.initAuth();
  }
  if (authStore.isAuthenticated) {
    return navigateTo("/dashboard");
  }
});
