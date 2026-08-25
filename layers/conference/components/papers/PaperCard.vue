<script setup lang="ts">
import type { Paper } from "~/layers/conference/types/paper";
import { statusConfig } from "~/layers/conference/data/papers.mock";

const props = defineProps<{
  paper: Paper;
}>();

defineEmits<{
  "preview": [paper: Paper];
  "preview-pdf": [url: string];
}>();

const config = useRuntimeConfig();
const confBase = String(config.public.apiBase);

// PDF path in the CodeIgniter fdrives directory
// const PDF_BASE_PATH = "fdrives/sid/qawmiworld/conference/2026";
const PDF_BASE_PATH = "fdrives/sid/sbacbackend/conference/2026";

const pdfUrl = computed(() =>
  props.paper.paper_file_name
    ? `${confBase}/${PDF_BASE_PATH}/${props.paper.paper_file_name}`
    : null,
);
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-brand-primary/15 bg-white shadow-lg transition-shadow hover:shadow-xl"
  >
    <div class="p-6 md:p-7">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <!-- Content -->
        <div class="min-w-0 flex-1">
          <h3 class="mb-2 font-lora text-lg leading-snug font-bold text-brand-primary">
            {{ paper.title }}
          </h3>

          <p class="mb-3 line-clamp-2 font-poppins text-sm leading-relaxed text-gray-500">
            {{ paper.abstract }}
          </p>

          <div class="flex flex-wrap items-center gap-4 font-poppins text-xs text-gray-400">
            <span>
              <span class="font-medium text-gray-500">Authors:</span> {{ paper.authors }}
            </span>
          </div>
        </div>

        <!-- Actions: 2x2 grid -->
        <div class="grid shrink-0 grid-cols-1 gap-2 sm:w-40">
          <NuxtLink
            :to="`/submit-paper/${paper.id}?action=view`"
            class="flex-1 rounded-lg bg-brand-secondary px-3 py-2 text-center font-lora text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            View Paper
          </NuxtLink>

          <!-- Highest importance: Edit -->
          <NuxtLink
            :to="`/submit-paper/${paper.id}?action=edit`"
            class="flex-1 rounded-lg border border-brand-secondary bg-brand-secondary px-3 py-2 text-center font-lora text-sm font-bold text-white shadow-sm transition-opacity"
          >
            Edit
          </NuxtLink>

          <!-- High importance: Download -->
          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            :download="paper.paper_file_name ?? 'paper.pdf'"
            target="_blank"
            class="flex-1 rounded-lg bg-brand-primary-dark px-3 py-2 text-center font-lora text-sm font-bold text-white
            shadow-sm transition-opacity hover:opacity-90"
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
