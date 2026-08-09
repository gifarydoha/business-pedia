<script setup lang="ts">
import { useConferenceService } from "~~/layers/conference/services/conference.service";
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";

definePageMeta({ layout: "conference" });
useSeoMeta({ title: "Edit Paper Submission" });

const route = useRoute();
const paperId = route.params.id as string;

console.log("Edit page loaded for Paper ID:", paperId);

const { currentStep, form } = useSubmissionWizard();
const { getConferencePaper } = useConferenceService();

const { data: paperData, status, error } = await useAsyncData(`paper-${paperId}`, () => getConferencePaper(paperId, "10", "101"));

watch(error, (err) => {
  if (err) console.error("Failed to fetch paper:", err);
}, { immediate: true });

watch(paperData, (newVal: unknown) => {
  const data = newVal as {
    conference_paper?: {
      title?: string;
      abstract?: string;
      keywords?: string;
      is_has_permission_to_publish?: string;
    };
  };

  if (data && data.conference_paper) {
    const p = data.conference_paper;

    form.value.title = p.title || "";
    form.value.abstract = p.abstract || "";
    form.value.keywords = p.keywords || "";
    form.value.includeInProceedings = p.is_has_permission_to_publish === "1";

    currentStep.value = "preview";
  }
}, { immediate: true });
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
</template>
