// app/plugins/settings.server.ts
// Runs on the SERVER during SSR.
// Fetches site settings once, hydrates state to client via Pinia SSR.
// This means the browser receives a fully populated store on first paint.

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const path = event?.path ?? "unknown";

  // Avoid recursive $fetch('/api/settings') → plugin → loadSettings loops on API routes
  if (path.startsWith("/api/")) return;

  const settingsStore = useSettingsStore();
  if (!settingsStore.isLoaded) {
    await settingsStore.loadSettings();
  }
});
