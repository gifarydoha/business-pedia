<script setup lang="ts">
defineProps<{
  index: number;
  name: string;
  description: string;
}>();
</script>

<template>
  <div class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
    <span
      class="mb-4 flex size-9 items-center justify-center rounded-full bg-brand-primary font-lora text-sm font-bold text-white"
    >
      {{ index }}
    </span>
    <h3 class="mb-2 font-lora text-base leading-snug font-semibold text-brand-primary">
      {{ name }}
    </h3>
    <p class="font-poppins text-sm leading-relaxed text-gray-600">
      {{ description }}
    </p>
  </div>
</template>
