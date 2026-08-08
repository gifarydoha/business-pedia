<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({ layout: "conference" });
useSeoMeta({ title: "My Conference Papers" });

type PaperStatus = "Under Review" | "Accepted" | "Rejected" | "Draft";

type Paper = {
  id: string;
  title: string;
  track: string;
  status: PaperStatus;
  submittedDate: string;
  abstract: string;
  authors: string;
};

const papers = ref<Paper[]>([
  {
    id: "PAP-2023-001",
    title: "Microfinance as a Catalyst for SDG Achievement: Evidence from Rural Bangladesh",
    track: "Finance & the SDGs",
    status: "Accepted",
    submittedDate: "14 July 2023",
    abstract: "This paper examines the direct relationship between microfinance penetration and SDG indicator performance across 64 districts in Bangladesh, drawing on panel data from 2015–2022.",
    authors: "Dr. Amara Osei-Bonsu, Prof. Tariq Rahman",
  },
  {
    id: "PAP-2023-002",
    title: "Social Business Funds and Youth Entrepreneurship: A Comparative Study of Germany and Bangladesh",
    track: "Marketing & Entrepreneurship",
    status: "Under Review",
    submittedDate: "3 August 2023",
    abstract: "Drawing on 48 semi-structured interviews with social business fund recipients in two countries, this study identifies shared success factors and structural barriers to youth entrepreneurship.",
    authors: "Dr. Amara Osei-Bonsu",
  },
  {
    id: "PAP-2023-003",
    title: "Measuring Non-Financial Returns: A Framework for Social Business Impact Assessment",
    track: "Finance & the SDGs",
    status: "Rejected",
    submittedDate: "22 August 2023",
    abstract: "We propose a standardised impact measurement framework for social businesses, tested against 120 enterprises across South Asia and Europe, identifying key non-financial value dimensions.",
    authors: "Dr. Amara Osei-Bonsu, Dr. Kenji Nakamura, Ms. Fatima Al-Rashid",
  },
]);

