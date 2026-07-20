<!-- app/pages/[...slug].vue -->
<script setup lang="ts">
import type { ContentApiResponse } from "~/types/api";

definePageMeta({ layout: "default" });

const route = useRoute();
const alias = computed(() => {
  const params = route.params.slug;
  return Array.isArray(params) ? params.join("/") : params;
});

const { data, error, status } = await useFetch<ContentApiResponse>(`/api/page/${alias.value}`);

const page = computed(() => data.value?.page_content);
const seo = computed(() => data.value?.seo_meta);

useSeoMeta({
  title: computed(() => seo.value?.meta_title ?? page.value?.meta_title ?? page.value?.title),
  description: computed(() => seo.value?.meta_description ?? page.value?.meta_description),
  ogImage: computed(() => seo.value?.image_url),
  ogUrl: computed(() => seo.value?.canonical_url),
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

      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <div
          class="prose max-w-none text-gray-700"
          v-html="page.fulltext"
        />
      </div>
    </div>
  </div>
</template>
