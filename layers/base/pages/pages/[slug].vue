<script setup lang="ts">
import type { ContentApiResponse } from "~/types/api";

definePageMeta({ layout: "pages" });

const route = useRoute();
const slug = route.params.slug as string;

const ALLOWED_SLUGS = ["about", "contact", "terms", "privacy"];
if (!ALLOWED_SLUGS.includes(slug)) {
  throw createError({ status: 404, statusText: "Page Not Found" });
}

const config = useRuntimeConfig();
const { data, error, status } = await useFetch<ContentApiResponse>(
  `${config.public.apiBase}/content/${slug}`,
  {
    query: { access_key: config.public.apiAccessKey },
    key: `page-${slug}`,
  },
);

const page = computed(() => data.value?.content);

if (!page.value) {
  throw createError({ status: 404, statusText: "Page Not Found" });
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
      v-else-if="error || !page"
      class="container mx-auto py-20 text-center"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="mx-auto mb-4 size-16 text-red-400"
      />
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p class="mb-6 text-gray-500">
        The content you are looking for does not exist or failed to load.
      </p>
      <NuxtLink to="/">
        <UButton class="btn-brand-primary">Return to Home</UButton>
      </NuxtLink>
    </div>

    <!-- Content State -->
    <div
      v-else
      class="container mx-auto px-4 py-8"
    >
      <SharedPageBanner
        :title="page.title"
        :image="page.image_url"
      />

      <SharedParsedPageContent :html-content="page.fulltext" />
    </div>
  </div>
</template>
