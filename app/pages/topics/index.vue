<script setup lang="ts">
import CategoryCard from "~/components/kb/CategoryCard.vue";
import KbSidebar from "~/components/kb/KbSidebar.vue";
import { useKnowledgebase } from "~/composables/useKnowledgebase";

const { getKbList, getCategoryMap } = useKnowledgebase();
const { data, status, error } = await getKbList();

const articles = computed(() => data.value?.kb_titles || []);
const categories = getCategoryMap(articles);
const categoryList = computed(() => Array.from(categories.value.values()));

useSeoMeta({
  title: "Knowledgebase Topics",
  description: "Browse our comprehensive knowledgebase topics.",
});
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <!-- Hero Section -->
    <div class="bg-brand-primary py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <h1 class="mb-4 font-lora text-4xl font-bold md:text-5xl">
          Knowledgebase Topics
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-white/80">
          Explore our collections of articles across different domains. Find the answers you need to empower your journey.
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
        v-else-if="error"
        class="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="mx-auto mb-2 size-8"
        />
        <p class="font-medium">
          Failed to load topics. Please try again later.
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="categoryList.length === 0"
        class="py-20 text-center text-gray-500"
      >
        <UIcon
          name="i-heroicons-inbox"
          class="mx-auto mb-4 size-12 text-gray-300"
        />
        <p class="text-lg">
          No topics available at the moment.
        </p>
      </div>

      <!-- Content State -->
      <div
        v-else
        class="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        <!-- Main Grid -->
        <div class="lg:col-span-9">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              v-for="category in categoryList"
              :key="category.slug"
              :category="category"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-3">
          <div class="sticky top-24">
            <KbSidebar
              :categories="categories"
              :articles="articles"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
