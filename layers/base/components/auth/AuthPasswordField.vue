<script setup lang="ts">
import { ref } from "vue";

defineOptions({ inheritAttrs: false });
defineProps<{
  label: string;
  error?: string;
  required?: boolean;
}>();
const modelValue = defineModel<string>();
const show = ref(false);
</script>

<template>
  <div>
    <label class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900">
      {{ label }}<span
        v-if="required"
        class="ml-1 text-xs text-red-500"
      >*</span>
    </label>
    <div class="relative">
      <input
        v-bind="$attrs"
        v-model="modelValue"
        :type="show ? 'text' : 'password'"
        class="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-10 pl-3 font-lora text-sm text-fy-sage-900 focus:border-fy-teal-300 focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
      >
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
        @click="show = !show"
      >
        <Icon
          :name="show ? 'lucide:eye-off' : 'lucide:eye'"
          class="size-5"
        />
      </button>
    </div>
    <p
      v-if="error"
      class="mt-1 font-lora text-xs text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template>
