<script setup lang="ts">
import type { Paper } from "~/layers/conference/types/paper";
import { statusConfig } from "~/layers/conference/data/papers.mock";

const props = defineProps<{
  paper: Paper;
}>();

defineEmits<{
  preview: [paper: Paper];
}>();

const config = useRuntimeConfig();
const confBase = String(config.public.confApiBase);

// PDF path in the CodeIgniter fdrives directory
const PDF_BASE_PATH = "fdrives/sid/qawmiworld/conference/2026";

const pdfUrl = computed(() =>
  props.paper.paper_file_name
    ? `${confBase}/${PDF_BASE_PATH}/${props.paper.paper_file_name}`
    : null,
);

// No JS download logic needed.
// The browser handles the download natively via <a download> once the backend
// sends Access-Control-Allow-Origin + Content-Disposition: attachment headers.
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-cfp-olive/15 bg-white shadow-lg transition-shadow hover:shadow-xl">
    <div class="p-6 md:p-7">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <!-- Content -->
        <div class="min-w-0 flex-1">
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <!-- Track badge -->
            <span class="rounded-full bg-cfp-yellow/20 px-3 py-1 font-poppins text-xs font-semibold text-cfp-olive">
              {{ paper.track }}
            </span>
            <!-- Status badge -->
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-poppins text-xs font-semibold"
              :class="[statusConfig[paper.status].bg, statusConfig[paper.status].text]"
            >
              <span
                class="size-1.5 shrink-0 rounded-full"
                :class="statusConfig[paper.status].dot"
              />
              {{ paper.status }}
            </span>
          </div>

          <h3 class="mb-2 font-lora text-lg leading-snug font-bold text-cfp-olive">
            {{ paper.title }}
          </h3>

          <p class="mb-3 line-clamp-2 font-poppins text-sm leading-relaxed text-gray-500">
            {{ paper.abstract }}
          </p>

          <div class="flex flex-wrap items-center gap-4 font-poppins text-xs text-gray-400">
            <span>
              <span class="font-medium text-gray-500">Authors:</span> {{ paper.authors }}
            </span>
            <span>·</span>
            <span>Submitted {{ paper.submittedDate }}</span>
            <span>·</span>
            <span class="font-mono">{{ paper.id }}</span>
          </div>
        </div>

        <!-- Actions: 2x2 grid -->
        <div class="grid shrink-0 grid-cols-2 gap-2 sm:w-64 md:w-72">
          <!-- Lowest importance: Preview (Modal) -->
          <button
            class="flex-1 rounded-full border-2 border-cfp-olive/20 px-3 py-2 text-center font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive-pale"
            @click="$emit('preview', paper)"
          >
            Preview
          </button>

          <!-- Highest importance: Edit -->
          <NuxtLink
            :to="`/submit-paper/${paper.id}`"
            class="flex-1 rounded-full border-2 border-cfp-red bg-cfp-red px-3 py-2 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Edit
          </NuxtLink>

          <!-- Medium importance: Preview PDF -->
          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 rounded-full border-2 border-cfp-olive px-3 py-2 text-center font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white"
          >
            Preview PDF
          </a>

          <!-- High importance: Download -->
          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            :download="paper.paper_file_name ?? 'paper.pdf'"
            class="flex-1 rounded-full border-2 border-cfp-olive bg-cfp-olive px-3 py-2 text-center font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </div>
      </div>
    </div>

    <!-- Status accent bar -->
    <div
      class="h-1 w-full"
      :class="statusConfig[paper.status].dot"
    />
  </div>
</template>
