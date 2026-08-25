<script setup lang="ts">
import { ref, computed } from "vue";
import type { Paper, PaperStatus } from "~/layers/conference/types/paper";
import PaperCard from "~/layers/conference/components/papers/PaperCard.vue";
import { useConferenceService } from "~/layers/conference/services/conference.service";

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "All Papers" });

const { getAllConferencePapers } = useConferenceService();
const authStore = useAuthStore();

const selectedTrack = ref("");
const selectedStatus = ref("");

const { data: rawPapers, status } = useLazyAsyncData(
  "all-papers",
  () => getAllConferencePapers("10", authStore.user?.id || "", {
    conference_track_id: selectedTrack.value || undefined,
    status: selectedStatus.value || undefined,
  }),
  {
    server: false,
    watch: [selectedTrack, selectedStatus],
  },
);

interface RawAuthor {
  first_name?: string;
  last_name?: string;
  is_corresponding_author?: string | number | boolean;
}

interface RawPaper {
  id: string;
  title: string;
  abstract: string;
  conference_track_name: string;
  paper_code?: string;
  keywords?: string;
  is_has_permission_to_publish?: string | number | boolean;
  current_status?: string;
  final_decision?: string;
  created?: string;
  updated?: string;
  paper_file_name?: string;
  authors: RawAuthor[];
  [key: string]: unknown;
}

const papers = computed<Paper[]>(() => {
  const response = rawPapers.value as { conference_papers?: RawPaper[] } | null;
  if (!response?.conference_papers) return [];

  return response.conference_papers.map((p) => {
    let paperStatus: PaperStatus = "Draft";
    if (p.final_decision === "accepted") paperStatus = "Accepted";
    else if (p.final_decision === "rejected") paperStatus = "Rejected";
    else if (p.current_status === "submitted" || p.current_status === "under_review") paperStatus = "Under Review";

    return {
      ...p,
      id: String(p.id),
      paper_code: p.paper_code,
      title: p.title || "Untitled",
      abstract: p.abstract || "No abstract provided.",
      track: p.conference_track_name || "Uncategorized",
      keywords: p.keywords,
      is_has_permission_to_publish: p.is_has_permission_to_publish,
      current_status: p.current_status,
      created: p.created,
      updated: p.updated,
      final_decision: p.final_decision,
      paper_file_name: p.paper_file_name,
      status: paperStatus,
      submittedDate: p.created || "Unknown Date",
      authors: Array.isArray(p.authors)
        ? p.authors
          .filter((a) => String(a.is_corresponding_author) === "1" || a.is_corresponding_author === true)
          .map((a) => `${a.first_name || ""} ${a.last_name || ""}`.trim())
          .join(", ") || p.authors.map((a) => `${a.first_name || ""} ${a.last_name || ""}`.trim()).join(", ")
        : "Unknown Authors",
    } as Paper;
  });
});

type FilterTab = "All" | PaperStatus;

const preview = ref<Paper | null>(null);
const activeFilter = ref<FilterTab>("All");

const filtered = computed(() => {
  return activeFilter.value === "All"
    ? papers.value
    : papers.value.filter((p) => p.status === activeFilter.value);
});

const pdfPreviewUrl = ref<string | null>(null);
</script>

<template>
  <div class="flex grow flex-col bg-brand-primary-light/40">
    <CfpSharedBreadcrumb :crumbs="[{ label: 'All Papers' }]" />

    <div class="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
      <div class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 class="font-lora text-2xl font-bold text-brand-primary">
          All Submitted Papers
        </h2>

        <div class="flex gap-4">
          <!-- Track Filter -->
          <select
            v-model="selectedTrack"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">
              All Tracks
            </option>
            <option value="30">
              Track 30
            </option>
            <!-- Add more track options here dynamically later if needed -->
          </select>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">
              All Statuses
            </option>
            <option value="no_decision">
              No Decision
            </option>
            <option value="accepted">
              Accepted
            </option>
            <option value="rejected">
              Rejected
            </option>
            <option value="under_review">
              Under Review
            </option>
          </select>
        </div>
      </div>

      <!-- Loading state -->
      <div
        v-if="status === 'pending'"
        class="flex flex-col items-center justify-center rounded-2xl border border-brand-primary/15 bg-white p-16 shadow-lg"
      >
        <div class="size-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p class="mt-4 font-poppins text-sm text-gray-500">
          Loading papers...
        </p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filtered.length === 0"
        class="rounded-2xl border border-brand-primary/15 bg-white p-16 text-center shadow-lg"
      >
        <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-primary-light">
          <svg
            class="size-7 text-brand-primary/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="mb-2 font-lora text-xl font-bold text-brand-primary">
          No papers found
        </h3>
        <p class="mx-auto max-w-sm font-poppins text-sm text-gray-500">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>

      <!-- Paper cards -->
      <div
        v-if="filtered.length > 0 && status !== 'pending'"
        class="space-y-5"
      >
        <PaperCard
          v-for="paper in filtered"
          :key="paper.id"
          :paper="paper"
          view-type="all-papers"
          @preview="preview = paper"
          @preview-pdf="url => pdfPreviewUrl = url"
        />
      </div>
    </div>
  </div>
</template>
