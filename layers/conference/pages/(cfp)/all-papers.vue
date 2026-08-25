<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { ConferenceInitialResponse, ConferenceTrack } from "~/layers/conference/types/conference";
import PaperCard from "~/layers/conference/components/papers/PaperCard.vue";
import { useConferenceService } from "~/layers/conference/services/conference.service";
import { useConferencePapersList } from "~/layers/conference/composables/useConferencePapersList";

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "All Papers" });


const { getAllConferencePapers, getConferenceInitial } = useConferenceService();
const authStore = useAuthStore();

const selectedTrack = ref("");
const selectedStatus = ref("");

const conferenceTracks = ref<ConferenceTrack[]>([]);
const paperStatuses = ref<Record<string, string>>({});

const { data: initialData } = useAsyncData("conference-initial", () => getConferenceInitial());

watchEffect(() => {
  if (initialData.value) {
    const data = initialData.value as ConferenceInitialResponse;
    if (data.conference_tracks) {
      conferenceTracks.value = data.conference_tracks;
    }
    if (data.paper_statuses) {
      paperStatuses.value = data.paper_statuses;
    }
  }
});

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

const { papers, preview, pdfPreviewUrl } = useConferencePapersList(rawPapers);
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
            <option
              v-for="track in conferenceTracks"
              :key="track.id"
              :value="track.id"
            >
              {{ track.name }}
            </option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
          >
            <option
              v-for="(name, key) in paperStatuses"
              :key="key"
              :value="key"
            >
              {{ name }}
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
        v-else-if="papers.length === 0"
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
        v-if="papers.length > 0 && status !== 'pending'"
        class="space-y-5"
      >
        <PaperCard
          v-for="paper in papers"
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
