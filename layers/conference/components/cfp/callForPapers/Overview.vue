<script setup lang="ts">
defineProps<{
  overview: string[];
}>();
</script>

<template>
  <section
    id="overview"
    class="mb-12 scroll-mt-24"
  >
    <h2 class="mb-5 border-b border-brand-primary/15 pb-2 font-lora text-2xl font-bold text-brand-primary">
      Overview
    </h2>
    <div class="space-y-4 font-poppins leading-relaxed text-gray-700">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p
        v-for="(p, i) in overview"
        :key="i"
        v-html="p"
      />
    </div>
  </section>
</template>
