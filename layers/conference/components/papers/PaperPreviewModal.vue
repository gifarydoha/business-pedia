<script setup lang="ts">
import type { Paper } from "~/layers/conference/types/paper";
import { statusConfig } from "~/layers/conference/data/papers.mock";

defineProps<{
  preview: Paper;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="max-h-screen w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
      @click.stop
    >
      <!-- Modal header -->
      <div class="mb-6 flex items-start justify-between gap-4">
        <div class="flex-1">
          <span class="mb-3 inline-block rounded-full bg-cfp-yellow/20 px-3 py-1 font-poppins text-xs font-semibold text-cfp-olive">
            {{ preview.track }}
          </span>
          <h2 class="font-lora text-xl leading-snug font-bold text-cfp-olive">
            {{ preview.title }}
          </h2>
        </div>
        <button
          class="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700"
          aria-label="Close preview"
          @click="emit('close')"
        >
          <svg
            class="size-4"
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

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-poppins text-xs font-semibold"
            :class="[statusConfig[preview.status].bg, statusConfig[preview.status].text]"
          >
            <span
              class="size-1.5 rounded-full"
              :class="statusConfig[preview.status].dot"
            />
            {{ preview.status }}
          </span>
          <span class="self-center font-poppins text-xs text-gray-400">
            Submitted {{ preview.submittedDate }}
          </span>
          <span class="self-center font-poppins text-xs text-gray-300">·</span>
          <span class="self-center font-mono text-xs text-gray-400">{{ preview.id }}</span>
        </div>

        <div>
          <p class="mb-1 font-poppins text-sm font-medium text-cfp-olive">
            Authors
          </p>
          <p class="font-poppins text-sm text-gray-600">
            {{ preview.authors }}
          </p>
        </div>

        <div>
          <p class="mb-2 font-poppins text-sm font-medium text-cfp-olive">
            Abstract
          </p>
          <p class="font-poppins text-sm leading-relaxed text-gray-600">
            {{ preview.abstract }}
          </p>
        </div>
      </div>

      <div class="mt-8 flex gap-3 border-t border-gray-100 pt-5">
        <button
          class="flex-1 rounded-full border-2 border-cfp-olive px-6 py-2.5 text-center font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive/5"
          @click="emit('close')"
        >
          Close
        </button>
        <NuxtLink
          to="/submit-paper"
          class="flex-1 rounded-full bg-cfp-red px-6 py-2.5 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit New Paper
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
