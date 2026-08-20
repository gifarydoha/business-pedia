<script setup lang="ts">
import type { WidgetItem } from "~~/layers/base/types/api";

const settingsStore = useSettingsStore();

const FALLBACK_MAIN_MENU = [
  { id: "fallback-1", label: "Post", url: "/" },
  { id: "fallback-2", label: "About", url: "/about" },
  { id: "fallback-3", label: "Videos", url: "/videos" },
  { id: "fallback-4", label: "Images", url: "/images" },
] as WidgetItem[];

const mainMenu = computed(() => {
  if (settingsStore.mainMenu && settingsStore.mainMenu.length > 0) {
    return settingsStore.mainMenu;
  }
  return FALLBACK_MAIN_MENU;
});

const getHref = (item: { url?: string; link?: string }) => {
  const target = item.url || item.link;
  if (!target) return "/";
  return target.startsWith("/") ? target : `/${target}`;
};
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
    <nav class="container mx-auto flex h-16 items-center justify-center px-4">
      <ul class="flex items-center gap-6">
        <li
          v-for="item in mainMenu"
          :key="item.id"
          class="group relative"
        >
          <!-- Item with children = dropdown -->
          <template v-if="item.children?.length">
            <button class="nav-link flex cursor-pointer items-center gap-1">
              {{ item.label }}
              <UIcon
                name="i-heroicons-chevron-down"
                class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
              />
            </button>
            <ul
              class="invisible absolute top-full left-1/2 z-50 mt-2 w-48 -translate-x-1/2 rounded-lg border border-gray-100
                       bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100"
            >
              <li
                v-for="child in item.children"
                :key="child.id"
              >
                <NuxtLink
                  :to="getHref(child)"
                  :prefetch="false"
                  active-class="text-primary font-semibold bg-muted"
                  class="block px-4 py-2 text-center text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </template>
          <!-- Regular item -->
          <NuxtLink
            v-else
            :to="getHref(item)"
            :prefetch="false"
            active-class="text-primary font-semibold"
            class="nav-link font-medium text-foreground transition-colors hover:text-primary"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
