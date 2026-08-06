<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";

definePageMeta({ layout: "conference" });
useSeoMeta({ title: "Edit Paper Submission" });

const { currentStep } = useSubmissionWizard();
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-14">
    <h1 class="mb-1 font-lora text-2xl font-bold text-cfp-olive">
      Edit Paper Submission
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
</template>
