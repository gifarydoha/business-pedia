<script setup lang="ts">
defineProps<{
  error?: string;
  success?: string;
}>();
</script>

<template>
  <div>
    <p
      v-if="success"
      class="text-center font-lora text-sm text-fy-teal-300"
    >
      {{ success }}
    </p>
    <p
      v-if="error"
      class="text-center font-lora text-sm text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
