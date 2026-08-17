<!-- app/components/home/HomeBlockRenderer.vue -->
<script setup lang="ts">
import type { HomePageBlock } from "~~/layers/base/types/api";

const props = defineProps<{
  block: HomePageBlock;
}>();

const widgetComponentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  courses: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetCourses.vue")),
  topics: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetTopics.vue")),
  questions: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetQuestions.vue")),
  call_actions: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetCallActions.vue")),
};

const resolvedComponent = computed(() => {
  return widgetComponentMap[props.block.widget_element_path] ?? null;
});
// console.log("Rendering HomeBlockRenderer for:", props.block?.widget_element_path);
</script>

<template>
  <section
    v-if="resolvedComponent"
    :id="`section-${block.alias}`"
    :class="[
      'py-12 md:py-16',
      { 'w-full': block.is_full_section === '1' },
      { 'container mx-auto px-4': block.is_full_section === '0' },
    ]"
  >
    <!-- Common Section Header -->
    <div
      v-if="block.title"
      class="mb-10 text-center"
    >
      <h2 class="mb-3 text-3xl font-bold text-gray-900">
        {{ block.title }}
      </h2>
      <p
        v-if="block.description"
        class="mx-auto max-w-2xl text-gray-600"
      >
        {{ block.description }}
      </p>
    </div>

    <!-- The specific widget component -->
    <component
      :is="resolvedComponent"
      :block="block"
      :items="block.items"
    />
  </section>
</template>
