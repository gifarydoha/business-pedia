<script setup lang="ts">
import { useConferenceService } from "~~/layers/conference/services/conference.service";
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { CONFERENCE_TRACKS } from "~~/layers/conference/types/submission";

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "Edit Paper Submission" });

const route = useRoute();
const paperId = route.params.id as string;

// console.log("Edit page loaded for Paper ID:", paperId);

const { currentStep, form, submitted, reset } = useSubmissionWizard();

// Ensure we never show the success screen when editing an existing paper.
submitted.value = false;
const { getConferencePaper } = useConferenceService();
const authStore = useAuthStore();

const { data: paperData, status } = await useAsyncData(`paper-${paperId}`, () => getConferencePaper(paperId, "10", authStore.user?.id || ""));

// watch(error, (err) => {
//   if (err) console.error("Failed to fetch paper:", err);
// }, { immediate: true });

// Define a local type for the expected API response to avoid 'any'
type ApiPaperResponse = {
  conference_paper?: {
    title?: string;
    abstract?: string;
    keywords?: string;
    is_has_permission_to_publish?: string;
    conference_track_id?: string;
    authors?: Array<{
      id?: string;
      first_name?: string;
      last_name?: string;
      other_name?: string;
      gender?: string;
      email?: string;
      country_id?: string;
      organization?: string;
      position?: string;
      is_corresponding_author?: string;
    }>;
  };
};

watch(paperData, (newVal) => {
  const data = newVal as ApiPaperResponse | null;
  if (data && data.conference_paper) {
    const p = data.conference_paper;

    form.value.title = p.title || "";
    form.value.abstract = p.abstract || "";
    form.value.keywords = p.keywords || "";
    form.value.includeInProceedings = p.is_has_permission_to_publish === "1";

    if (p.conference_track_id) {
      const trackIndex = parseInt(p.conference_track_id) - 1;
      if (trackIndex >= 0 && trackIndex < CONFERENCE_TRACKS.length) {
        form.value.track = CONFERENCE_TRACKS[trackIndex] || "";
      }
    }

    if (p.authors && Array.isArray(p.authors)) {
      form.value.authors = p.authors.map((a, idx: number) => ({
        id: a.id || String(idx + 1),
        firstName: a.first_name || "",
        lastName: a.last_name || "",
        otherName: a.other_name || "",
        gender: (a.gender as "male" | "female" | "") || "",
        email: a.email || "",
        country: a.country_id ? parseInt(a.country_id) : "",
        organization: a.organization || "",
        position: a.position || "",
        isCorrespondingAuthor: a.is_corresponding_author === "1",
      }));
    }
    else {
      form.value.authors = [];
    }

    currentStep.value = "preview";
  }
}, { immediate: true });

const resetAndGo = () => {
  reset();
  navigateTo("/submit-paper");
};
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-14">
    <div
      v-if="status === 'pending'"
      class="py-16 text-center font-poppins text-gray-500"
    >
      Loading paper details...
    </div>

    <div v-else>
      <div v-if="submitted">
        <CfpSubmitSuccess
          :form="form"
          :next-steps="[]"
          @reset="resetAndGo"
        />
      </div>
      <div v-else>
        <h1 class="mb-1 font-lora text-2xl font-bold text-cfp-olive">
          Paper Submission
        </h1>
        <p class="mb-8 border-b border-cfp-olive/10 pb-5 font-poppins text-sm text-gray-500">
          Please fill up the following fields with necessary information. You can save your work and update later.
        </p>

        <CfpSubmitStepTrack v-if="currentStep === 'track'" />
        <CfpSubmitStepDetails v-else-if="currentStep === 'details'" />
        <CfpSubmitStepAuthors v-else-if="currentStep === 'authors'" />
        <CfpSubmitStepUpload v-else-if="currentStep === 'upload'" />
        <CfpSubmitStepPreview v-else-if="currentStep === 'preview'" />
      </div>
    </div>
  </div>
</template>
