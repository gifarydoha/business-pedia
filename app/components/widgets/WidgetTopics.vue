<!-- app/components/widgets/WidgetTopics.vue -->
<script setup lang="ts">
import type { HomePageBlock, WidgetItem } from "~/types/api";

defineProps<{
  block: HomePageBlock;
  items: WidgetItem[];
}>();
</script>

<template>
  <div class="container mx-auto px-4">
    <div
      v-if="items && items.length > 0"
      class="flex flex-wrap justify-center gap-4"
    >
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="`/${item.url || item.link}`"
        class="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary-light rounded-full border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:shadow"
      >
        {{ item.label }}
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="py-10 text-center"
    >
      <p class="text-gray-500 italic">
        Explore our topics coming soon.
      </p>
    </div>
  </div>
</template>
