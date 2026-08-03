<script setup lang="ts">
import { ref, reactive } from "vue";

definePageMeta({ layout: "cfp" });

useSeoMeta({
  title: "Submit Your Paper — SBAC 2026",
});

const tracks = [
  "Health & Sport",
  "Education",
  "Technology and Artificial Intelligence",
  "Finance and the SDGs",
  "Marketing and Entrepreneurship",
  "Environment, Disaster Management and Pollution Control",
  "Wealth Creation and Other Issues",
];

const nextSteps = [
  {
    n: 1,
    title: "Acknowledgement email",
    detail: "You will receive an automated confirmation email within 24 hours of submission.",
  },
  {
    n: 2,
    title: "Assignment to reviewers",
    detail: "The Scientific Committee assigns your submission to two domain experts for double-blind peer review.",
  },
  {
    n: 3,
    title: "Review period",
    detail: "Reviewers evaluate originality, methodology, and relevance. Allow 4–6 weeks for a decision.",
  },
  {
    n: 4,
    title: "Decision notification",
    detail: "You will be notified of acceptance, revision request, or rejection by 20 September 2026.",
  },
  {
    n: 5,
    title: "Camera-ready submission",
    detail: "If accepted, submit your final formatted paper by 25 September 2026 along with registration confirmation.",
  },
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
const submitted = ref(false);
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

  submitted.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const reset = () => {
  Object.assign(form, emptyForm);
  errors.value = {};
  submitted.value = false;
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
  <div>
    <!-- Success screen -->
    <div v-if="submitted">
      <CfpBreadcrumb
        :crumbs="[
          { label: 'Submit Your Paper', href: '/submit-paper' },
          { label: 'Confirmation' },
        ]"
      />
      <div class="flex min-h-96 items-center justify-center px-6 py-24">
        <div class="w-full max-w-xl text-center">
          <div class="mb-6 flex justify-center">
            <CfpLogo class="h-16 w-auto" />
          </div>
          <div class="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-cfp-olive/10">
            <svg
              class="size-8 text-cfp-olive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 class="mb-4 font-lora text-3xl font-bold text-cfp-olive">
            Submission Received!
          </h1>
          <p class="mb-2 font-poppins leading-relaxed text-gray-600">
            Thank you, <strong class="text-cfp-olive">{{ form.authors.split(',')[0]?.trim() }}</strong>.
            Your paper <em>"{{ form.title }}"</em> has been submitted successfully for SBAC 2026.
          </p>
          <p class="mb-8 font-poppins text-sm text-gray-500">
            A confirmation email will be sent to
            <span class="font-medium text-cfp-olive">{{ form.email }}</span> within 24 hours.
          </p>

          <!-- What happens next -->
          <div class="mb-8 rounded-2xl border border-cfp-olive/15 bg-white p-6 text-left shadow-lg">
            <h2 class="mb-4 font-lora text-lg font-semibold text-cfp-olive">
              What Happens Next
            </h2>
            <ol class="space-y-3">
              <li
                v-for="s in nextSteps"
                :key="s.n"
                class="flex items-start gap-3"
              >
                <span
                  class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cfp-olive font-lora text-xs font-bold text-white"
                >
                  {{ s.n }}
                </span>
                <div>
                  <span class="font-poppins text-sm font-semibold text-cfp-olive">{{ s.title }}</span>
                  <p class="font-poppins text-sm text-gray-600">
                    {{ s.detail }}
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/"
              class="rounded-full bg-cfp-olive px-7 py-3 font-lora font-bold text-white transition-opacity hover:opacity-90"
            >
              Back to Home
            </NuxtLink>
            <button
              class="rounded-full border-2 border-cfp-olive px-7 py-3 font-lora font-bold text-cfp-olive transition-colors hover:bg-cfp-olive/5"
              @click="reset"
            >
              Submit Another Paper
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div v-else>
      <CfpBreadcrumb :crumbs="[{ label: 'Submit Your Paper' }]" />

      <!-- Page header -->
      <div class="bg-cfp-olive">
        <div class="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <span
            class="mb-5 inline-block rounded-full bg-cfp-yellow/20 px-4 py-1 font-poppins text-xs font-semibold tracking-widest text-cfp-yellow uppercase"
          >
            Submission Portal
          </span>
          <h1 class="mb-4 font-lora text-3xl leading-tight font-bold text-white md:text-5xl">
            Submit Your Paper
          </h1>
          <p class="max-w-xl font-poppins leading-relaxed text-white/80">
            Submit abstracts or full papers for SBAC 2026. All submissions undergo double-blind
            peer review by our Scientific Committee.
          </p>
        </div>
      </div>

      <div class="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div class="items-start lg:grid lg:grid-cols-[1fr_320px] lg:gap-14">
          <!-- Form column -->
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
                      { val: 'in-person', label: 'In-person', desc: 'Attend and present in Berlin (recommended)' },
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

          <!-- Info sidebar -->
          <aside class="mt-0 hidden lg:block">
            <div class="sticky top-24 space-y-5">
              <!-- What happens next card -->
              <div class="rounded-2xl bg-cfp-olive p-6 text-white shadow-lg">
                <h3 class="mb-5 font-lora text-lg font-bold text-white">
                  What Happens Next
                </h3>
                <ol class="space-y-4">
                  <li
                    v-for="s in nextSteps"
                    :key="s.n"
                    class="flex items-start gap-3"
                  >
                    <span
                      class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cfp-yellow font-lora text-xs font-bold text-cfp-olive"
                    >
                      {{ s.n }}
                    </span>
                    <div>
                      <div class="font-poppins text-sm font-semibold text-white">
                        {{ s.title }}
                      </div>
                      <p class="mt-0.5 font-poppins text-xs leading-relaxed text-white/65">
                        {{ s.detail }}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <!-- Key dates card -->
              <div class="rounded-2xl border border-cfp-olive/15 bg-white p-6 shadow-lg">
                <h3 class="mb-4 font-lora text-base font-semibold text-cfp-olive">
                  Key Dates
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="d in [
                      { label: 'Submission opens', date: '10 March 2026', urgent: false },
                      { label: 'Notification', date: '20 Sep 2026', urgent: false },
                      { label: 'Deadline', date: '31 Jan 2024', urgent: true },
                      { label: 'Conference', date: '1–2 Apr 2024', urgent: false },
                    ]"
                    :key="d.label"
                    class="flex items-start justify-between gap-3"
                  >
                    <span class="font-poppins text-xs text-gray-500">{{ d.label }}</span>
                    <span
                      :class="['text-right font-lora text-xs font-bold', d.urgent ? 'text-cfp-red' : 'text-cfp-olive']"
                    >
                      {{ d.date }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Help link -->
              <div class="rounded-2xl border border-cfp-olive/15 bg-cfp-olive-pale p-5">
                <p class="mb-3 font-poppins text-sm text-gray-600">
                  Questions about submission?
                </p>
                <NuxtLink
                  to="/guidelines"
                  class="font-poppins text-sm font-semibold text-cfp-olive underline underline-offset-2 transition-colors hover:text-cfp-red"
                >
                  Read the full submission guidelines →
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>
