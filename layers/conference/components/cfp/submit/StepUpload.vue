<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";

const { form, prevStep, submitPaper, isEditMode, skipSubmission } = useSubmissionWizard();

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.value.paperFile = target.files?.[0] ?? null;
};
</script>

<template>
  <div>
    <h2 class="mb-5 font-lora text-lg font-bold text-cfp-olive">
      Upload Paper (PDF File)
    </h2>
    <p class="mb-5 font-poppins text-sm text-gray-500">
      You can now upload or update your review manuscript for
      <strong>{{ form.title }}</strong>. Only PDF files are accepted.
    </p>

    <div class="relative mb-6 flex w-full max-w-md flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cfp-olive/30 bg-cfp-olive-pale p-8 text-center transition-colors hover:border-cfp-olive hover:bg-cfp-olive-pale/80">
      <input
        type="file"
        accept=".pdf"
        class="absolute inset-0 size-full cursor-pointer opacity-0"
        @change="handleFile"
      >
      <div
        v-if="!form.paperFile"
        class="flex flex-col items-center justify-center space-y-3"
      >
        <div class="rounded-full bg-white p-4 shadow-sm">
          <svg
            class="size-8 text-cfp-olive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p class="font-poppins text-sm font-medium text-gray-700">
          <span class="font-bold text-cfp-olive">Click to upload</span> or drag and drop
        </p>
        <p class="font-poppins text-xs text-gray-500">
          PDF (Max. 10MB)
        </p>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center space-y-3"
      >
        <div class="rounded-full bg-cfp-olive/10 p-4 shadow-sm">
          <svg
            class="size-8 text-cfp-olive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="font-poppins text-sm font-semibold text-cfp-olive">
          {{ form.paperFile.name }}
        </p>
        <p class="font-poppins text-xs text-gray-500">
          Click or drag to replace
        </p>
      </div>
    </div>

    <p class="mb-2 font-poppins text-sm font-medium text-cfp-olive">
      Would you like your paper to be included in the conference proceedings if published?
    </p>
    <div class="mb-8 flex gap-6">
      <label class="flex items-center gap-2 font-poppins text-sm">
        <input
          v-model="form.includeInProceedings"
          type="radio"
          :value="true"
        > Yes
      </label>
      <label class="flex items-center gap-2 font-poppins text-sm">
        <input
          v-model="form.includeInProceedings"
          type="radio"
          :value="false"
        > No
      </label>
    </div>

    <div class="flex items-center gap-4">
      <template v-if="isEditMode">
        <button
          type="button"
          class="rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
          @click="skipSubmission"
        >
          Skip
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
          @click="prevStep"
        >
          &lt;&lt; Author Information
        </button>
      </template>
      <button
        type="button"
        :disabled="!isEditMode && !form.paperFile"
        class="rounded-full bg-cfp-red px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
        @click="submitPaper"
      >
        Submit Form
      </button>
    </div>
  </div>
</template>
