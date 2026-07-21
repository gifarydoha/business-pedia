<!-- app/pages/[...slug].vue -->
<script setup lang="ts">
import type { ContentApiResponse } from "~/types/api";

definePageMeta({ layout: "default" });

const route = useRoute();
const alias = computed(() => {
  const params = route.params.slug;
  return Array.isArray(params) ? params.join("/") : params;
});

const ALLOWED_SLUGS = ["about", "contact", "terms", "privacy"];
if (alias.value && ALLOWED_SLUGS.includes(alias.value)) {
  await navigateTo(`/pages/${alias.value}`);
}

const config = useRuntimeConfig();
const { data, error, status } = await useFetch<ContentApiResponse>(
  `${config.public.apiBase}/content/${alias.value}`,
  {
    query: { access_key: config.public.apiAccessKey },
  },
);

const page = computed(() => data.value?.content);

const isPageEmpty = computed(() => {
  if (!page.value) return true;
  if (typeof page.value === "object" && Object.keys(page.value).length === 0) return true;
  return false;
});

if (error.value || isPageEmpty.value) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found", fatal: true });
}

useSeoMeta({
  title: computed(() => page.value?.meta_title || page.value?.title),
  description: computed(() => page.value?.meta_description),
  ogImage: computed(() => page.value?.image_url),
  ogUrl: computed(() => page.value?.canonical_url),
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="container mx-auto flex justify-center py-20"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="text-brand-primary size-8 animate-spin"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || isPageEmpty"
      class="container mx-auto py-20 text-center"
    >
      <!-- Now handled globally by error.vue -->
    </div>

    <!-- Content State -->
    <div
      v-else
      class="container mx-auto px-4 py-8"
    >
      <SharedPageBanner
        :title="page?.title || ''"
        :image="page?.image_url || ''"
      />

      <SharedParsedPageContent :html-content="page?.fulltext || ''" />
    </div>
  </div>
</template>
