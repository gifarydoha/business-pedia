<script setup lang="ts">
import { ref, reactive } from "vue";

import type { SubmissionFormData } from "~~/layers/base/types/api";

const emit = defineEmits<{
  (e: "success", form: SubmissionFormData): void;
}>();

const tracks = [
  "Health & Sport",
  "Education",
  "Technology and Artificial Intelligence",
  "Finance and the SDGs",
  "Marketing and Entrepreneurship",
  "Environment, Disaster Management and Pollution Control",
  "Wealth Creation and Other Issues",
];

const emptyForm = {
  title: "",
  authors: "",
  affiliation: "",
  track: "",
  abstract: "",
  presentationType: "",
  email: "",
  file: null as File | null,
};

const form = reactive({ ...emptyForm });
const errors = ref<Record<string, string>>({});

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.file = target.files?.[0] ?? null;
  if (errors.value.file) delete errors.value.file;
};

const validate = () => {
  const errs: Record<string, string> = {};
  if (!form.title.trim()) errs.title = "Paper title is required.";
  if (!form.authors.trim()) errs.authors = "At least one author name is required.";
  if (!form.affiliation.trim()) errs.affiliation = "Institutional affiliation is required.";
  if (!form.track) errs.track = "Please select a conference track.";
  if (!form.abstract.trim()) errs.abstract = "Abstract text is required.";
  else if (form.abstract.trim().split(/\s+/).length < 50) errs.abstract = "Abstract should be at least 50 words.";
  if (!form.presentationType) errs.presentationType = "Please select a presentation type.";
  if (!form.email.trim()) errs.email = "Contact email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
  return errs;
};

