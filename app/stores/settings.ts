// app/stores/settings.ts
// Global site settings store.
// Fetches from /api/settings (our Nuxt server proxy) once at app boot,
// then provides typed getters to all components.

import type { AppSettings } from "~/types/settings";
import type { SettingsApiResponse } from "~/types/api";

export const useSettingsStore = defineStore("settings", () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const settings = ref<AppSettings | null>(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ─── Getters ─────────────────────────────────────────────────────────────
  const org = computed(() => settings.value?.org ?? null);
  const primaryColor = computed(() => settings.value?.primaryColor ?? "#266B88");
  const secondaryColor = computed(() => settings.value?.secondaryColor ?? "#F7700B");
  const mainMenu = computed(() => settings.value?.widgets.menu?.main_menu ?? []);
  const aboutContent = computed(() => settings.value?.aboutContent ?? "");
  const socialMedia = computed(() => settings.value?.socialMedia ?? {});

  /** All slider items across all slider blocks, ordered by sort_order */
  const sliderItems = computed(() => {
    const sliderMap = settings.value?.widgets.slider ?? {};
    return Object.values(sliderMap)
      .filter((s) => s.status === "1")
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .flatMap((s) => s.items);
  });

  /** Home page block sections, active only, ordered by sort_order */
  const homePageBlocks = computed(() => {
    const blockMap = settings.value?.widgets.home_page_block ?? {};
    return Object.values(blockMap)
      .filter((b) => b.status === "1")
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
  });

  const homeSeoMeta = computed(() => settings.value?.homeSeoMeta ?? null);

  // ─── Actions ─────────────────────────────────────────────────────────────
  async function loadSettings() {
    if (isLoaded.value || isLoading.value) return;
    isLoading.value = true;
    error.value = null;

    try {
      console.log("Starting loadSettings");
      // Always use $fetch('/api/settings') — on the server, Nuxt routes this to
      // the Nitro handler internally (no real HTTP round-trip). Calling
      // fetchSettingsFromApi() directly from a Pinia store fails because stores
      // run in Vue/app context, not Nitro context, where the auto-import is undefined.
      const raw = await $fetch<SettingsApiResponse>("/api/settings");
      const orgInfo = raw.sid_site.app_setting.organization_information;

      settings.value = {
        sid: raw.sid,
        org: orgInfo,
        socialMedia: raw.sid_site.app_setting.social_media ?? {},
        primaryColor: raw.sid_site.layout_primary_color ?? "#266B88",
        secondaryColor: raw.sid_site.layout_secondary_color ?? "#F7700B",
        defaultLanguage: raw.sid_site.default_language_code ?? "en",
        aboutContent: raw.sid_site.about_content ?? "",
        widgets: raw.widgets,
        homeSeoMeta: raw.seo_meta,
        homePageContent: raw.page_content,
      };

      isLoaded.value = true;
      console.log("Finished loadSettings");
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string }; message?: string };
      error.value = err.data?.statusMessage ?? err.message ?? "Failed to load site settings.";
      console.error("[settings store] Failed to load settings:", error.value);
    }
    finally {
      isLoading.value = false;
    }
  }

  function reset() {
    settings.value = null;
    isLoaded.value = false;
    isLoading.value = false;
    error.value = null;
  }

  return {
    // State
    settings,
    isLoaded,
    isLoading,
    error,
    // Getters
    org,
    primaryColor,
    secondaryColor,
    mainMenu,
    aboutContent,
    socialMedia,
    sliderItems,
    homePageBlocks,
    homeSeoMeta,
    // Actions
    loadSettings,
    reset,
  };
});
