<script setup lang="ts">
import { contentService } from "~~/layers/base/services/content.service";
import type { WidgetItem, ContentApiResponse } from "~~/layers/base/types/api";

definePageMeta({ layout: "chief-adviser-gob" });

const route = useRoute();
const settingsStore = useSettingsStore();
const slug = route.params.slug as string;

// Fallback menu to match against if store is empty
const FALLBACK_MAIN_MENU = [
  { id: "fallback-1", label: "Post", url: "/" },
  { id: "fallback-2", label: "About", url: "/about" },
  { id: "fallback-3", label: "Videos", url: "/videos" },
  { id: "fallback-4", label: "Images", url: "/images" },
] as WidgetItem[];

const mainMenu = settingsStore.mainMenu?.length ? settingsStore.mainMenu : FALLBACK_MAIN_MENU;

// Find the menu item matching this route
// We check if url or link matches the slug, e.g., '/about' matches 'about'
const menuItem = mainMenu.find((item) => {
  const target = item.url || item.link;
  if (!target) return false;
  // normalize target by removing the leading slash if present
  const targetSlug = target.startsWith("/") ? target.slice(1) : target;
  return targetSlug === slug;
});

// If there is no matching main menu item, this is a 404
if (!menuItem) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found", fatal: true });
}

useHead({
  title: `${menuItem.label} | Chief Adviser`,
});

// Fetch content from the backend using the slug
const { data: contentData, pending } = useAsyncData(
  `page-content-${slug}`,
  () => contentService.fetchContent<ContentApiResponse>(slug),
);
</script>

<template>
  <div>
    <!-- Optional loading state -->
    <div
      v-if="pending"
      class="flex justify-center p-12"
    >
      <div class="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <!-- Render fetched content -->
    <div
      v-else-if="contentData?.content?.fulltext"
      class="container mx-auto prose max-w-none px-4 py-8"
    >
      <div v-html="contentData.content.fulltext" />
    </div>

    <!-- Fallback if API returns no valid content -->
    <SharedAppComingSoon
      v-else
      :title="menuItem.label"
      description="Content is being prepared. Please check back later."
    />
  </div>
</template>
