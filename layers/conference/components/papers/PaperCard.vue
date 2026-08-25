<script setup lang="ts">
import { computed } from "vue";
import type { Paper } from "~/layers/conference/types/paper";
import { Button } from "~/layers/base/components/ui/button";
import {
  FileText,
  Eye,
  Edit3,
  UserPlus,
  CheckCircle,
  UploadCloud,
  DownloadCloud,
  Users,
  Tag,
  Calendar,
  Clock,
  BookOpen,
} from "@lucide/vue";

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

const PDF_BASE_PATH = "fdrives/sid/sbacbackend/conference/2026";

const pdfUrl = computed(() =>
  props.paper.paper_file_name
    ? `${confBase}/${PDF_BASE_PATH}/${props.paper.paper_file_name}`
    : null,
);

const isAccepted = computed(() => (props.paper.final_decision || "").toLowerCase() === "accept");
const isRejected = computed(() => (props.paper.final_decision || "").toLowerCase() === "reject");

// Soft accent per decision — icon circle tint, not a heavy border block
const decisionTone = computed(() => {
  if (isAccepted.value) return { icon: "text-green-600", ring: "bg-green-50", badge: "bg-green-100 text-green-700" };
  if (isRejected.value) return { icon: "text-destructive", ring: "bg-destructive/10", badge: "bg-destructive/10 text-destructive" };
  return { icon: "text-brand-primary", ring: "bg-brand-primary-light", badge: "bg-brand-accent text-brand-accent-foreground" };
});

const isPublishable = computed(() =>
  String(props.paper.is_has_permission_to_publish) === "1" || props.paper.is_has_permission_to_publish === true,
);
</script>

