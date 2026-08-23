<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import profileImage from "../assets/images/profile-image.jpg";
import { contentService } from "~~/layers/base/services/content.service";
import type { PaginatedContentsResponse } from "~~/layers/chief-adviser-gob/types/paginatedContents";
import type { PageContent } from "~~/layers/base/types/api";

defineOptions({
  name: "IndexPage",
});

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
    const res = await contentService.fetchContents<PaginatedContentsResponse>("post", 1, newVal);
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
  minViews: 0,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  () => contentService.fetchContents<PaginatedContentsResponse>("post", 1, keyword.value),
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
  <div class="min-h-screen bg-background pt-8 pb-20">
    <!-- Feed -->
    <main class="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <!-- Search & Filter -->
      <!-- <SharedGlobalFilterBar
        v-model:search="keyword"
        :contents="allContents"
        @filter="applyFilters"
      /> -->

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
            class="mb-5 flex size-16 items-center justify-center rounded-full bg-muted"
          >
            <UIcon
              name="i-heroicons-inbox"
              class="size-8 text-muted-foreground/70"
            />
          </div>

          <h2 class="text-lg font-semibold text-foreground">
            No contents found
          </h2>

          <p class="mt-1 text-sm text-muted-foreground">
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
            class="group rounded-md border-b border-border bg-card p-8 sm:py-9"
          >
            <!-- :to="`/${item.alias}`" -->
            <div
              class="block rounded-2xl transition outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            >
              <!-- Post Header -->
              <div class="flex items-start gap-3">
                <!-- Brand / Content Avatar -->
                <div
                  class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm sm:size-11"
                >
                  <img
                    :src="profileImage"
                    alt="Profile"
                    class="size-full object-cover"
                  >
                </div>

                <div class="min-w-0 flex-1">
                  <!-- Author + Date -->
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span class="font-semibold text-foreground">
                      Post
                    </span>

                    <span class="text-muted-foreground/70">
                      ·
                    </span>

                    <time
                      v-if="item.created"
                      class="text-sm text-muted-foreground"
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
                  <p class="mt-0.5 text-xs text-muted-foreground/70">
                    {{ item.category_title || "Help & Information" }}
                  </p>
                </div>

                <!-- More Icon -->
                <button
                  type="button"
                  class="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition hover:bg-muted hover:text-foreground/85"
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
                  class="font-lora text-xl leading-tight font-bold tracking-[-0.015em] text-foreground transition-colors group-hover:text-primary sm:text-2xl sm:leading-tight"
                >
                  <!-- {{ item.title }} -->
                </h2>

                <!-- fulltext -->
                <p
                  v-if="item.fulltext"
                  class="mt-2 text-xs md:text-sm leading-6 font-normal text-foreground/95"
                >
                  {{ item.fulltext }}
                </p>

                <!-- Content Preview -->
                <!-- <div
                  v-if="item.fulltext"
                  class="mt-2 line-clamp-3 text-[15px] leading-6 text-muted-foreground sm:text-base"
                  v-html="item.fulltext"
                /> -->

                <!-- Image -->
                <div
                  v-if="item.image_url"
                  class="mt-5 overflow-hidden rounded-2xl border border-border bg-muted"
                >
                  <img
                    :src="item.image_url"
                    :alt="item.title"
                    loading="lazy"
                    class=" block aspect-video w-full object-cover transition duration-500 ease-out"
                  >
                </div>

                <!-- Post Meta -->
                <div
                  class="mt-4 flex items-center justify-between text-muted-foreground"
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
                      class="flex items-center gap-1.5 text-sm transition-colors group-hover:text-primary"
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
                    class="flex size-9 items-center justify-center rounded-full transition-colors group-hover:bg-muted"
                  >
                    <UIcon
                      name="i-heroicons-paper-airplane"
                      class="size-[18px]"
                    />
                  </span>
                </div>
              </div>
            </div>
          </article>

          <!-- Infinite Scroll -->
          <div
            ref="observerTarget"
            class="flex min-h-24 items-center justify-center py-8"
          >
            <!-- Loading -->
            <div
              v-if="isFetching"
              class="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="size-5 animate-spin text-primary"
              />

              <span>
                Loading more...
              </span>
            </div>

            <!-- End -->
            <div
              v-else-if="!hasMore"
              class="flex items-center gap-2 text-sm text-muted-foreground/70"
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
