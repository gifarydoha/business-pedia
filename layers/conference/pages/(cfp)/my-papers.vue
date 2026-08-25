<script setup lang="ts">
import { ref, computed } from "vue";
import type { Paper, PaperStatus } from "~/layers/conference/types/paper";
import PaperCard from "~/layers/conference/components/papers/PaperCard.vue";
import { useConferenceService } from "~/layers/conference/services/conference.service";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "My Papers" });

const { getConferencePapers } = useConferenceService();
const authStore = useAuthStore();
const { data: rawPapers, status } = useLazyAsyncData("my-papers", () => getConferencePapers("10", authStore.user?.id || ""), {
  server: false,
});

interface RawAuthor {
  first_name?: string;
  last_name?: string;
}

interface RawPaper {
  id: string;
  title: string;
  abstract: string;
  conference_track_name: string;
  current_status?: string;
  final_decision?: string;
  created?: string;
  authors: RawAuthor[];
  [key: string]: unknown;
}

const papers = computed<Paper[]>(() => {
  const response = rawPapers.value as { conference_papers?: RawPaper[] } | null;
  if (!response?.conference_papers) return [];

  return response.conference_papers.map((p) => {
    let status: PaperStatus = "Draft";
    if (p.final_decision === "accepted") status = "Accepted";
    else if (p.final_decision === "rejected") status = "Rejected";
    else if (p.current_status === "submitted" || p.current_status === "under_review") status = "Under Review";

    return {
      ...p,
      id: String(p.id),
      title: p.title || "Untitled",
      abstract: p.abstract || "No abstract provided.",
      track: p.conference_track_name || "Uncategorized",
      status,
      submittedDate: p.created || "Unknown Date",
      authors: Array.isArray(p.authors)
        ? p.authors.map((a) => `${a.first_name || ""} ${a.last_name || ""}`.trim()).join(", ")
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
    <CfpSharedBreadcrumb :crumbs="[{ label: 'My Papers' }]" />

    <div class="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
      <!-- Loading state -->
      <div
        v-if="status === 'pending' || status === 'idle'"
        class="flex flex-col items-center justify-center rounded-2xl border border-brand-primary/15 bg-white p-16 shadow-lg"
      >
        <div class="size-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p class="mt-4 font-poppins text-sm text-gray-500">
          Loading your papers...
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
          {{ activeFilter === 'All' ? 'No papers submitted yet' : `No ${activeFilter} papers` }}
        </h3>
        <p class="mx-auto mb-6 max-w-sm font-poppins text-sm text-gray-500">
          {{ activeFilter === 'All'
            ? 'You have not submitted any papers for this conference yet. Get started by clicking below.'
            : `You don't have any papers with "${activeFilter}" status.` }}
        </p>
        <NuxtLink
          :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
          class="inline-block rounded-full bg-destructive px-8 py-3 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit Your First Paper' }}
        </NuxtLink>
      </div>

      <!-- Paper cards -->
      <div
        v-if="filtered.length > 0"
        class="space-y-5"
      >
        <PaperCard
          v-for="paper in filtered"
          :key="paper.id"
          :paper="paper"
          @preview="preview = paper"
          @preview-pdf="url => pdfPreviewUrl = url"
        />
      </div>
    </div>
  </div>
</template>
