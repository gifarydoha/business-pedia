// app/stores/settings.ts
// Global site settings store.
// Fetches from /api/settings (our Nuxt server proxy) once at app boot,
// then provides typed getters to all components.

import type { AppSettings } from "#layers/base/types/settings";
import type { SettingsApiResponse } from "#layers/base/types/api";

export const useSettingsStore = defineStore("settings", () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const settings = ref<AppSettings | null>(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ─── Getters ─────────────────────────────────────────────────────────────
  const org = computed(() => settings.value?.org ?? null);
  // ------------------ future implementation for dynamic colors ----------------------------
  // const primaryColor = computed(
  //   () => settings.value?.primaryColor ?? "#266B88",
  // );
  // const secondaryColor = computed(
  //   () => settings.value?.secondaryColor ?? "#F7700B",
  // );
  const mainMenu = computed(
    () => (settings.value?.widgets.menu?.main_menu as any[]) ?? [],
  );
  const aboutContent = computed(() => settings.value?.aboutContent ?? "");
  const socialMedia = computed(() => settings.value?.socialMedia ?? {});

  const radiusBase = computed(() => settings.value?.radiusBase ?? null);
  const shadowStyle = computed(() => settings.value?.shadowStyle ?? null);
  const colorMode = computed(() => settings.value?.colorMode ?? "light");
  const spacing = computed(() => settings.value?.spacing ?? null);

  /** All slider items across all slider blocks, ordered by sort_order */
  const sliderItems = computed(() => {
    const sliderMap = settings.value?.widgets.slider ?? {};
    return (Object.values(sliderMap) as any[])
      .filter((s) => s.status === "3")
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .flatMap((s) => s.items);
  });

  /** Home page block sections, active only, ordered by sort_order */
  const homePageBlocks = computed(() => {
    const blockMap = settings.value?.widgets.home_page_block ?? {};
    return (Object.values(blockMap) as any[])
      .filter((b) => b.status === "1")
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
  });

  const homeSeoMeta = computed(() => settings.value?.homeSeoMeta ?? null);

  // ─── CFP Getters ─────────────────────────────────────────────────────────
  const cfp = computed(() => settings.value?.cfpSettings ?? ({} as any));

  const cfpHero = computed(() => cfp.value);
  const cfpDates = computed(() => cfp.value?.dates ?? []);
  const cfpTracks = computed(() => cfp.value?.tracks ?? []);
  const cfpThemes = computed(() => cfp.value?.themes ?? []);
  const cfpPrinciples = computed(() => cfp.value?.principles ?? []);
  const cfpContacts = computed(() => cfp.value?.contacts ?? []);
  const cfpNextSteps = computed(() => cfp.value?.nextSteps ?? []);

  // ─── Actions ─────────────────────────────────────────────────────────────
  async function loadSettings() {
    if (isLoaded.value || isLoading.value) return;
    isLoading.value = true;
    error.value = null;

    try {
      const config = useRuntimeConfig();
      const raw = await $fetch<SettingsApiResponse>(
        `${config.public.apiBase}/website/website_api/settings` as string,
        {
          query: {
            access_key: config.public.apiAccessKey,
          },
          timeout: 8000,
        },
      );

      const orgInfo = raw?.sid_site?.app_setting?.organization_information ?? null;
      // primaryColor: raw?.sid_site?.layout_primary_color ?? "#266B88",
      // secondaryColor: raw?.sid_site?.layout_secondary_color ?? "#F7700B",
      settings.value = {
        sid: raw?.sid ?? null,
        org: orgInfo,
        socialMedia: raw?.sid_site?.app_setting?.social_media ?? {},
        defaultLanguage: raw?.sid_site?.default_language_code ?? "en",
        aboutContent: raw?.sid_site?.about_content ?? "",
        widgets: raw?.widgets ?? {},
        homeSeoMeta: raw?.seo_meta ?? null,
        homePageContent: raw?.page_content ?? null,
        radiusBase: raw?.sid_site?.layout_radius ?? "0.625rem",
        shadowStyle: raw?.sid_site?.layout_shadow_style ?? "md",
        colorMode: raw?.sid_site?.layout_color_mode ?? "light",
        spacing: raw?.sid_site?.layout_spacing ?? "normal",
      };

      isLoaded.value = true;
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string }; message?: string };
      error.value
        = err.data?.statusMessage
          ?? err.message
          ?? "Failed to load site settings.";
      // console.error("[settings store] Failed to load settings:", error.value);
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

  // primaryColor,
  // secondaryColor,
  return {
    // State
    settings,
    isLoaded,
    isLoading,
    error,
    // Getters
    org,
    mainMenu,
    aboutContent,
    socialMedia,
    sliderItems,
    homePageBlocks,
    homeSeoMeta,
    radiusBase,
    shadowStyle,
    colorMode,
    spacing,
    cfpHero,
    cfpDates,
    cfpTracks,
    cfpThemes,
    cfpPrinciples,
    cfpContacts,
    cfpNextSteps,
    // Actions
    loadSettings,
    reset,
  };
});
