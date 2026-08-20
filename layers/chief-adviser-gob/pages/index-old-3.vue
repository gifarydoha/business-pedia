<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { contentService } from "~~/layers/base/services/content.service";
import type { PaginatedContentsResponse } from "~~/layers/chief-adviser-gob/types/paginatedContents";
import type { PageContent } from "~~/layers/base/types/api";

definePageMeta({ layout: "chief-adviser-gob" });

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

// ── UI-only helpers (no data fetching here) ─────────────────────
// PageContent may not type a body/summary field in this layer's
// type file. This reads common field names defensively so a post's
// "text" shows if your API returns one, without touching fetching
// logic or breaking the build if it doesn't exist on the type.
function getExcerpt(item: PageContent): string {
  const anyItem = item as unknown as Record<string, unknown>;
  const candidate = anyItem.excerpt ?? anyItem.description ?? anyItem.summary ?? anyItem.content;
  return typeof candidate === "string" ? candidate : "";
}

function formatRelativeDate(value: string): string {
  const d = new Date(value);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <div class="container mx-auto px-4 py-12">
      <!-- Error State -->
      <div
        v-if="error"
        class="mx-auto max-w-xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
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

      <!-- Feed: single-column, Threads/Twitter-style posts -->
      <div
        v-else
        class="mx-auto max-w-xl"
      >
        <div class="mb-8 text-center">
          <div class="mb-2 inline-flex items-center gap-2">
            <span class="bg-brand-primary shadow-brand-primary/20 size-2.5 rounded-full shadow-[0_0_0_4px]" />
            <span class="font-lora text-lg font-semibold text-gray-900">Help Center</span>
          </div>
          <p class="text-sm text-gray-500">
            Guides and updates, in one feed
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <NuxtLink
            v-for="(item, index) in allContents"
            :key="item.id"
            :to="`/${item.alias}`"
            class="group flex gap-3 py-5 first:pt-0"
          >
            <!-- Left rail: avatar mark + thread connector -->
            <div class="flex w-9 shrink-0 flex-col items-center">
              <span
                class="bg-brand-primary/10 text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                <UIcon
                  name="i-heroicons-document-text"
                  class="size-4"
                />
              </span>
              <span
                v-if="index !== allContents.length - 1"
                class="mt-2 w-px flex-1 bg-gray-200"
              />
            </div>

            <!-- Post body -->
            <div class="min-w-0 flex-1 pb-1">
              <div class="mb-1 flex items-center gap-1.5 text-sm text-gray-500">
                <span class="font-medium text-gray-700">Help Center</span>
                <span aria-hidden="true">&middot;</span>
                <span v-if="item.created">{{ formatRelativeDate(item.created) }}</span>
              </div>

              <h3 class="group-hover:text-brand-primary font-lora text-lg leading-snug font-bold text-gray-900 transition-colors">
                {{ item.title }}
              </h3>

              <p
                v-if="getExcerpt(item)"
                class="mt-1 line-clamp-3 text-[0.95rem] leading-relaxed text-gray-600"
              >
                {{ getExcerpt(item) }}
              </p>

              <div
                v-if="item.image_url"
                class="mt-3 overflow-hidden rounded-xl border border-gray-100"
              >
                <img
                  :src="item.image_url"
                  :alt="item.title"
                  class="group-hover:scale-1.02 aspect-video w-full object-cover transition-transform duration-300"
                >
              </div>

              <div
                v-if="item.total_view"
                class="mt-3 flex items-center gap-1 text-xs text-gray-400"
              >
                <UIcon
                  name="i-heroicons-eye"
                  class="size-3.5"
                />
                {{ item.total_view }} views
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Intersection Observer Target Element -->
        <div
          ref="observerTarget"
          class="mt-4 flex justify-center py-4"
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
