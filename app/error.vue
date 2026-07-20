<!-- app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

const title = computed(() => {
  if (props.error.statusCode === 404) return "Page Not Found";
  if (props.error.statusCode === 403) return "Access Denied";
  return "Something Went Wrong";
});

const message = computed(() => {
  if (props.error.statusCode === 404) return "The page you're looking for doesn't exist or has been moved.";
  if (props.error.statusCode === 403) return "You do not have permission to access this page.";
  return props.error.message || "An unexpected error occurred. Please try again later.";
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div class="max-w-lg rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-xl">
      <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-red-50 text-red-500">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="size-12"
        />
      </div>

      <h1 class="mb-2 text-6xl font-bold text-gray-900">
        {{ error.statusCode }}
      </h1>
      <h2 class="mb-4 text-2xl font-semibold text-gray-800">
        {{ title }}
      </h2>
      <p class="mb-8 text-gray-500">
        {{ message }}
      </p>

      <UButton
        size="xl"
        class="btn-brand-primary"
        @click="handleError"
      >
        Return to Home
      </UButton>
    </div>
  </div>
</template>
