<script setup lang="ts">
const settingsStore = useSettingsStore();
const config = useRuntimeConfig();

// Dynamic <title> using org name from API, fallback to appName env var
useHead({
  titleTemplate: (titleChunk) => {
    const appName = settingsStore.org?.name ?? config.public.appName;
    return titleChunk ? `${titleChunk} — ${appName}` : appName;
  },
  link: computed(() =>
    settingsStore.org?.favicon
      ? [{ rel: "icon", type: "image/png", href: settingsStore.org.favicon }]
      : [],
  ),
  htmlAttrs: { lang: "en" },
});
</script>

<template>
  <div class="min-h-screen max-w-11xl bg-white text-slate-900">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
