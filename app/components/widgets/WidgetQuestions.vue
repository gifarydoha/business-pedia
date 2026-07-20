<!-- app/components/widgets/WidgetQuestions.vue -->
<script setup lang="ts">
import type { HomePageBlock, WidgetItem } from "~/types/api";

const props = defineProps<{
  block: HomePageBlock;
  items: WidgetItem[];
}>();

// Transform API items into Nuxt UI Accordion format
const accordionItems = computed(() => {
  if (!props.items) return [];
  return props.items.map((item) => ({
    label: item.label,
    content: item.fulltext || item.custom_content || "No content provided.",
    id: item.id,
    url: item.url,
  }));
});
</script>

<template>
  <div class="container mx-auto max-w-3xl px-4">
    <UAccordion
      v-if="accordionItems.length > 0"
      :items="accordionItems"
      class="rounded-xl border border-gray-100 bg-white shadow-sm"
    >
      <template #body="{ item }">
        <div class="p-4 text-gray-600">
          <div
            class="prose prose-sm max-w-none"
            v-html="item.content"
          />
          <div
            v-if="item.url"
            class="mt-4"
          >
            <NuxtLink
              :to="`/${item.url}`"
              class="text-brand-primary flex items-center gap-1 font-medium hover:underline"
            >
              Read more <UIcon
                name="i-heroicons-arrow-right"
                class="size-4"
              />
            </NuxtLink>
          </div>
        </div>
      </template>
    </UAccordion>

    <!-- Empty State -->
    <div
      v-else
      class="py-10 text-center"
    >
      <p class="text-gray-500 italic">
        No questions currently available.
      </p>
    </div>
  </div>
</template>
