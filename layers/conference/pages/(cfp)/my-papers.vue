<script setup lang="ts">
import { ref, computed } from "vue";
import type { Paper, PaperStatus } from "~/layers/conference/types/paper";
import PaperPreviewModal from "~/layers/conference/components/papers/PaperPreviewModal.vue";
import PdfPreviewModal from "~/layers/conference/components/papers/PdfPreviewModal.vue";
import PaperCard from "~/layers/conference/components/papers/PaperCard.vue";
import { useConferenceService } from "~/layers/conference/services/conference.service";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "My Conference Papers" });

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
  id?: string | number;
  paper_id?: string | number;
  paper_uid?: string | number;
  title?: string;
  paper_title?: string;
  conference_track_name?: string;
  track?: string;
  track_name?: string;
  category?: string;
  final_decision?: string;
  current_status?: string;
  created?: string;
  submittedDate?: string;
  submitted_date?: string;
  created_at?: string;
  abstract?: string;
  paper_abstract?: string;
  authors?: string | RawAuthor[];
  [key: string]: unknown;
}

const papers = computed<Paper[]>(() => {
  if (!rawPapers.value) return [];

  const response = rawPapers.value as RawPaper[] | { conference_papers?: RawPaper[]; data?: RawPaper[] } | null;
  let items: RawPaper[] = [];
  if (Array.isArray(response)) {
    items = response;
  }
  else if (response && typeof response === "object") {
    if (Array.isArray(response.conference_papers)) {
      items = response.conference_papers;
    }
    else if (Array.isArray(response.data)) {
      items = response.data;
    }
  }

  return items.map((p) => {
    let authorNames = "Unknown Authors";
    let authorsData: string | RawAuthor[] | undefined = p.authors;

    if (typeof authorsData === "string") {
      try {
        const parsed = JSON.parse(authorsData) as unknown;
        if (Array.isArray(parsed)) {
          authorsData = parsed as RawAuthor[];
        }
      }
      catch (e) {
        console.error(e);
        // Ignore if not valid JSON
      }
    }

    if (Array.isArray(authorsData)) {
      authorNames = authorsData.map((a: RawAuthor) => `${a.first_name || ""} ${a.last_name || ""}`.trim()).join(", ");
    }
    else if (typeof authorsData === "string" && authorsData.trim() !== "") {
      authorNames = authorsData;
    }

    let mappedStatus: PaperStatus = "Draft";
    if (p.final_decision === "accepted") {
      mappedStatus = "Accepted";
    }
    else if (p.final_decision === "rejected") {
      mappedStatus = "Rejected";
    }
    else if (p.current_status === "submitted" || p.current_status === "under_review") {
      mappedStatus = "Under Review";
    }
    else if (p.current_status === "abstract_saved") {
      mappedStatus = "Draft";
    }

    return {
      ...p,
      id: String(p.id || p.paper_id || p.paper_uid || Math.random()),
      title: String(p.title || p.paper_title || "Untitled"),
      track: String(p.conference_track_name || p.track || p.track_name || p.category || "Uncategorized"),
      status: mappedStatus,
      submittedDate: String(p.created || p.submittedDate || p.submitted_date || p.created_at || "Unknown Date"),
      abstract: String(p.abstract || p.paper_abstract || "No abstract provided."),
      authors: authorNames || "Unknown Authors",
    } as unknown as Paper;
  });
});

type FilterTab = "All" | PaperStatus;
// const filterTabs: FilterTab[] = ["All", "Accepted", "Under Review", "Rejected"];

const preview = ref<Paper | null>(null);
const activeFilter = ref<FilterTab>("All");

const filtered = computed(() => {
  return activeFilter.value === "All"
    ? papers.value
    : papers.value.filter((p) => p.status === activeFilter.value);
});

// const counts = computed(() => ({
//   "All": papers.value.length,
//   "Accepted": papers.value.filter((p) => p.status === "Accepted").length,
//   "Under Review": papers.value.filter((p) => p.status === "Under Review").length,
//   "Rejected": papers.value.filter((p) => p.status === "Rejected").length,
//   "Draft": papers.value.filter((p) => p.status === "Draft").length,
// }));

const closePreview = () => {
  preview.value = null;
};

const pdfPreviewUrl = ref<string | null>(null);
</script>

<template>
  <div class="bg-brand-primary-light/40">
    <!-- Preview Modal -->
    <PaperPreviewModal
      v-if="preview"
      :preview="preview"
      @close="closePreview"
    />

    <!-- PDF Preview Modal -->
    <PdfPreviewModal
      v-if="pdfPreviewUrl"
      :pdf-url="pdfPreviewUrl"
      @close="pdfPreviewUrl = null"
    />

    <CfpSharedBreadcrumb :crumbs="[{ label: 'My Conference Papers' }]" />

    <!-- Page header -->
    <div
      class="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5"
    >
      <h1 class="mb-6 font-lora text-2xl font-bold text-brand-primary md:text-3xl">
        Social Business Academia Conference
      </h1>

      <div class="flex flex-wrap items-center gap-5">
        <NuxtLink
          to="/my-papers"
          class="font-poppins text-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-brand-primary"
        >
          My Papers
        </NuxtLink>
        <NuxtLink
          :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
          class="rounded-full bg-destructive px-6 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit Paper' }}
        </NuxtLink>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 py-10 md:py-14">
      <!-- Filter tabs + summary -->
      <!-- <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in filterTabs"
            :key="tab"
            class="rounded-full border px-4 py-1.5 font-poppins text-sm transition-colors"
            :class="[
              activeFilter === tab
                ? 'border-brand-primary bg-brand-primary text-white'
                : 'border-brand-primary/20 bg-white text-gray-600 hover:border-brand-primary/40',
            ]"
            @click="activeFilter = tab"
          >
            {{ tab }}
            <span
              class="ml-1.5 text-xs font-semibold"
              :class="activeFilter === tab ? 'text-brand-secondary' : 'text-gray-400'"
            >
              {{ counts[tab] }}
            </span>
          </button>
        </div>

        <p class="font-poppins text-sm text-gray-400">
          {{ filtered.length }} paper{{ filtered.length !== 1 ? 's' : '' }} shown
        </p>
      </div> -->

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

      <!-- Bottom CTA -->
      <!-- <div
        v-if="papers.length === 0"
        class="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-primary/15 bg-brand-primary-light p-6 sm:flex-row sm:items-center"
      >
        <div>
          <p class="font-lora text-base font-semibold text-brand-primary">
            Submit another paper before the deadline
          </p>
          <p class="mt-0.5 font-poppins text-sm text-gray-500">
            Deadline: <span class="font-semibold text-destructive">31 January 2024</span>
          </p>
        </div>
        <NuxtLink
          to="/submit-paper"
          class="shrink-0 rounded-full bg-destructive px-7 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit a Paper
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>
