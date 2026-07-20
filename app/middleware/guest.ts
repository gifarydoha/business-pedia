// app/middleware/guest.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (import.meta.client) {
    authStore.restoreFromStorage();
  }
  if (authStore.isLoggedIn) {
    return navigateTo("/dashboard");
  }
});
