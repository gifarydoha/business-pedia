<script setup lang="ts">
import { useConferenceService } from "#layers/conference/services/conference.service";
import { toRaw } from "vue";
import { useSubmissionWizard } from "~~/layers/conference/composables/useSubmissionWizard";
import { COUNTRIES, CONFERENCE_TRACKS, type PresentationTrack } from "~~/layers/conference/types/submission";

const getCountryName = (countryId: number | "") => {
  if (!countryId) return "";
  const country = COUNTRIES.find((c) => c.id === countryId);
  return country ? country.name : "";
};

const { form, goToStep, submit } = useSubmissionWizard();
const { submitConferencePaper } = useConferenceService();
const toast = useToast();

const submitPaper = async () => {
  const formData = new FormData();
  console.log("Submitted Data:", toRaw(form.value));

  formData.append("title", form.value.title);
  formData.append("abstract", form.value.abstract);
  formData.append("keywords", form.value.keywords);

  formData.append("paper_code", "P-" + Math.floor(Math.random() * 1000000));
  formData.append("is_has_permission_to_publish", form.value.includeInProceedings ? "1" : "0");
  formData.append("email_notification_to_author", "1");

  const trackIndex = CONFERENCE_TRACKS.indexOf(form.value.track as PresentationTrack);
  if (trackIndex !== -1) {
    formData.append("conference_track_id", (trackIndex + 1).toString());
  }

  form.value.authors.forEach((a, index) => {
    formData.append(`authors[${index}][first_name]`, a.firstName);
    formData.append(`authors[${index}][last_name]`, a.lastName);
    formData.append(`authors[${index}][other_name]`, a.otherName || "");
    formData.append(`authors[${index}][email]`, a.email);
    formData.append(`authors[${index}][gender]`, a.gender);
    formData.append(`authors[${index}][country_id]`, a.country.toString());
    formData.append(`authors[${index}][organization]`, a.organization);
    formData.append(`authors[${index}][position]`, a.position);
    formData.append(`authors[${index}][is_corresponding_author]`, a.isCorrespondingAuthor ? "1" : "0");
  });

  if (form.value.paperFile) {
    formData.append("paper_file", form.value.paperFile);
  }

  formData.append("conference_id", "10");
  // formData.append('is_my_paper', '1');

  try {
    const response = await submitConferencePaper(formData) as { code: number; message?: string };

    if (response.code === 200) {
      toast.add({
        title: "Success",
        description: "Paper successfully submitted!",
        color: "success",
      });
      submit();
      navigateTo("/my-papers");
    }
    else {
      toast.add({
        title: "Submission failed",
        description: response.message || "An unknown error occurred.",
        color: "warning",
      });
      console.error(response.message);
    }
  }
  catch (error: unknown) {
    const err = error as Error;
    toast.add({
      title: "Submission failed",
      description: err.message || "An error occurred during submission.",
      color: "warning",
    });
    console.error("Upload failed", error);
  }
};
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
          {{ a.email }} · {{ a.organization }} · {{ getCountryName(a.country) }}
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

    <div class="mt-8 flex justify-end">
      <button
        type="button"
        class="rounded-full bg-cfp-red px-8 py-3 font-lora text-sm font-bold text-white shadow transition-opacity hover:opacity-90"
        @click="submitPaper"
      >
        Submit Form
      </button>
    </div>
  </div>
</template>