const statusConfig: Record<PaperStatus, { bg: string; text: string; dot: string }> = {
  "Accepted": {
    bg: "bg-cfp-olive/10",
    text: "text-cfp-olive",
    dot: "bg-cfp-olive",
  },
  "Under Review": {
    bg: "bg-cfp-yellow/15",
    text: "text-amber-700",
    dot: "bg-cfp-yellow",
  },
  "Rejected": {
    bg: "bg-cfp-red/10",
    text: "text-cfp-red",
    dot: "bg-cfp-red",
  },
  "Draft": {
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};

type FilterTab = "All" | PaperStatus;
const filterTabs: FilterTab[] = ["All", "Accepted", "Under Review", "Rejected"];

const preview = ref<Paper | null>(null);
const activeFilter = ref<FilterTab>("All");

const filtered = computed(() => {
  return activeFilter.value === "All"
    ? papers.value
    : papers.value.filter((p) => p.status === activeFilter.value);
});

const counts = computed(() => ({
  "All": papers.value.length,
  "Accepted": papers.value.filter((p) => p.status === "Accepted").length,
  "Under Review": papers.value.filter((p) => p.status === "Under Review").length,
  "Rejected": papers.value.filter((p) => p.status === "Rejected").length,
  "Draft": papers.value.filter((p) => p.status === "Draft").length,
}));

const closePreview = () => {
  preview.value = null;
};
</script>

<template>
  <div>
    <!-- Preview Modal -->
    <div
      v-if="preview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click="closePreview"
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
            @click="closePreview"
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
            @click="closePreview"
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

    <CfpSharedBreadcrumb :crumbs="[{ label: 'My Conference Papers' }]" />

    <!-- Page header -->
    <div class="bg-cfp-olive">
      <div class="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span class="font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase">
              SBAC 2023
            </span>
            <h1 class="mt-1 mb-2 font-lora text-3xl font-bold text-white md:text-4xl">
              My Conference Papers
            </h1>
            <p class="font-poppins text-sm text-white/70">
              Conference ID: <span class="font-mono text-cfp-yellow/80">SBAC-2023-BD</span>
            </p>
          </div>
          <NuxtLink
            to="/submit-paper"
            class="self-start rounded-full bg-cfp-red px-7 py-3 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90 sm:shrink-0 sm:self-auto"
          >
            + Submit New Paper
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <!-- Filter tabs + summary -->
      <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in filterTabs"
            :key="tab"
            class="rounded-full border px-4 py-1.5 font-poppins text-sm transition-colors"
            :class="[
              activeFilter === tab
                ? 'border-cfp-olive bg-cfp-olive text-white'
                : 'border-cfp-olive/20 bg-white text-gray-600 hover:border-cfp-olive/40',
            ]"
            @click="activeFilter = tab"
          >
            {{ tab }}
            <span
              class="ml-1.5 text-xs font-semibold"
              :class="activeFilter === tab ? 'text-cfp-yellow' : 'text-gray-400'"
            >
              {{ counts[tab] }}
            </span>
          </button>
        </div>

        <p class="font-poppins text-sm text-gray-400">
          {{ filtered.length }} paper{{ filtered.length !== 1 ? 's' : '' }} shown
        </p>
      </div>

      <!-- Empty state -->
      <div
        v-if="filtered.length === 0"
        class="rounded-2xl border border-cfp-olive/15 bg-white p-16 text-center shadow-lg"
      >
        <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-cfp-olive-pale">
          <svg
            class="size-7 text-cfp-olive/50"
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
        <h3 class="mb-2 font-lora text-xl font-bold text-cfp-olive">
          {{ activeFilter === 'All' ? 'No papers submitted yet' : `No ${activeFilter} papers` }}
        </h3>
        <p class="mx-auto mb-6 max-w-sm font-poppins text-sm text-gray-500">
          {{ activeFilter === 'All'
            ? 'You have not submitted any papers for this conference yet. Get started by clicking below.'
            : `You don't have any papers with "${activeFilter}" status.` }}
        </p>
        <NuxtLink
          to="/submit-paper"
          class="inline-block rounded-full bg-cfp-red px-8 py-3 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit Your First Paper
        </NuxtLink>
      </div>

      <!-- Paper cards -->
      <div
        v-if="filtered.length > 0"
        class="space-y-5"
      >
        <div
          v-for="paper in filtered"
          :key="paper.id"
          class="overflow-hidden rounded-2xl border border-cfp-olive/15 bg-white shadow-lg transition-shadow hover:shadow-xl"
        >
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

              <!-- Actions -->
              <div class="flex shrink-0 gap-3 md:flex-col">
                <button
                  class="flex-1 rounded-full border-2 border-cfp-olive/30 px-5 py-2 text-center font-lora text-sm font-bold text-cfp-olive transition-colors hover:border-cfp-olive hover:bg-cfp-olive-pale md:flex-none"
                  @click="preview = paper"
                >
                  Preview
                </button>
                <NuxtLink
                  :to="`/submit-paper/${paper.id}`"
                  class="flex-1 rounded-full border-2 border-cfp-olive px-5 py-2 text-center font-lora text-sm font-bold text-cfp-olive transition-colors hover:bg-cfp-olive hover:text-white md:flex-none"
                >
                  Edit
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Status accent bar -->
          <div
            class="h-1 w-full"
            :class="statusConfig[paper.status].dot"
          />
        </div>
      </div>

      <!-- Bottom CTA -->
      <div
        v-if="papers.length > 0"
        class="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-6 sm:flex-row sm:items-center"
      >
        <div>
          <p class="font-lora text-base font-semibold text-cfp-olive">
            Submit another paper before the deadline
          </p>
          <p class="mt-0.5 font-poppins text-sm text-gray-500">
            Deadline: <span class="font-semibold text-cfp-red">31 January 2024</span>
          </p>
        </div>
        <NuxtLink
          to="/submit-paper"
          class="shrink-0 rounded-full bg-cfp-red px-7 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Submit a Paper
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
