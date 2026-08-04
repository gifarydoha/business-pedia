<script setup lang="ts">
import type { CfpNextStep, SubmissionFormData } from "~~/layers/base/types/api";

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
          Thank you, <strong class="text-cfp-olive">{{ form?.authors?.split(',')[0]?.trim() }}</strong>.
          Your paper <em>"{{ form?.title }}"</em> has been submitted successfully for SBAC 2026.
        </p>
        <p class="mb-8 font-poppins text-sm text-gray-500">
          A confirmation email will be sent to
          <span class="font-medium text-cfp-olive">{{ form?.email }}</span> within 24 hours.
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
            @click="$emit('reset')"
          >
            Submit Another Paper
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