const handleSubmit = (e: Event) => {
  e.preventDefault();
  errors.value = {};

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    errors.value = errs;
    return;
  }

  emit("success", { ...form });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const clearError = (field: string) => {
  if (errors.value[field]) Reflect.deleteProperty(errors.value, field);
};

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border font-poppins text-sm text-gray-800 bg-white px-4 py-3 outline-none transition-colors ${hasError
    ? "border-cfp-red focus:border-cfp-red focus:ring-1 focus:ring-cfp-red"
    : "border-cfp-olive/25 focus:border-cfp-olive focus:ring-1 focus:ring-cfp-olive"
  }`;
</script>

<template>
  <form
    novalidate
    class="space-y-7"
    @submit="handleSubmit"
  >
    <div class="space-y-6 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg md:p-8">
      <h2 class="border-b border-cfp-olive/10 pb-3 font-lora text-xl font-bold text-cfp-olive">
        Paper Details
      </h2>

      <div>
        <label
          for="title"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Paper Title <span class="text-cfp-red">*</span>
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter the full title of your paper"
          :class="inputClass(!!errors.title)"
          @input="clearError('title')"
        >
        <p
          v-if="errors.title"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label
          for="authors"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Author(s) <span class="text-cfp-red">*</span>
        </label>
        <input
          id="authors"
          v-model="form.authors"
          type="text"
          placeholder="e.g. Dr. Jane Smith, Prof. John Doe"
          :class="inputClass(!!errors.authors)"
          @input="clearError('authors')"
        >
        <p class="mt-1 font-poppins text-xs text-gray-400">
          Separate multiple authors with commas. Do not include in manuscript (blind review).
        </p>
        <p
          v-if="errors.authors"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.authors }}
        </p>
      </div>

      <div>
        <label
          for="affiliation"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Institutional Affiliation <span class="text-cfp-red">*</span>
        </label>
        <input
          id="affiliation"
          v-model="form.affiliation"
          type="text"
          placeholder="e.g. Glasgow Caledonian University"
          :class="inputClass(!!errors.affiliation)"
          @input="clearError('affiliation')"
        >
        <p
          v-if="errors.affiliation"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.affiliation }}
        </p>
      </div>

      <div>
        <label
          for="track"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Conference Track <span class="text-cfp-red">*</span>
        </label>
        <div class="relative">
          <select
            id="track"
            v-model="form.track"
            :class="[inputClass(!!errors.track), 'appearance-none pr-10']"
            @change="clearError('track')"
          >
            <option value="">
              Select a track…
            </option>
            <option
              v-for="t in tracks"
              :key="t"
              :value="t"
            >
              {{ t }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="size-4 text-cfp-olive/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <p
          v-if="errors.track"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.track }}
        </p>
      </div>
    </div>

    <div class="space-y-6 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg md:p-8">
      <h2 class="border-b border-cfp-olive/10 pb-3 font-lora text-xl font-bold text-cfp-olive">
        Abstract &amp; Upload
      </h2>

      <div>
        <label
          for="abstract"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Abstract <span class="text-cfp-red">*</span>
        </label>
        <textarea
          id="abstract"
          v-model="form.abstract"
          rows="7"
          placeholder="Paste your abstract here (minimum 300 words recommended). Include research question, methodology, and expected contribution."
          :class="[inputClass(!!errors.abstract), 'resize-y']"
          @input="clearError('abstract')"
        />
        <p class="mt-1 font-poppins text-xs text-gray-400">
          {{ form.abstract.trim() ? form.abstract.trim().split(/\s+/).length : 0 }} words
        </p>
        <p
          v-if="errors.abstract"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.abstract }}
        </p>
      </div>

      <div>
        <label
          for="file"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Full Paper or Abstract File
        </label>
        <div
          :class="[
            'rounded-xl border-2 border-dashed p-6 text-center transition-colors',
            errors.file ? 'border-cfp-red' : 'border-cfp-olive/25 hover:border-cfp-olive/50',
          ]"
        >
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx"
            class="sr-only"
            @change="handleFile"
          >
          <label
            for="file"
            class="block cursor-pointer"
          >
            <svg
              class="mx-auto mb-3 size-8 text-cfp-olive/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <template v-if="form.file">
              <span class="font-poppins text-sm font-medium text-cfp-olive">{{ form.file.name }}</span>
            </template>
            <template v-else>
              <span class="font-poppins text-sm font-medium text-cfp-olive">
                Click to upload
              </span>
              <span class="font-poppins text-sm text-gray-400"> or drag and drop</span>
              <p class="mt-1 font-poppins text-xs text-gray-400">PDF, DOC, DOCX (optional)</p>
            </template>
          </label>
        </div>
        <p
          v-if="errors.file"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.file }}
        </p>
      </div>
    </div>

    <div class="space-y-6 rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg md:p-8">
      <h2 class="border-b border-cfp-olive/10 pb-3 font-lora text-xl font-bold text-cfp-olive">
        Presentation &amp; Contact
      </h2>

      <div>
        <label class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive">
          Presentation Type <span class="text-cfp-red">*</span>
        </label>
        <div class="space-y-3">
          <label
            v-for="opt in [
              { val: 'in-person', label: 'In-person', desc: 'Attend and present in Bangkok (recommended)' },
              { val: 'online', label: 'Online', desc: 'Present remotely via the conference platform' },
            ]"
            :key="opt.val"
            :class="[
              'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
              form.presentationType === opt.val
                ? 'border-cfp-olive bg-cfp-olive-pale'
                : 'border-cfp-olive/20 hover:border-cfp-olive/40',
            ]"
          >
            <input
              v-model="form.presentationType"
              type="radio"
              :value="opt.val"
              class="mt-0.5 accent-cfp-olive"
              @change="clearError('presentationType')"
            >
            <div>
              <div class="font-poppins text-sm font-semibold text-cfp-olive">{{ opt.label }}</div>
              <div class="font-poppins text-xs text-gray-500">{{ opt.desc }}</div>
            </div>
          </label>
        </div>
        <p
          v-if="errors.presentationType"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.presentationType }}
        </p>
      </div>

      <div>
        <label
          for="email"
          class="mb-1.5 block font-poppins text-sm font-medium text-cfp-olive"
        >
          Contact Email Address <span class="text-cfp-red">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="author@university.edu"
          :class="inputClass(!!errors.email)"
          @input="clearError('email')"
        >
        <p
          v-if="errors.email"
          class="mt-1 font-poppins text-xs text-cfp-red"
        >
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-5 shadow-lg">
      <p class="font-poppins text-xs leading-relaxed text-gray-600">
        By submitting, you confirm that this work is original, not under review elsewhere,
        and that all named authors have consented to submission. You agree to SBAC's
        ethical publication guidelines. At least one author will register and present if
        accepted.
      </p>
    </div>

    <button
      type="submit"
      class="w-full rounded-full bg-cfp-red px-8 py-4 font-lora text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
    >
      Submit Paper for Review
    </button>
  </form>
</template>
