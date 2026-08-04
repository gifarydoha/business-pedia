<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";

const { form, nextStep, prevStep } = useSubmissionWizard();

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.value.paperFile = target.files?.[0] ?? null;
};

const handleSubmit = () => {
  nextStep(); // lands on the preview step
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

    <input
      type="file"
      accept=".pdf"
      class="mb-5 block font-poppins text-sm"
      @change="handleFile"
    >

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
      <button
        type="button"
        class="rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
        @click="prevStep"
      >
        &lt;&lt; Author Information
      </button>
      <button
        type="button"
        :disabled="!form.paperFile"
        class="rounded-full bg-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
        @click="handleSubmit"
      >
        Preview
      </button>
    </div>
  </div>
</template>
