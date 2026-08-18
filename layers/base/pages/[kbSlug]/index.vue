<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import KbSidebar from "~~/layers/base/components/kb/KbSidebar.vue";
import { useKnowledgebase } from "~~/layers/base/composables/useKnowledgebase";

const route = useRoute();
const categorySlug = route.params.kbSlug as string;

const { getKbList, getCategoryMap } = useKnowledgebase();
const { data, status, error } = await getKbList();

const articles = computed(() => data.value?.kb_titles || []);
const categories = getCategoryMap(articles);
const category = computed(() => categories.value.get(categorySlug));

if (error.value || !category.value) {
  throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const categoryArticles = computed(() => {
  return articles.value.filter((item) => {
    if (!item.category_name) return false;
    const slug = item.category_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    return slug === categorySlug;
  });
});

useSeoMeta({
  title: computed(() => category.value ? `${category.value.name} Topics` : "Category Not Found"),
  description: computed(() => `Browse articles related to ${category.value?.name || "this category"}.`),
});

const config = useRuntimeConfig();
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <!-- Hero Section -->
    <div class="bg-brand-primary py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <h1 class="mb-4 font-lora text-4xl font-bold md:text-5xl">
          {{ category?.name || 'Category' }}
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-white/80">
          Browse our collections of articles in {{ category?.name }}.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Loading State -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center py-20"
      >
        <UIcon
          name="i-heroicons-arrow-path"
          class="text-brand-primary size-8 animate-spin"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error || !category"
        class="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mx-auto mb-2 size-8"
        />
        <p class="font-medium">
          {{ error ? 'Failed to load category.' : 'Category not found.' }}
        </p>
        <div class="mt-4">
          <UButton
            to="/topics"
            color="neutral"
            variant="solid"
          >
            Back to Topics
          </UButton>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="categoryArticles.length === 0"
        class="py-20 text-center text-gray-500"
      >
        <UIcon
          name="i-heroicons-inbox"
          class="mx-auto mb-4 size-12 text-gray-300"
        />
        <p class="text-lg">
          No articles available for this category.
        </p>
      </div>

      <!-- Content State -->
      <div
        v-else
        class="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        <!-- Main List -->
        <div class="lg:col-span-9">
          <div class="grid grid-cols-1 gap-6">
            <NuxtLink
              v-for="article in categoryArticles"
              :key="article.id"
              :to="`/${categorySlug}/${article.alias}`"
              class="group block"
            >
              <UCard
                class="group-hover:ring-brand-primary group-hover:shadow-brand-primary/10 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
              >
                <div class="flex flex-col gap-6 md:flex-row">
                  <div
                    v-if="article.featured_image"
                    class="shrink-0 md:w-1/3"
                  >
                    <img
                      :src="`${config.public.apiBase}/fdrives/skb/${article.featured_image}`"
                      :alt="article.title"
                      class="aspect-video w-full rounded-lg object-cover"
                    >
                  </div>
                  <div class="flex grow flex-col justify-center space-y-3">
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                      <span v-if="article.created">{{ new Date(article.created).toLocaleDateString() }}</span>
                      <span v-if="article.created && article.total_view">&bull;</span>
                      <span
                        v-if="article.total_view"
                        class="flex items-center gap-1"
                      >
                        <UIcon
                          name="i-heroicons-eye"
                          class="size-4"
                        /> {{ article.total_view }} views
                      </span>
                    </div>
                    <h3 class="group-hover:text-brand-primary font-lora text-xl font-bold text-gray-900 transition-colors">
                      {{ article.title }}
                    </h3>
                    <p class="line-clamp-2 text-gray-600">
                      {{ article.meta_description }}
                    </p>
                    <div
                      v-if="article.tag"
                      class="flex flex-wrap gap-2 pt-2"
                    >
                      <UBadge
                        v-for="tag in article.tag.split(',').filter(Boolean)"
                        :key="tag"
                        color="neutral"
                        variant="soft"
                        size="sm"
                      >
                        {{ tag.trim() }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-3">
          <div class="sticky top-24">
            <KbSidebar
              :categories="categories"
              :articles="articles"
              :current-category-slug="categorySlug"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
