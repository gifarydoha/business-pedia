<!-- app/pages/submit-paper.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"], // Basic auth for now, role can be added later
});

useSeoMeta({ title: "Submit a Paper" });

const title = ref("");
const abstract = ref("");
const file = ref<File | null>(null);

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0] || null;
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-gray-900">
        Submit a Paper
      </h1>
      <p class="text-gray-500">
        Please fill out the form below to submit your manuscript for review.
      </p>
    </div>

    <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <form class="space-y-6">
        <UFormGroup
          label="Paper Title"
          required
        >
          <UInput
            v-model="title"
            placeholder="Enter the full title of your paper"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup
          label="Abstract"
          required
        >
          <UTextarea
            v-model="abstract"
            placeholder="Provide a brief summary of your research..."
            :rows="6"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup
          label="Manuscript File (PDF/Word)"
          required
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            class="file:bg-brand-primary-light file:text-brand-primary hover:file:bg-brand-primary block
              w-full text-sm text-gray-500
              transition-colors file:mr-4
              file:cursor-pointer file:rounded-md
              file:border-0 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:transition-colors hover:file:text-white"
            @change="handleFileChange"
          >
          <p class="mt-2 text-xs text-gray-500">
            Max file size: 10MB.
          </p>
        </UFormGroup>

        <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <UButton
            variant="soft"
            color="neutral"
          >
            Save as Draft
          </UButton>
          <UButton class="btn-brand-primary">
            Submit for Review
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
