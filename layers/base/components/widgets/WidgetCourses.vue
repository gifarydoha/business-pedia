<!-- app/components/widgets/WidgetCourses.vue -->
<script setup lang="ts">
import type { HomePageBlock, WidgetItem } from "~/types/api";

defineProps<{
  block: HomePageBlock;
  items: WidgetItem[];
}>();

const { buildImageUrl } = useImageUrl();
</script>

<template>
  <div class="container mx-auto px-4">
    <div
      v-if="items && items.length > 0"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <NuxtImg
          v-if="item.image"
          :src="buildImageUrl(item.image)"
          :alt="item.label"
          class="h-48 w-full object-cover"
        />
        <div class="p-6">
          <h3 class="mb-2 text-xl font-bold">
            {{ item.label }}
          </h3>
          <p
            v-if="item.sub_title"
            class="mb-4 text-sm text-gray-500"
          >
            {{ item.sub_title }}
          </p>
          <p
            v-if="item.custom_content"
            class="mb-6 line-clamp-3 text-sm text-gray-600"
          >
            {{ item.custom_content }}
          </p>
          <NuxtLink
            v-if="item.url || item.link"
            :to="`/${item.url || item.link}`"
          >
            <UButton
              variant="soft"
              class="text-brand-primary"
              block
            >View Course</UButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-xl border border-dashed border-gray-100 bg-gray-50 py-12 text-center"
    >
      <UIcon
        name="i-heroicons-academic-cap"
        class="mx-auto mb-3 size-12 text-gray-400"
      />
      <h3 class="mb-1 text-lg font-medium text-gray-900">
        No courses available
      </h3>
      <p class="text-gray-500">
        Check back later for new course offerings.
      </p>
    </div>
  </div>
</template>
