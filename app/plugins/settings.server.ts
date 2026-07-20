// app/plugins/settings.server.ts
// Runs on the SERVER during SSR only.
// Fetches site settings via the Pinia store, so the client gets a
// fully populated store on first paint.

export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const path = event?.path ?? "";

  // Skip API routes — no need to load settings for internal API calls
  if (path.startsWith("/api/")) return;

  const settingsStore = useSettingsStore();
  if (!settingsStore.isLoaded) {
    await settingsStore.loadSettings();
    console.log("[settings plugin] Settings loaded on server for:", path);
  }
});
