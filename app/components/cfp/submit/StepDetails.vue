<script setup lang="ts">
import { useSubmissionWizard } from "~/composables/useSubmissionWizard";

const { form, nextStep, prevStep } = useSubmissionWizard();
</script>

<template>
  <div>
    <div class="mb-6">
      <p class="mb-1 font-poppins text-xs font-semibold text-gray-500 uppercase">
        Selected Track
      </p>
      <p class="font-poppins text-sm font-medium text-cfp-olive">
        {{ form.track }}
      </p>
    </div>

    <h2 class="mb-1 font-lora text-lg font-bold text-cfp-olive">
      Title &amp; Abstract
    </h2>
    <p class="mb-5 font-poppins text-sm text-gray-500">
      You can change paper title, abstract and keywords before the submission deadline.
    </p>

    <div class="mb-5">
      <label class="mb-1 block font-poppins text-sm font-medium text-cfp-olive">
        Title <span class="text-cfp-red">*</span>
      </label>
      <textarea
        v-model="form.title"
        rows="2"
        class="w-full rounded-xl border border-cfp-olive/25 p-3 font-poppins text-sm outline-none focus:border-cfp-olive"
      />
    </div>

    <div class="mb-5">
      <label class="mb-1 block font-poppins text-sm font-medium text-cfp-olive">
        Abstract <span class="text-cfp-red">*</span>
      </label>
      <textarea
        v-model="form.abstract"
        rows="8"
        class="w-full rounded-xl border border-cfp-olive/25 p-3 font-poppins text-sm outline-none focus:border-cfp-olive"
      />
    </div>

    <div class="mb-8">
      <label class="mb-1 block font-poppins text-sm font-medium text-cfp-olive">
        Keywords <span class="text-cfp-red">*</span>
      </label>
      <textarea
        v-model="form.keywords"
        rows="3"
        placeholder="Comma-separated keywords"
        class="w-full rounded-xl border border-cfp-olive/25 p-3 font-poppins text-sm outline-none focus:border-cfp-olive"
      />
    </div>

    <div class="flex items-center gap-4">
      <button
        type="button"
        class="rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
        @click="prevStep"
      >
        &lt;&lt; Change Track
      </button>
      <button
        type="button"
        :disabled="!form.title || !form.abstract || !form.keywords"
        class="rounded-full bg-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
        @click="nextStep"
      >
        Save and Continue &gt;&gt;
      </button>
    </div>
  </div>
</template>
