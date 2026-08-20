<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { CONFERENCE_TRACKS } from "~~/layers/conference/types/submission";

const { form, nextStep, submitPaper, isEditMode, skipSubmission } = useSubmissionWizard();
</script>

<template>
  <div>
    <h2 class="mb-1 font-lora text-lg font-bold text-brand-primary">
      Conference Track Selection
    </h2>
    <p class="mb-5 font-poppins text-sm text-gray-500">
      Please select a track to proceed with your submission.
    </p>

    <div class="mb-8 space-y-3">
      <label
        v-for="track in CONFERENCE_TRACKS"
        :key="track.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors"
        :class="form.track === track.id ? 'border-brand-primary bg-brand-primary-light' : 'border-brand-primary/20 hover:border-brand-primary/40'"
      >
        <input
          v-model="form.track"
          type="radio"
          :value="track.id"
          class="accent-brand-primary"
        >
        <span class="font-poppins text-sm text-gray-700">{{ track.name }}</span>
      </label>
    </div>

    <div class="flex items-center gap-4">
      <template v-if="isEditMode">
        <button
          type="button"
          class="rounded-full border border-brand-primary px-6 py-2.5 font-lora text-sm font-bold text-brand-primary"
          @click="skipSubmission"
        >
          Skip
        </button>
        <button
          type="button"
          :disabled="!form.track"
          class="cursor-pointer rounded-full bg-brand-secondary px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
          @click="submitPaper"
        >
          Submit & Continue
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          :disabled="!form.track"
          class="rounded-full bg-brand-primary px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
          @click="nextStep"
        >
          Continue &gt;&gt;
        </button>
      </template>
    </div>
  </div>
</template>
