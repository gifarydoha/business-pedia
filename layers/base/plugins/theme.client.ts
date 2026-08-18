// app/plugins/theme.client.ts
// Runs only on the CLIENT after hydration.
// Injects dynamic brand colors from the API as CSS custom properties on <html>.
// Falls back to defaults if settings haven't loaded yet.

export default defineNuxtPlugin(() => {
  const settingsStore = useSettingsStore();

  const config = useRuntimeConfig();

  // Apply theme colors immediately if already loaded (SSR hydrated)
  function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", settingsStore.primaryColor);
    root.style.setProperty("--color-secondary", settingsStore.secondaryColor);

    if (settingsStore.radiusBase) {
      root.style.setProperty("--radius", settingsStore.radiusBase);
    }

    const shadowMap: Record<string, string> = {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    };
    if (settingsStore.shadowStyle && shadowMap[settingsStore.shadowStyle]) {
      root.style.setProperty("--shadow-card", shadowMap[settingsStore.shadowStyle] as string);
    }

    const spacingMap: Record<string, string> = {
      compact: "2rem",
      normal: "4rem",
      spacious: "6rem",
    };
    if (settingsStore.spacing && spacingMap[settingsStore.spacing]) {
      root.style.setProperty("--space-section", spacingMap[settingsStore.spacing] as string);
    }

    root.setAttribute("data-theme", settingsStore.colorMode ?? "light");

    const faviconPath = settingsStore.org?.favicon;
    if (faviconPath) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconPath.startsWith("http")
        ? faviconPath
        : `${config.public.apiBase}${faviconPath}`;
    }
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
