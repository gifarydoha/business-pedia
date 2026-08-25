<script setup lang="ts">
import { computed } from "vue";
import type { Paper } from "~/layers/conference/types/paper";
import { statusConfig } from "~/layers/conference/data/papers.mock";

const props = withDefaults(defineProps<{
  paper: Paper;
  viewType?: "my-papers" | "all-papers";
}>(), {
  viewType: "my-papers",
});

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

const bgColorClass = computed(() => {
  const decision = (props.paper.final_decision || "").toLowerCase();
  if (decision === "accepted") return "bg-green-50/60";
  if (decision === "rejected") return "bg-red-50/60";
  return "bg-white";
});
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-brand-primary/15 shadow-lg transition-shadow hover:shadow-xl"
    :class="bgColorClass"
  >
    <div class="p-6 md:p-7">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <!-- Content (Left Side) -->
        <div class="min-w-0 flex-1 space-y-1.5 font-poppins text-[13px] text-gray-700">
          <h3 class="mb-2 font-lora text-[15px] leading-snug font-bold text-brand-primary">
            <span v-if="paper.paper_code">{{ paper.paper_code }}:</span> {{ paper.title }}
          </h3>

          <p>
            <span class="font-bold text-gray-900">By:</span>
            <span class="ml-1 text-brand-primary">{{ paper.authors }}</span>
          </p>

          <p>
            <span class="font-bold text-gray-900">Track:</span> {{ paper.track }}
          </p>

          <p v-if="paper.keywords">
            <span class="font-bold text-gray-900">Keyword:</span> {{ paper.keywords }}
          </p>

          <p>
            <span class="font-bold text-gray-900">Included in the conference proceedings?:</span>
            <span
              class="ml-1 font-bold"
              :class="String(paper.is_has_permission_to_publish) === '1' || paper.is_has_permission_to_publish === true ? 'text-green-600' : 'text-red-600'"
            >
              {{ String(paper.is_has_permission_to_publish) === '1' || paper.is_has_permission_to_publish === true ? 'Yes' : 'No' }}
            </span>
          </p>

          <p>
            <span class="font-bold text-gray-900">Status:</span> {{ paper.current_status || paper.status }}
          </p>

          <p>
            <span class="font-bold text-gray-900">Created Date:</span> {{ paper.created || paper.submittedDate }}
            <span class="ml-2 font-bold text-gray-900">Last Updated:</span> {{ paper.updated || paper.submittedDate }}
          </p>

          <p>
            <span class="font-bold text-gray-900">Final Decision:</span>
            <span
              class="ml-1 font-bold capitalize"
              :class="{
                'text-green-700': (paper.final_decision || '').toLowerCase() === 'accepted',
                'text-red-600': (paper.final_decision || '').toLowerCase() === 'rejected',
                'text-gray-600': !(paper.final_decision || '').toLowerCase(),
              }"
            >
              {{ paper.final_decision || 'Pending' }}
            </span>
          </p>

          <div
            v-if="paper.paper_file_name && pdfUrl"
            class="mt-4 pt-2"
          >
            <span class="mb-1 block font-bold text-gray-900">Paper (before review):</span>
            <a
              :href="pdfUrl"
              target="_blank"
              class="inline-flex items-center gap-2 text-brand-primary hover:underline"
            >
              <svg
                class="size-6 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M10 12v6" />
                <path d="M8 15h4" />
                <path d="M16 12v6" />
              </svg>
              {{ paper.paper_file_name }}
            </a>
          </div>
        </div>

        <!-- Actions (Right Side) -->
        <div class="flex shrink-0 flex-col gap-2 sm:w-64">
          <div class="flex gap-2">
            <NuxtLink
              :to="`/submit-paper/${paper.id}?action=view`"
              class="flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-center text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Paper View
            </NuxtLink>
            <NuxtLink
              to="#"
              class="flex-1 rounded border border-green-600 bg-green-500 px-2 py-1.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-600"
            >
              Add Reviewer
            </NuxtLink>
          </div>

          <div class="flex gap-2">
            <NuxtLink
              to="#"
              class="flex-1 rounded border border-cyan-500 bg-cyan-400 px-2 py-1.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-500"
            >
              Final Decision?
            </NuxtLink>
            <div
              v-if="viewType === 'all-papers'"
              class="flex-1"
            />
            <NuxtLink
              v-if="viewType === 'my-papers'"
              :to="`/submit-paper/${paper.id}?action=edit`"
              class="flex-1 rounded border border-brand-secondary bg-brand-secondary px-2 py-1.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-secondary/90"
            >
              Edit
            </NuxtLink>
          </div>

          <NuxtLink
            v-if="viewType === 'my-papers'"
            to="#"
            class="rounded border border-blue-600 bg-blue-500 px-2 py-1.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Submit Final Paper
          </NuxtLink>

          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            :download="paper.paper_file_name ?? 'paper.pdf'"
            target="_blank"
            class="mt-2 rounded bg-brand-primary-dark px-2 py-1.5 text-center text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </div>
      </div>
    </div>

    <!-- Status accent bar -->
    <div
      class="h-1 w-full"
      :class="statusConfig[paper.status]?.dot || 'bg-gray-300'"
    />
  </div>
</template>
