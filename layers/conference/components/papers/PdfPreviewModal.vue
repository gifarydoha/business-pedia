<script setup lang="ts">
defineProps<{
  pdfUrl: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="flex size-full max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <h2 class="font-lora text-lg font-bold text-brand-primary">
          PDF Preview
        </h2>
        <button
          class="flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-800"
          aria-label="Close preview"
          @click="emit('close')"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- PDF Viewer -->
      <div class="flex-1 bg-gray-100 p-2 md:p-4">
        <embed
          :src="pdfUrl"
          type="application/pdf"
          class="size-full rounded shadow-sm"
        >
      </div>
    </div>
  </div>
</template>

<style>
/* vue-pdf-embed sets canvas to display: block, but we ensure it takes full width of the container */
.vue-pdf-embed canvas {
  width: 100% !important;
  height: auto !important;
}
</style>
