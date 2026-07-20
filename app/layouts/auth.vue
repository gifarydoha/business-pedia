<!-- app/layouts/auth.vue -->
<script setup lang="ts">
// Layout for Login and Register pages.
// Displays a centered card with a minimal header.
const settingsStore = useSettingsStore();
const { buildImageUrl } = useImageUrl();
const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
    <div class="mb-8">
      <NuxtLink to="/">
        <NuxtImg
          v-if="logo"
          :src="logo"
          alt="Logo"
          class="h-12 w-auto"
        />
      </NuxtLink>
    </div>

    <div class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
      <slot />
    </div>
  </div>
</template>
