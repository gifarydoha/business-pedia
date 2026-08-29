<script setup lang="ts">
import type { CfpNextStep } from "~~/layers/base/types/api";
import type { SubmissionFormData } from "~~/layers/conference/types/submission";
// import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

// const { hasSubmittedPaper, submittedPaperId } = useUserPaper();

defineProps<{
  form: SubmissionFormData | null;
  nextSteps: CfpNextStep[];
}>();

defineEmits<{
  (e: "reset"): void;
}>();
</script>

<template>
  <div>
    <!-- <CfpSharedBreadcrumb
      :crumbs="[
        {
          label: hasSubmittedPaper.value ? 'Edit Your Paper' : 'Submit Your Paper',
          href: hasSubmittedPaper.value ? `/submit-paper/${submittedPaperId.value}` : '/submit-paper/draft',
        },
        { label: 'Confirmation' },
      ]"
    /> -->
    <div class="flex min-h-96 items-center justify-center px-6 py-24">
      <div class="w-full max-w-7xl text-center">
        <div class="mb-6 flex justify-center">
          <CfpSharedLogo class="h-16 w-auto" />
        </div>
        <div class="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-brand-primary/10">
          <svg
            class="size-8 text-brand-primary"
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
        <h1 class="mb-4 font-lora text-3xl font-bold text-brand-primary">
          Submission Received!
        </h1>
        <p class="mx-auto mb-2 max-w-3xl font-poppins leading-relaxed text-gray-600">
          Thank you, <strong class="text-brand-primary">{{ form?.authors?.[0]?.firstName }} {{ form?.authors?.[0]?.lastName }}</strong>.
          Your paper <em>"{{ form?.title }}"</em> has been submitted successfully for SBAC 2026.
        </p>
        <!-- <p class="mb-8 font-poppins text-sm text-gray-500">
          A confirmation email will be sent to
          <span class="font-medium text-brand-primary">{{ form?.authors?.[0]?.email }}</span> within 24 hours.
        </p> -->

        <!-- What happens next -->
        <div
          v-if="nextSteps && nextSteps.length"
          class="mb-8 rounded-2xl border border-brand-primary/15 bg-white p-6 text-left shadow-lg"
        >
          <h2 class="mb-4 font-lora text-lg font-semibold text-brand-primary">
            What Happens Next
          </h2>
          <ol class="space-y-3">
            <li
              v-for="s in nextSteps"
              :key="s.n"
              class="flex items-start gap-3"
            >
              <span
                class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary font-lora text-xs font-bold text-white"
              >
                {{ s.n }}
              </span>
              <div>
                <span class="font-poppins text-sm font-semibold text-brand-primary">{{ s.title }}</span>
                <p class="font-poppins text-sm text-gray-600">
                  {{ s.detail }}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/my-papers"
            class="rounded-full bg-brand-primary px-7 py-3 font-lora font-bold text-white transition-opacity hover:opacity-90"
          >
            Go to My Papers
          </NuxtLink>
          <NuxtLink
            to="/"
            class="rounded-full border border-brand-primary px-7 py-3 font-lora font-bold text-brand-primary transition-opacity hover:opacity-90"
          >
            Back to Home
          </NuxtLink>
          <!-- <button
            class="rounded-full border-2 border-brand-primary px-7 py-3 font-lora font-bold text-brand-primary transition-colors hover:bg-brand-primary/5"
            @click="$emit('reset')"
          >
            Submit Another Paper
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>
