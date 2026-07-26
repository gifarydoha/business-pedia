<script setup lang="ts">
defineOptions({ inheritAttrs: false });
defineProps<{
  label: string;
  type?: string;
  error?: string;
}>();
const modelValue = defineModel<string>();
</script>

<template>
  <div>
    <label class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900">{{ label }}</label>
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :type="type || 'text'"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-lora text-sm text-fy-sage-900 focus:border-fy-teal-300 focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
    >
    <p
      v-if="error"
      class="mt-1 font-lora text-xs text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template>
