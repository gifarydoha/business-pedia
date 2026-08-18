<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useKnowledgebase } from "~~/layers/base/composables/useKnowledgebase";

const route = useRoute();
const alias = route.params.kbAlias as string;
const categorySlug = route.params.kbSlug as string;
const config = useRuntimeConfig();

const { getKbDetail } = useKnowledgebase();
const { data, status, error } = await getKbDetail(alias);

if (error.value || !data.value?.kb_title) {
  throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
}

const article = computed(() => data.value?.kb_title);
const h2Entries = computed(() => data.value?.h2);

useSeoMeta({
  title: computed(() => article.value?.meta_title || article.value?.title || "Article"),
  description: computed(() => article.value?.meta_description || ""),
});

const formattedDetails = computed(() => {
  if (!article.value?.details) return "";
  let html = article.value.details;

  // Replace [#FEATURED_MEDIA#] if present
  if (html.includes("[#FEATURED_MEDIA#]")) {
    if (article.value.featured_image) {
      const mediaHtml = `<img src="${config.public.apiBase}/fdrives/skb/${article.value.featured_image}" alt="${article.value.title}" class="w-full rounded-xl object-cover my-8 aspect-video shadow-md" />`;
      html = html.replace("[#FEATURED_MEDIA#]", mediaHtml);
    }
    else {
      html = html.replace("[#FEATURED_MEDIA#]", "");
    }
  }
  return html;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center py-32"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="text-brand-primary size-8 animate-spin"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !article"
      class="container mx-auto px-4 py-32"
    >
      <div class="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mx-auto mb-4 size-12"
        />
        <p class="mb-6 text-lg font-medium">
          {{ error ? 'Failed to load article.' : 'Article not found.' }}
        </p>
        <UButton
          :to="`/${categorySlug}`"
          color="neutral"
          variant="solid"
          size="lg"
        >
          Back to Category
        </UButton>
      </div>
    </div>

    <!-- Content State -->
    <div
      v-else
      class="container mx-auto px-4 py-12"
    >
      <!-- Article Header -->
      <header class="mx-auto mb-12 max-w-3xl text-center">
        <div class="mb-6 flex items-center justify-center gap-2">
          <UButton
            :to="`/${categorySlug}`"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            size="sm"
            class="absolute left-4 md:static"
          >
            Back
          </UButton>
          <UBadge
            color="neutral"
            variant="soft"
            size="md"
          >
            {{ article.category_name }}
          </UBadge>
        </div>

        <h1 class="mb-6 font-lora text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl">
          {{ article.title }}
        </h1>

        <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span
            v-if="article.created"
            class="flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-calendar"
              class="size-4"
            />
            {{ new Date(article.created).toLocaleDateString() }}
          </span>
          <span v-if="article.created && article.total_view">&bull;</span>
          <span
            v-if="article.total_view"
            class="flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-eye"
              class="size-4"
            />
            {{ article.total_view }} views
          </span>
        </div>
      </header>

      <!-- Featured Image (if not using placeholder) -->
      <div
        v-if="article.featured_image && !article.details.includes('[#FEATURED_MEDIA#]')"
        class="mx-auto mb-12 max-w-4xl"
      >
        <img
          :src="`${config.public.apiBase}/fdrives/skb/${article.featured_image}`"
          :alt="article.title"
          class="aspect-video w-full rounded-2xl object-cover shadow-lg"
        >
      </div>

      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-12">
        <!-- Main Content -->
        <div class="lg:col-span-8 xl:col-span-9">
          <article
            class="prose-a:text-brand-primary prose prose-lg max-w-none prose-gray prose-headings:font-lora"
            v-html="formattedDetails"
          />

          <!-- Tags -->
          <div
            v-if="article.tag"
            class="mt-12 border-t border-gray-100 pt-8"
          >
            <h4 class="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Tags
            </h4>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in article.tag.split(',').filter(Boolean)"
                :key="tag"
                color="neutral"
                variant="soft"
              >
                {{ tag.trim() }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Table of Contents Sidebar -->
        <div
          v-if="h2Entries && Object.keys(h2Entries).length > 0"
          class="lg:col-span-4 xl:col-span-3"
        >
          <div class="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 class="mb-4 border-b border-gray-100 pb-2 font-lora text-lg font-bold text-gray-900">
              Table of Contents
            </h3>
            <ul class="space-y-3 text-sm">
              <li
                v-for="(entry, key) in h2Entries"
                :key="key"
              >
                <a
                  :href="`#${entry.h_id}`"
                  class="hover:text-brand-primary block leading-tight text-gray-600 transition-colors"
                >
                  {{ entry.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
