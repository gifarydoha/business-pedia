<script setup lang="ts">
import { contentService } from "~/layers/base/services/content.service";

definePageMeta({ layout: "conference" });

interface ContentResponse {
  id: string;
  title: string;
  sub_title: string;
  fulltext: string;
  page_title: string;
  meta_description: string;
  meta_keywords: string;
  image_url: string;
  meta_title: string;
}

interface ApiWrapper {
  content: ContentResponse;
}

const { data, pending, error } = await useAsyncData<ContentResponse>(
  "faq-page-data",
  () => contentService.fetchContent<ApiWrapper>("faq").then((res) => res.content),
);

if (data.value) {
  useSeoMeta({
    title: data.value.meta_title || data.value.page_title || data.value.title,
    description: data.value.meta_description,
    ogImage: data.value.image_url,
  });

  useHead({
    meta: [
      { name: "keywords", content: data.value.meta_keywords },
    ],
  });
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div
      v-if="pending"
      class="flex justify-center py-10"
    >
      <span class="text-gray-500">Loading FAQ...</span>
    </div>

    <div
      v-else-if="error"
      class="py-10 text-center text-red-500"
    >
      Failed to load FAQ.
    </div>

    <div
      v-else-if="data"
      class="cms-content mx-auto max-w-4xl"
    >
      <!-- We use v-html to inject the dynamic HTML content coming from the backend -->
      <div v-html="data.fulltext" />
    </div>
  </div>
</template>
