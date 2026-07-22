<script setup lang="ts">
import type { KbCategory, KbListItem } from "~/types/kb";
import TagCloud from "./TagCloud.vue";

const props = defineProps<{
  categories: Map<string, KbCategory>;
  articles: KbListItem[];
  currentCategorySlug?: string;
}>();

const categoryList = computed(() => Array.from(props.categories.values()));
</script>

<template>
  <div class="space-y-6">
    <!-- Categories Widget -->
    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 class="mb-4 border-b border-gray-100 pb-2 font-lora text-lg font-bold text-gray-900">
        Categories
      </h3>
      <ul class="space-y-2">
        <li
          v-for="category in categoryList"
          :key="category.slug"
        >
          <NuxtLink
            :to="`/${category.slug}`"
            class="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors"
            :class="[
              currentCategorySlug === category.slug
                ? 'bg-brand-primary/10 text-brand-primary font-medium'
                : 'hover:text-brand-primary text-gray-600 hover:bg-gray-50',
            ]"
          >
            <span class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-folder"
                class="size-4"
                :class="currentCategorySlug === category.slug ? 'text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'"
              />
              {{ category.name }}
            </span>
            <span
              class="group-hover:bg-brand-primary/10 group-hover:text-brand-primary rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 transition-colors"
              :class="currentCategorySlug === category.slug ? 'bg-brand-primary/10 text-brand-primary' : ''"
            >
              {{ category.count }}
            </span>
          </NuxtLink>
        </li>
        <li
          v-if="categoryList.length === 0"
          class="py-2 text-sm text-gray-500 italic"
        >
          No categories found.
        </li>
      </ul>
    </div>

    <!-- Tag Cloud Widget -->
    <TagCloud :articles="articles" />
  </div>
</template>
