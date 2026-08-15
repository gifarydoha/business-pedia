<script setup lang="ts">
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { COUNTRIES } from "~~/layers/conference/types/submission";

const getCountryName = (countryId: number | "") => {
  if (!countryId) return "";
  const country = COUNTRIES.find((c) => c.id === countryId);
  return country ? country.name : "";
};

const { form, goToStep, skipSubmission } = useSubmissionWizard();
</script>

<template>
  <div>
    <h2 class="mb-6 font-lora text-3xl font-bold text-cfp-olive">
      Paper Detail
    </h2>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-lg font-semibold text-cfp-olive">
          Title
        </h3>
        <button
          class="rounded-full bg-cfp-yellow px-4 py-2 font-poppins text-sm font-medium text-white"
          @click="goToStep('details')"
        >
          Edit
        </button>
      </div>
      <p class="mb-2 font-poppins text-lg  font-medium text-black">
        {{ form.title }}
      </p>
      <h3 class="font-poppins text-lg font-semibold text-cfp-olive">
        Abstract
      </h3>
      <p class="font-poppins text-sm leading-relaxed text-black">
        {{ form.abstract }}
      </p>
      <p class="mt-2 font-poppins text-xs text-black">
        Keywords: {{ form.keywords }}
      </p>
    </section>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-lg font-semibold text-cfp-olive">
          Paper Track
        </h3>
        <button
          class="rounded-full bg-cfp-yellow px-4 py-2 font-poppins text-sm font-medium text-white"
          @click="goToStep('track')"
        >
          Edit
        </button>
      </div>
      <p class="font-poppins text-sm text-black">
        {{ form.track }}
      </p>
    </section>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-lg font-semibold text-cfp-olive">
          Author Information
        </h3>
        <button
          class="rounded-full bg-cfp-yellow px-4 py-2 font-poppins text-sm font-medium text-white"
          @click="goToStep('authors')"
        >
          Edit
        </button>
      </div>
      <div
        v-for="(a, i) in form.authors"
        :key="a.id"
        class="mb-3 rounded-lg p-3"
      >
        <p class="font-poppins text-sm font-semibold text-black">
          Author {{ i + 1 }}: {{ a.firstName }} {{ a.lastName }}
        </p>
        <p class="font-poppins text-xs text-gray-700">
          {{ a.email }} · {{ a.organization }} · {{ getCountryName(a.country) }}
        </p>
      </div>
    </section>

    <section class="mb-6">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-lg font-semibold text-cfp-olive">
          Paper File
        </h3>
        <button
          class="rounded-full bg-cfp-yellow px-4 py-2 font-poppins text-sm font-medium text-white"
          @click="goToStep('upload')"
        >
          Edit
        </button>
      </div>
      <p class="font-poppins text-sm text-black">
        {{ form.paperFile?.name ?? form.existingPaperFileName ?? 'No file uploaded' }}
      </p>
      <p class="font-poppins text-xs text-gray-500">
        Include in proceedings: {{ form.includeInProceedings ? 'Yes' : 'No' }}
      </p>
    </section>

    <div class="mt-8 flex justify-start gap-4">
      <button
        type="button"
        class="cursor-pointer rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
        @click="skipSubmission"
      >
        Back to My Papers
      </button>
    </div>
  </div>
</template>
