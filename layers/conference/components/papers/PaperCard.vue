<script setup lang="ts">
import { computed } from "vue";
import type { Paper } from "~/layers/conference/types/paper";
import { Button } from "~/layers/base/components/ui/button";
import { FileText, Eye, Edit3, UserPlus, CheckCircle, UploadCloud, DownloadCloud } from "@lucide/vue";

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
  if (decision === "accept") return "bg-green-50 border-l-4 border-l-green-500 border-green-200";
  if (decision === "reject") return "bg-red-50 border-l-4 border-l-red-500 border-red-200";
  return "bg-brand-surface border-l-4 border-l-brand-primary border-brand-primary/15";
});

const isAccepted = computed(() => (props.paper.final_decision || "").toLowerCase() === "accept");
const isRejected = computed(() => (props.paper.final_decision || "").toLowerCase() === "reject");
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
    :class="bgColorClass"
  >
    <div class="p-6 md:p-8">
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <!-- Content (Left Side) -->
        <div class="min-w-0 flex-1 space-y-4 font-poppins text-sm text-brand-footer">
          <!-- Title & Code -->
          <h3 class="font-lora text-lg leading-tight font-semibold text-brand-footer">
            <span
              v-if="paper.paper_code"
              class="mr-2 inline-flex items-center rounded-full bg-brand-primary-light px-2.5 py-0.5 text-xs font-semibold text-brand-primary-dark"
            >{{ paper.paper_code }}</span>
            {{ paper.title }}
          </h3>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6">
            <p class="sm:col-span-2">
              <span class="font-semibold text-brand-footer">By:</span>
              <span class="ml-1 text-brand-primary">{{ paper.authors }}</span>
            </p>

            <p class="sm:col-span-2">
              <span class="font-semibold text-brand-footer">Track:</span> {{ paper.track }}
            </p>

            <p
              v-if="paper.keywords"
              class="sm:col-span-2"
            >
              <span class="font-semibold text-brand-footer">Keyword:</span>
              <span class="ml-1 text-brand-footer/80">{{ paper.keywords }}</span>
            </p>

            <p>
              <span class="font-semibold text-brand-footer">Status:</span>
              <span class="ml-1 inline-flex items-center rounded-full bg-brand-accent px-2.5 py-0.5 text-xs font-medium text-brand-accent-foreground">
                {{ paper.current_status }}
              </span>
            </p>

            <p>
              <span class="font-semibold text-brand-footer">Final Decision:</span>
              <span
                class="ml-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize font-lora"
                :class="{
                  'bg-green-100 text-green-700': isAccepted,
                  'bg-red-100 text-red-700': isRejected,
                  'bg-brand-accent text-brand-accent-foreground': !isAccepted && !isRejected,
                }"
              >
                {{ paper.final_decision || 'Pending' }}
              </span>
            </p>

            <p>
              <span class="font-semibold text-brand-footer">Created Date:</span>
              <span class="ml-1 text-brand-footer/80">{{ paper.created || paper.submittedDate }}</span>
            </p>

            <p>
              <span class="font-semibold text-brand-footer">Last Updated:</span>
              <span class="ml-1 text-brand-footer/80">{{ paper.updated || paper.submittedDate }}</span>
            </p>

            <p class="sm:col-span-2">
              <span class="font-semibold text-brand-footer">Included in the conference proceedings?:</span>
              <span
                class="ml-1 font-semibold"
                :class="String(paper.is_has_permission_to_publish) === '1' || paper.is_has_permission_to_publish === true ? 'text-brand-primary' : 'text-destructive'"
              >
                {{ String(paper.is_has_permission_to_publish) === '1' || paper.is_has_permission_to_publish === true ? 'Yes' : 'No' }}
              </span>
            </p>
          </div>

          <!-- Paper File -->
          <div
            v-if="paper.paper_file_name && pdfUrl"
            class="mt-6 border-t border-brand-primary/10 pt-4"
          >
            <span class="mb-3 block font-semibold text-brand-footer">Paper (before review):</span>
            <a
              :href="pdfUrl"
              target="_blank"
              class="inline-flex items-center gap-3 rounded-lg border border-brand-primary/20 bg-brand-primary-light px-4 py-2.5 text-sm font-medium text-brand-primary-dark shadow-sm transition-all hover:bg-brand-primary/20 hover:text-brand-footer hover:shadow"
            >
              <FileText class="size-5 text-destructive" />
              <span class="max-w-xs truncate sm:max-w-md">{{ paper.paper_file_name }}</span>
            </a>
          </div>
        </div>

        <!-- Actions (Right Side) -->
        <div class="grid w-full shrink-0 grid-cols-2 gap-2 sm:w-64">
          <NuxtLink
            :to="`/submit-paper/${paper.id}?action=view`"
            class="col-span-1 block"
          >
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-start border-brand-primary text-brand-primary font-lora hover:bg-brand-primary hover:text-brand-primary-foreground"
            >
              <Eye class="mr-2 size-4" />
              Paper View
            </Button>
          </NuxtLink>

          <NuxtLink
            to="#"
            class="col-span-1 block"
          >
            <Button
              variant="default"
              size="sm"
              class="w-full justify-start bg-brand-primary text-brand-primary-foreground font-lora hover:bg-brand-primary-dark"
            >
              <UserPlus class="mr-2 size-4" />
              Add Reviewer
            </Button>
          </NuxtLink>

          <NuxtLink
            to="#"
            class="col-span-1 block"
          >
            <Button
              variant="default"
              size="sm"
              class="w-full justify-start bg-brand-secondary text-brand-secondary-foreground font-lora hover:bg-brand-secondary/80"
            >
              <CheckCircle class="mr-2 size-4" />
              Final Decision?
            </Button>
          </NuxtLink>
          
          <template v-if="viewType === 'my-papers'">
            <NuxtLink
              :to="`/submit-paper/${paper.id}?action=edit`"
              class="col-span-1 block"
            >
              <Button
                variant="outline"
                size="sm"
                class="w-full justify-start border-brand-primary text-brand-primary font-lora hover:bg-brand-primary-light"
              >
                <Edit3 class="mr-2 size-4" />
                Edit
              </Button>
            </NuxtLink>

            <NuxtLink
              to="#"
              class="col-span-2 block"
            >
              <Button
                variant="default"
                size="sm"
                class="w-full justify-start bg-brand-primary-dark text-white font-lora hover:bg-brand-primary"
              >
                <UploadCloud class="mr-2 size-4" />
                Submit Final Paper
              </Button>
            </NuxtLink>
          </template>
          
          <!-- Spacer for all-papers layout -->
          <div v-else class="col-span-1 hidden sm:block"></div>

          <div class="col-span-2 my-1 h-px w-full bg-brand-primary/10" />

          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            :download="paper.paper_file_name ?? 'paper.pdf'"
            target="_blank"
            class="col-span-2 block"
          >
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-start font-lora border-border text-foreground hover:bg-muted"
            >
              <DownloadCloud class="mr-2 size-4" />
              Download
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
