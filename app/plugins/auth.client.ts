// app/plugins/auth.client.ts
// Runs only on the CLIENT after hydration.
// Restores JWT token and user from localStorage on every page load.

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.restoreFromStorage();
});
