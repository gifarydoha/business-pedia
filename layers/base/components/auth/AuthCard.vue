<script setup lang="ts">
defineProps<{
  heading: string;
  subtitle?: string;
  centered?: boolean;
}>();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div
      class="w-full max-w-md rounded-2xl border border-fy-teal-50 bg-white p-6 shadow-sm sm:p-8"
      :class="{ 'text-center': centered }"
    >
      <h1
        class="font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl"
        :class="subtitle ? 'mb-1' : 'mb-6'"
      >
        {{ heading }}
      </h1>
      <p
        v-if="subtitle"
        class="mb-6 font-lora text-sm text-slate-500"
      >
        {{ subtitle }}
      </p>

      <slot />
    </div>
  </div>
</template>
