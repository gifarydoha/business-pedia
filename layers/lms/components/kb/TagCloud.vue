<script setup lang="ts">
import type { KbListItem } from "~/types/kb";

const props = defineProps<{
  articles: KbListItem[];
}>();

const uniqueTags = computed(() => {
  if (!props.articles) return [];
  const tags = new Set<string>();
  props.articles.forEach((article) => {
    if (article.tag) {
      // Tags might be comma-separated
      article.tag.split(",").forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) tags.add(trimmed);
      });
    }
  });
  return Array.from(tags).sort();
});
</script>

<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h3 class="mb-4 border-b border-gray-100 pb-2 font-lora text-lg font-bold text-gray-900">
      Popular Tags
    </h3>
    <div
      v-if="uniqueTags.length > 0"
      class="flex flex-wrap gap-2"
    >
      <UBadge
        v-for="tag in uniqueTags"
        :key="tag"
        color="warning"
        variant="soft"
        class="cursor-pointer transition-colors hover:bg-primary-orange/50 hover:text-white"
      >
        {{ tag }}
      </UBadge>
    </div>
    <div
      v-else
      class="text-sm text-gray-500 italic"
    >
      No tags available.
    </div>
  </div>
</template>