<template>
  <div class="rounded-3xl border border-brand-primary/8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-7">
    <!-- Top row: decision icon badge + title + status pills -->
    <div class="mb-6 flex items-start gap-4">
      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
        :class="decisionTone.ring"
      >
        <CheckCircle
          v-if="isAccepted"
          class="size-6"
          :class="decisionTone.icon"
        />
        <FileText
          v-else
          class="size-6"
          :class="decisionTone.icon"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="mb-1.5 flex flex-wrap items-center gap-2">
          <span
            v-if="paper.paper_code"
            class="rounded-full bg-brand-primary-light px-2.5 py-0.5 font-poppins text-xs font-semibold text-brand-primary-dark"
          >
            {{ paper.paper_code }}
          </span>
          <span class="rounded-full px-2.5 py-0.5 font-poppins text-xs font-medium" :class="decisionTone.badge">
            {{ paper.final_decision || 'Pending' }}
          </span>
          <span class="rounded-full bg-brand-accent px-2.5 py-0.5 font-poppins text-xs font-medium text-brand-accent-foreground">
            {{ paper.current_status }}
          </span>
        </div>
        <h3 class="font-lora text-lg leading-snug font-semibold text-brand-footer">
          {{ paper.title }}
        </h3>
      </div>
    </div>

    <!-- Soft stat-chip metadata grid, mirrors dashboard-card feel -->
    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-2xl bg-brand-surface p-3.5">
        <Users class="mb-2 size-4 text-brand-primary/60" />
        <p class="mb-0.5 truncate font-poppins text-xs text-muted-foreground">Authors</p>
        <p class="truncate font-poppins text-sm font-semibold text-brand-footer">{{ paper.authors }}</p>
      </div>
      <div class="rounded-2xl bg-brand-surface p-3.5">
        <Tag class="mb-2 size-4 text-brand-primary/60" />
        <p class="mb-0.5 font-poppins text-xs text-muted-foreground">Track</p>
        <p class="truncate font-poppins text-sm font-semibold text-brand-footer">{{ paper.track }}</p>
      </div>
      <div class="rounded-2xl bg-brand-surface p-3.5">
        <Calendar class="mb-2 size-4 text-brand-primary/60" />
        <p class="mb-0.5 font-poppins text-xs text-muted-foreground">Created</p>
        <p class="truncate font-poppins text-sm font-semibold text-brand-footer">{{ paper.created || paper.submittedDate }}</p>
      </div>
      <div class="rounded-2xl bg-brand-surface p-3.5">
        <Clock class="mb-2 size-4 text-brand-primary/60" />
        <p class="mb-0.5 font-poppins text-xs text-muted-foreground">Updated</p>
        <p class="truncate font-poppins text-sm font-semibold text-brand-footer">{{ paper.updated || paper.submittedDate }}</p>
      </div>
    </div>

    <!-- Keywords + proceedings, low-emphasis inline row -->
    <div class="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-brand-primary/8 pt-4">
      <p
        v-if="paper.keywords"
        class="font-poppins text-xs text-muted-foreground"
      >
        <span class="font-medium text-brand-footer/70">Keywords:</span> {{ paper.keywords }}
      </p>
      <p class="font-poppins text-xs text-muted-foreground">
        <span class="font-medium text-brand-footer/70">In proceedings:</span>
        <span class="ml-1 font-semibold" :class="isPublishable ? 'text-brand-primary' : 'text-destructive'">
          {{ isPublishable ? 'Yes' : 'No' }}
        </span>
      </p>
    </div>

    <!-- Paper file chip -->
    <a
      v-if="paper.paper_file_name && pdfUrl"
      :href="pdfUrl"
      target="_blank"
      class="mb-6 inline-flex items-center gap-3 rounded-2xl bg-brand-surface px-4 py-3 font-poppins text-sm font-medium text-brand-footer transition-colors hover:bg-brand-primary-light"
    >
      <BookOpen class="size-4 shrink-0 text-brand-primary" />
      <span class="max-w-xs truncate sm:max-w-md">{{ paper.paper_file_name }}</span>
    </a>

    <!-- Actions: one clear primary, rest as compact pills -->
    <div class="flex flex-wrap items-center gap-2 border-t border-brand-primary/8 pt-5">
      <NuxtLink :to="`/submit-paper/${paper.id}?action=view`">
        <Button
          variant="outline"
          size="sm"
          class="rounded-full border-brand-primary/25 font-poppins text-brand-primary hover:bg-brand-primary-light"
        >
          <Eye class="mr-1.5 size-4" />
          View
        </Button>
      </NuxtLink>

      <NuxtLink to="#">
        <Button
          variant="outline"
          size="sm"
          class="rounded-full border-brand-primary/25 font-poppins text-brand-primary hover:bg-brand-primary-light"
        >
          <UserPlus class="mr-1.5 size-4" />
          Reviewer
        </Button>
      </NuxtLink>

      <NuxtLink to="#">
        <Button
          variant="outline"
          size="sm"
          class="rounded-full border-brand-secondary/40 font-poppins text-brand-secondary-foreground hover:bg-brand-accent"
        >
          <CheckCircle class="mr-1.5 size-4" />
          Decision
        </Button>
      </NuxtLink>

      <a
        v-if="pdfUrl"
        :href="pdfUrl"
        :download="paper.paper_file_name ?? 'paper.pdf'"
        target="_blank"
      >
        <Button
          variant="outline"
          size="sm"
          class="rounded-full border-border font-poppins text-foreground hover:bg-muted"
        >
          <DownloadCloud class="mr-1.5 size-4" />
          Download
        </Button>
      </a>

      <div class="flex-1" />

      <template v-if="viewType === 'my-papers'">
        <NuxtLink :to="`/submit-paper/${paper.id}?action=edit`">
          <Button
            variant="outline"
            size="sm"
            class="rounded-full border-brand-primary/25 font-poppins text-brand-primary hover:bg-brand-primary-light"
          >
            <Edit3 class="mr-1.5 size-4" />
            Edit
          </Button>
        </NuxtLink>

        <NuxtLink to="#">
          <Button
            variant="default"
            size="sm"
            class="rounded-full bg-brand-primary font-poppins text-brand-primary-foreground hover:bg-brand-primary-dark"
          >
            <UploadCloud class="mr-1.5 size-4" />
            Submit Final
          </Button>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>