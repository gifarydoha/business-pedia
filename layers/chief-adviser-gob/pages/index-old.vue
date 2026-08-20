<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { contentService } from "~~/layers/base/services/content.service";
import type { PaginatedContentsResponse } from "~~/layers/chief-adviser-gob/types/paginatedContents";
import type { PageContent } from "~~/layers/base/types/api";

definePageMeta({ layout: "default" });

const page = ref(1);
const keyword = ref("");
const isFetching = ref(false);
const hasMore = ref(true);

// 1. Initial SSR fetch using useAsyncData
const { data, error } = await useAsyncData<PaginatedContentsResponse>(
  "cagob-help-contents",
  () => contentService.fetchContents<PaginatedContentsResponse>("help", 1, keyword.value),
);

// We store our cumulative contents in a ref
const allContents = ref<PageContent[]>(data.value?.contents || []);

// 2. Fetch more function for infinite scrolling
const loadMore = async () => {
  if (isFetching.value || !hasMore.value) return;

  isFetching.value = true;
  page.value++;

  try {
    const res = await contentService.fetchContents<PaginatedContentsResponse>("help", page.value, keyword.value);

    if (res && res.contents && res.contents.length > 0) {
      allContents.value.push(...res.contents);
      // Check if we reached the last page
      if (page.value >= res.paging.pages) {
        hasMore.value = false;
      }
    }
    else {
      hasMore.value = false;
    }
  }
  catch (e) {
    console.error("Failed to fetch more contents", e);
    page.value--; // rollback page if failed
  }
  finally {
    isFetching.value = false;
  }
};

// 3. Intersection Observer setup
const observerTarget = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // If there's only 1 page initially, we don't have more
  if (data.value && data.value.paging.pages <= 1) {
    hasMore.value = false;
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      loadMore();
    }
  }, { rootMargin: "200px" }); // Trigger slightly before hitting the bottom

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <div class="container mx-auto px-4 py-12">
      <!-- Error State -->
      <div
        v-if="error"
        class="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mx-auto mb-2 size-8"
        />
        <p class="font-medium">
          Failed to load content.
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="allContents.length === 0"
        class="py-20 text-center text-gray-500"
      >
        <UIcon
          name="i-heroicons-inbox"
          class="mx-auto mb-4 size-12 text-gray-300"
        />
        <p class="text-lg">
          No contents found.
        </p>
      </div>

      <!-- Content Grid -->
      <div
        v-else
        class="mx-auto max-w-5xl"
      >
        <div class="grid grid-cols-1 gap-6">
          <NuxtLink
            v-for="item in allContents"
            :key="item.id"
            :to="`/${item.alias}`"
            class="group block"
          >
            <!-- Notice we use NuxtUI's UCard and our token classes: group-hover:ring-brand-primary -->
            <UCard class="group-hover:ring-brand-primary group-hover:shadow-brand-primary/10 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div class="flex flex-col gap-6 md:flex-row">
                <div
                  v-if="item.image_url"
                  class="shrink-0 md:w-1/4"
                >
                  <img
                    :src="item.image_url"
                    :alt="item.title"
                    class="aspect-video w-full rounded-lg object-cover"
                  >
                </div>
                <div class="flex grow flex-col justify-center space-y-2">
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span v-if="item.created">{{ new Date(item.created).toLocaleDateString() }}</span>
                    <span v-if="item.total_view">&bull;</span>
                    <span
                      v-if="item.total_view"
                      class="flex items-center gap-1"
                    >
                      <UIcon
                        name="i-heroicons-eye"
                        class="size-4"
                      /> {{ item.total_view }} views
                    </span>
                  </div>
                  <!-- Use text-brand-primary for hover -->
                  <h3 class="group-hover:text-brand-primary font-lora text-xl font-bold text-gray-900 transition-colors">
                    {{ item.title }}
                  </h3>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <!-- Intersection Observer Target Element -->
        <div
          ref="observerTarget"
          class="mt-8 flex justify-center py-4"
        >
          <UIcon
            v-if="isFetching"
            name="i-heroicons-arrow-path"
            class="text-brand-primary size-8 animate-spin"
          />
          <p
            v-else-if="!hasMore"
            class="text-sm text-gray-500"
          >
            You have reached the end.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
