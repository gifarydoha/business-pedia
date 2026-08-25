<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { CONFERENCE_TRACKS } from "~~/layers/conference/types/submission";

const { form, prevStep, submitPaper, isEditMode, skipSubmission } = useSubmissionWizard();

const getTrackName = (trackId: number | "") => {
  if (!trackId) return "";
  const track = CONFERENCE_TRACKS.find((t) => t.id === trackId);
  return track ? track.name : "";
};
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="mb-1 font-poppins text-base font-semibold text-gray-500 uppercase">
        Selected Track
      </p>
      <p class="font-poppins text-2xl font-semibold text-brand-primary">
        {{ getTrackName(form.track) }}
      </p>
    </div>

    <h2 class="mb-1 font-lora text-lg font-bold text-brand-primary">
      Title &amp; Abstract
    </h2>
    <p class="mb-5 font-poppins text-sm text-gray-500">
      You can change paper title, abstract and keywords before the submission deadline.
    </p>

    <div class="mb-5">
      <label class="mb-1 block font-poppins text-sm font-medium text-brand-primary">
        Title <span class="text-destructive">*</span>
      </label>
      <textarea
        v-model="form.title"
        rows="2"
        class="w-full rounded-xl border border-brand-primary/25 bg-white p-3 font-poppins text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-brand-primary"
      />
    </div>

    <div class="mb-5">
      <label class="mb-1 block font-poppins text-sm font-medium text-brand-primary">
        Abstract <span class="text-destructive">*</span>
      </label>
      <textarea
        v-model="form.abstract"
        rows="8"
        class="w-full rounded-xl border border-brand-primary/25 bg-white p-3 font-poppins text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-brand-primary"
      />
    </div>

    <div class="mb-8">
      <label class="mb-1 block font-poppins text-sm font-medium text-brand-primary">
        Keywords <span class="text-destructive">*</span>
      </label>
      <textarea
        v-model="form.keywords"
        rows="3"
        placeholder="Comma-separated keywords"
        class="w-full rounded-xl border border-brand-primary/25 bg-white p-3 font-poppins text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-brand-primary"
      />
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
          :disabled="!form.title || !form.abstract || !form.keywords"
          class="cursor-pointer rounded-full bg-brand-secondary px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
          @click="submitPaper"
        >
          Submit & Continue
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="rounded-full border border-brand-primary px-6 py-2.5 font-lora text-sm font-bold text-brand-primary"
          @click="prevStep"
        >
          &lt;&lt; Change Track
        </button>
        <button
          type="button"
          :disabled="!form.title || !form.abstract || !form.keywords"
          class="rounded-full bg-brand-primary px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
          @click="submitPaper"
        >
          Save and Continue &gt;&gt;
        </button>
      </template>
    </div>
  </div>
</template>
