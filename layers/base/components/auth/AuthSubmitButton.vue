<script setup lang="ts">
defineProps<{
  loading: boolean;
  label: string;
  loadingLabel: string;
}>();
</script>

<template>
  <button
    type="submit"
    :disabled="loading"
    class="w-full cursor-pointer rounded-lg bg-fy-orange-300 px-6 py-2.5 font-poppins text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {{ loading ? loadingLabel : label }}
  </button>
</template>
