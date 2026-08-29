<script setup lang="ts">
import type { KbCategory } from "~~/layers/base/types/kb";

defineProps<{
  category: KbCategory;
}>();
</script>

<template>
  <NuxtLink
    :to="`/${category.slug}`"
    class="group block h-full"
  >
    <UCard
      class="h-full bg-white px-6 py-8 ring-1 ring-gray-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-brand-primary/10 group-hover:ring-brand-primary sm:p-8"
    >
      <div class="flex flex-col items-center justify-center space-y-4 text-center">
        <h3 class="font-lora text-2xl font-bold text-gray-900 transition-colors group-hover:text-brand-primary">
          {{ category.name }}
        </h3>
        <UBadge
          color="neutral"
          variant="soft"
          size="lg"
          class="transition-colors group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
        >
          {{ category.count }} {{ category.count === 1 ? 'Article' : 'Articles' }}
        </UBadge>
      </div>
    </UCard>
  </NuxtLink>
</template>
