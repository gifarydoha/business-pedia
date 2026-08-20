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

watch(keyword, async (newVal) => {
  page.value = 1;
  hasMore.value = true;
  isFetching.value = true;

  try {
    const res = await contentService.fetchContents<PaginatedContentsResponse>("help", 1, newVal);
    allContents.value = res.contents || [];
    if (page.value >= (res.paging?.pages || 1)) {
      hasMore.value = false;
    }
  }
  catch (e) {
    console.error(e);
  }
  finally {
    isFetching.value = false;
  }
});

interface FilterState {
  keyword: string;
  featured: boolean;
  minViews: number;
}

const activeFilters = ref<FilterState>({
  keyword: "",
  featured: false,
  minViews: 0
});

const applyFilters = (filters: unknown) => {
  activeFilters.value = { ...(filters as FilterState) };
};

const displayedContents = computed(() => {
  return allContents.value.filter((item) => {
    if (activeFilters.value.keyword && !item.meta_keywords?.includes(activeFilters.value.keyword)) {
      return false;
    }
    if (activeFilters.value.featured && !item.is_featured_image) {
      return false;
    }
    if (activeFilters.value.minViews > 0) {
      const views = parseInt(String(item.total_view)) || 0;
      if (views < activeFilters.value.minViews) {
        return false;
      }
    }
    return true;
  });
});

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
  <div class="min-h-screen bg-[#f8f9fa] pb-20">
    <!-- Feed -->
    <main class="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <!-- Search & Filter -->
      <div class="pt-8">
        <SharedGlobalFilterBar
          v-model:search="keyword"
          :contents="allContents"
          @filter="applyFilters"
        />
      </div>

      <!-- Top spacing -->
      <div class="pt-6 sm:pt-10">
        <!-- Error State -->
        <div
          v-if="error"
          class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600"
        >
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="mx-auto mb-3 size-8"
          />

          <p class="font-medium">
            Failed to load content.
          </p>

          <p class="mt-1 text-sm text-red-500">
            Please try again later.
          </p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="displayedContents.length === 0"
          class="flex min-h-[50vh] flex-col items-center justify-center text-center"
        >
          <div
            class="mb-5 flex size-16 items-center justify-center rounded-full bg-gray-100"
          >
            <UIcon
              name="i-heroicons-inbox"
              class="size-8 text-gray-400"
            />
          </div>

          <h2 class="text-lg font-semibold text-gray-900">
            No contents found
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            There isn't anything to show here yet.
          </p>
        </div>

        <!-- Social Feed -->
        <div
          v-else
          class="space-y-8"
        >
          <article
            v-for="item in displayedContents"
            :key="item.id"
            class="group rounded-md border-b border-gray-200/80 bg-white p-8 sm:py-9"
          >
            <NuxtLink
              :to="`/${item.alias}`"
              class="focus-visible:ring-brand-primary block rounded-2xl transition outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
            >
              <!-- Post Header -->
              <div class="flex items-start gap-3">
                <!-- Brand / Content Avatar -->
                <div
                  class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white shadow-sm sm:size-11"
                >
                  <span class="text-sm font-bold sm:text-base">
                    {{ item.title?.charAt(0)?.toUpperCase() || "C" }}
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <!-- Author + Date -->
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span class="font-semibold text-gray-950">
                      Help
                    </span>

                    <span class="text-gray-400">
                      ·
                    </span>

                    <time
                      v-if="item.created"
                      class="text-sm text-gray-500"
                      :datetime="item.created"
                    >
                      {{
                        new Date(item.created).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    </time>
                  </div>

                  <!-- Category -->
                  <p class="mt-0.5 text-xs text-gray-400">
                    {{ item.category_title || "Help & Information" }}
                  </p>
                </div>

                <!-- More Icon -->
                <button
                  type="button"
                  class="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="More options"
                  @click.prevent
                >
                  <UIcon
                    name="i-heroicons-ellipsis-horizontal"
                    class="size-5"
                  />
                </button>
              </div>

              <!-- Post Content -->
              <div class="mt-4 pl-0 sm:pl-14">
                <!-- Title -->
                <h2
                  class="group-hover:text-brand-primary font-lora text-xl leading-tight font-bold tracking-[-0.015em] text-gray-950 transition-colors sm:text-2xl sm:leading-tight"
                >
                  {{ item.title }}
                </h2>

                <!-- Subtitle -->
                <p
                  v-if="item.sub_title"
                  class="mt-2 text-[15px] leading-6 font-medium text-gray-700 sm:text-base"
                >
                  {{ item.sub_title }}
                </p>

                <!-- Content Preview -->
                <div
                  v-if="item.fulltext"
                  class="mt-2 line-clamp-3 text-[15px] leading-6 text-gray-600 sm:text-base"
                  v-html="item.fulltext"
                />

                <!-- Image -->
                <div
                  v-if="item.image_url"
                  class="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                >
                  <img
                    :src="item.image_url"
                    :alt="item.title"
                    loading="lazy"
                    class="group-hover:scale-1.015 block aspect-video w-full object-cover transition duration-500 ease-out"
                  >
                </div>

                <!-- Post Meta -->
                <div
                  class="mt-4 flex items-center justify-between text-gray-500"
                >
                  <div class="flex items-center gap-5">
                    <!-- View Count -->
                    <span
                      v-if="item.total_view"
                      class="flex items-center gap-1.5 text-sm"
                    >
                      <UIcon
                        name="i-heroicons-eye"
                        class="size-[18px]"
                      />

                      <span>
                        {{ item.total_view }}
                      </span>
                    </span>

                    <!-- Read -->
                    <span
                      class="group-hover:text-brand-primary flex items-center gap-1.5 text-sm transition-colors"
                    >
                      <UIcon
                        name="i-heroicons-arrow-up-right"
                        class="size-[18px]"
                      />

                      <span class="hidden sm:inline">
                        Read article
                      </span>

                      <span class="sm:hidden">
                        Read
                      </span>
                    </span>
                  </div>

                  <!-- Share-like visual affordance -->
                  <span
                    class="flex size-9 items-center justify-center rounded-full transition-colors group-hover:bg-gray-100"
                  >
                    <UIcon
                      name="i-heroicons-paper-airplane"
                      class="size-[18px]"
                    />
                  </span>
                </div>
              </div>
            </NuxtLink>
          </article>

          <!-- Infinite Scroll -->
          <div
            ref="observerTarget"
            class="flex min-h-24 items-center justify-center py-8"
          >
            <!-- Loading -->
            <div
              v-if="isFetching"
              class="flex items-center gap-3 text-sm text-gray-500"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="text-brand-primary size-5 animate-spin"
              />

              <span>
                Loading more...
              </span>
            </div>

            <!-- End -->
            <div
              v-else-if="!hasMore"
              class="flex items-center gap-2 text-sm text-gray-400"
            >
              <span class="h-px w-8 bg-gray-200" />

              <span>
                You're all caught up
              </span>

              <span class="h-px w-8 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
