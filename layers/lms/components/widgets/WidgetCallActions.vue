<!-- app/components/widgets/WidgetCallActions.vue -->
<script setup lang="ts">
import type { HomePageBlock, WidgetItem } from "~/types/api";

defineProps<{
  block: HomePageBlock;
  items: WidgetItem[];
}>();
</script>

<template>
  <div class="bg-brand-primary py-16 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="mb-6 text-3xl font-bold md:text-4xl">
        {{ block.title || 'Ready to join?' }}
      </h2>
      <p
        v-if="block.description"
        class="mx-auto mb-8 max-w-2xl text-xl opacity-90"
      >
        {{ block.description }}
      </p>

      <div
        v-if="items && items.length > 0"
        class="flex flex-wrap justify-center gap-4"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="`/${item.url || item.link}`"
        >
          <UButton
            size="xl"
            color="neutral"
            variant="solid"
            class="text-brand-primary font-bold"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
      </div>
      <!-- Fallback CTA if no items -->
      <div
        v-else
        class="flex justify-center gap-4"
      >
        <NuxtLink to="/register">
          <UButton
            size="xl"
            color="neutral"
            variant="solid"
            class="text-brand-primary font-bold"
          >
            Get Started
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
