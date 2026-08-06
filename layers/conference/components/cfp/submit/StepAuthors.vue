<script setup lang="ts">
import { computed } from "vue";
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { COUNTRIES } from "~~/layers/conference/types/submission";

const { form, addAuthor, removeAuthor, nextStep, prevStep } = useSubmissionWizard();

const isAuthorsValid = computed(() => {
  if (form.value.authors.length === 0) return false;
  return form.value.authors.every((a) => a.firstName && a.lastName && a.email && a.country && a.organization);
});
</script>

<template>
  <div>
    <h2 class="mb-5 font-lora text-lg font-bold text-cfp-olive">
      Author Information
    </h2>

    <div
      v-for="(author, i) in form.authors"
      :key="author.id"
      class="relative mb-5 rounded-xl bg-gray-50 p-5"
    >
      <button
        v-if="form.authors.length > 1"
        type="button"
        class="absolute top-3 right-3 font-poppins text-sm text-cfp-red"
        @click="removeAuthor(author.id)"
      >
        ✕
      </button>
      <p class="mb-3 font-poppins text-sm font-semibold text-cfp-olive">
        Author {{ i + 1 }}
      </p>

      <div class="mb-3 grid grid-cols-2 gap-3">
        <input
          v-model="author.lastName"
          placeholder="Name"
          class="rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
        >
        <input
          v-model="author.firstName"
          placeholder="First Name"
          class="rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
        >
      </div>

      <div class="mb-3 grid grid-cols-2 gap-3">
        <input
          v-model="author.otherName"
          placeholder="Other Name"
          class="rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
        >
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-1 font-poppins text-sm">
            <input
              v-model="author.gender"
              type="radio"
              value="male"
            > Male
          </label>
          <label class="flex items-center gap-1 font-poppins text-sm">
            <input
              v-model="author.gender"
              type="radio"
              value="female"
            > Female
          </label>
        </div>
      </div>

      <input
        v-model="author.email"
        placeholder="Email"
        class="mb-3 w-full rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
      >

      <select
        v-model="author.country"
        class="mb-3 w-full rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900"
      >
        <option value="">
          Select Country
        </option>
        <option
          v-for="c in COUNTRIES"
          :key="c.id"
          :value="c.id"
        >
          {{ c.name }}
        </option>
      </select>

      <input
        v-model="author.organization"
        placeholder="Organization"
        class="mb-3 w-full rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
      >
      <input
        v-model="author.position"
        placeholder="Position"
        class="mb-3 w-full rounded-lg border border-cfp-olive/20 bg-white px-3 py-2 font-poppins text-sm text-gray-900 placeholder-gray-500"
      >

      <label class="flex items-center gap-2 font-poppins text-sm">
        <input
          v-model="author.isCorrespondingAuthor"
          type="checkbox"
        >
        Is corresponding author?
      </label>
    </div>

    <button
      type="button"
      class="mb-8 rounded-full border border-cfp-olive px-5 py-2 font-lora text-sm font-bold text-cfp-olive"
      @click="addAuthor"
    >
      + Add Author
    </button>

    <div class="flex items-center gap-4">
      <button
        type="button"
        class="rounded-full border border-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-cfp-olive"
        @click="prevStep"
      >
        &lt;&lt; Abstract and Title
      </button>
      <button
        type="button"
        :disabled="!isAuthorsValid"
        class="rounded-full bg-cfp-olive px-6 py-2.5 font-lora text-sm font-bold text-white disabled:opacity-40"
        @click="nextStep"
      >
        Save and Continue &gt;&gt;
      </button>
    </div>
  </div>
</template>
