// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (import.meta.client) {
    authStore.restoreFromStorage();
  }
  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }
});
