// app/plugins/theme.client.ts
// Runs only on the CLIENT after hydration.
// Injects dynamic brand colors from the API as CSS custom properties on <html>.
// Falls back to defaults if settings haven't loaded yet.

export default defineNuxtPlugin(() => {
  const settingsStore = useSettingsStore();

  // Apply theme colors immediately if already loaded (SSR hydrated)
  function applyTheme() {
    document.documentElement.style.setProperty(
      "--color-primary",
      settingsStore.primaryColor,
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      settingsStore.secondaryColor,
    );
  }

  // Apply on load
  if (settingsStore.isLoaded) {
    applyTheme();
  }

  // Watch for changes if settings load asynchronously
  watch(
    () => settingsStore.isLoaded,
    (loaded) => {
      if (loaded) applyTheme();
    },
  );
});
