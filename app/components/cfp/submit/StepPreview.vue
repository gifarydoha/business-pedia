<script setup lang="ts">
import { useSubmissionWizard } from "~/composables/useSubmissionWizard";

const { form, goToStep } = useSubmissionWizard();
</script>

<template>
  <div>
    <h2 class="mb-6 font-lora text-xl font-bold text-cfp-olive">
      Paper Detail
    </h2>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-sm font-semibold text-cfp-olive">
          Title &amp; Abstract
        </h3>
        <button
          class="rounded-full border border-cfp-olive px-3 py-1 font-poppins text-xs text-cfp-olive"
          @click="goToStep('details')"
        >
          Edit
        </button>
      </div>
      <p class="mb-2 font-poppins text-sm font-semibold">
        {{ form.title }}
      </p>
      <p class="font-poppins text-sm leading-relaxed text-gray-600">
        {{ form.abstract }}
      </p>
      <p class="mt-2 font-poppins text-xs text-gray-500">
        Keywords: {{ form.keywords }}
      </p>
    </section>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-sm font-semibold text-cfp-olive">
          Paper Track
        </h3>
        <button
          class="rounded-full border border-cfp-olive px-3 py-1 font-poppins text-xs text-cfp-olive"
          @click="goToStep('track')"
        >
          Edit
        </button>
      </div>
      <p class="font-poppins text-sm">
        {{ form.track }}
      </p>
    </section>

    <section class="mb-6 border-b border-cfp-olive/10 pb-5">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-sm font-semibold text-cfp-olive">
          Author Information
        </h3>
        <button
          class="rounded-full border border-cfp-olive px-3 py-1 font-poppins text-xs text-cfp-olive"
          @click="goToStep('authors')"
        >
          Edit
        </button>
      </div>
      <div
        v-for="(a, i) in form.authors"
        :key="a.id"
        class="mb-3 rounded-lg bg-gray-50 p-3"
      >
        <p class="font-poppins text-sm font-semibold">
          Author {{ i + 1 }}: {{ a.firstName }} {{ a.lastName }}
        </p>
        <p class="font-poppins text-xs text-gray-500">
          {{ a.email }} · {{ a.organization }} · {{ a.country }}
        </p>
      </div>
    </section>

    <section class="mb-6">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-poppins text-sm font-semibold text-cfp-olive">
          Paper File
        </h3>
        <button
          class="rounded-full border border-cfp-olive px-3 py-1 font-poppins text-xs text-cfp-olive"
          @click="goToStep('upload')"
        >
          Edit
        </button>
      </div>
      <p class="font-poppins text-sm">
        {{ form.paperFile?.name ?? 'No file uploaded' }}
      </p>
      <p class="font-poppins text-xs text-gray-500">
        Include in proceedings: {{ form.includeInProceedings ? 'Yes' : 'No' }}
      </p>
    </section>
  </div>
</template>
