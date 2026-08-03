<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ layout: "cfp" });

useSeoMeta({
  title: "Submit Your Paper — SBAC 2026",
});

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

interface SubmissionFormData {
  title: string;
  authors: string;
  affiliation: string;
  track: string;
  abstract: string;
  presentationType: string;
  email: string;
  file: File | null;
}

const submitted = ref(false);
const submittedForm = ref<SubmissionFormData | null>(null);

const handleSuccess = (form: SubmissionFormData) => {
  submittedForm.value = form;
  submitted.value = true;
};

const handleReset = () => {
  submittedForm.value = null;
  submitted.value = false;
};
</script>

<template>
  <div>
    <!-- Success screen -->
    <CfpSubmissionSuccess
      v-if="submitted"
      :form="submittedForm"
      :next-steps="nextSteps"
      @reset="handleReset"
    />

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
          <CfpSubmissionForm @success="handleSuccess" />
          <CfpSubmitSidebar :next-steps="nextSteps" />
        </div>
      </div>
    </div>
  </div>
</template>
