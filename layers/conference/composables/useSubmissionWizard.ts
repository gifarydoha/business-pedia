import type { SubmissionFormData, SubmissionAuthor, PresentationTrack } from "~~/layers/conference/types/submission";
import { CONFERENCE_TRACKS } from "~~/layers/conference/types/submission";
import { useConferenceService } from "#layers/conference/services/conference.service";

const STEPS = ["track", "details", "authors", "upload", "preview"] as const;
export type WizardStep = typeof STEPS[number];

let nextAuthorId = 1;

function emptyAuthor(): SubmissionAuthor {
  return {
    id: String(nextAuthorId++),
    firstName: "", lastName: "", otherName: "", gender: "",
    email: "", country: "", organization: "", position: "",
    isCorrespondingAuthor: false,
  };
}

function emptyForm(): SubmissionFormData {
  return {
    track: "", title: "", abstract: "", keywords: "",
    authors: [emptyAuthor()],
    paperFile: null, existingPaperFileName: null, includeInProceedings: null,
  };
}

export const useSubmissionWizard = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const { submitConferencePaper, updateConferencePaper } = useConferenceService();
  const toast = useToast();

  const paperId = computed(() => route.params.id as string | undefined);
  const isEditMode = computed(() => !!paperId.value && paperId.value !== "draft");

  const form = useState<SubmissionFormData>("cfp-submission-form", emptyForm);
  const currentStep = useState<WizardStep>("cfp-submission-step", () => "track");
  const submitted = useState<boolean>("cfp-submission-submitted", () => false);

  const stepIndex = computed(() => STEPS.indexOf(currentStep.value));

  const goToStep = (step: WizardStep) => {
    currentStep.value = step;
  };
  const nextStep = () => {
    const i = stepIndex.value;
    if (i < STEPS.length - 1) currentStep.value = STEPS[i + 1]!;
  };
  const prevStep = () => {
    const i = stepIndex.value;
    if (i > 0) currentStep.value = STEPS[i - 1]!;
  };
  const skipStep = () => nextStep();

  const addAuthor = () => {
    form.value.authors.push(emptyAuthor());
  };
  const removeAuthor = (id: string) => {
    form.value.authors = form.value.authors.filter((a) => a.id !== id);
  };

  const reset = () => {
    form.value = emptyForm();
    currentStep.value = "track";
    submitted.value = false;
  };

  const submit = () => {
    submitted.value = true;
  };

  const skipSubmission = () => {
    navigateTo("/my-papers");
  };

  const submitPaper = async () => {
    const currentUserId = authStore.user?.id || "";

    const formData = new FormData();

    const authors = form.value.authors.map((author) => ({
      account_id: String(currentUserId),
      type: "author",
      ...(isEditMode.value && author.id ? { id: author.id } : {}),
      first_name: author.firstName,
      last_name: author.lastName,
      other_name: author.otherName || "",
      email: author.email,
      gender: author.gender,
      country_id: String(author.country),
      organization: author.organization,
      position: author.position,
      is_corresponding_author: author.isCorrespondingAuthor ? "1" : "0",
    }));

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

    formData.append("authors", JSON.stringify(authors));

    if (form.value.paperFile) {
      formData.append("paper_file_name", form.value.paperFile);
    }

    formData.append("conference_id", "10");
    formData.append("is_my_paper", "1");

    try {
      let response: { code: number; message?: string };

      if (isEditMode.value && paperId.value) {
        response = await updateConferencePaper(paperId.value, formData, currentUserId) as { code: number; message?: string };
        console.log(response);
      }
      else {
        response = await submitConferencePaper(formData, currentUserId) as { code: number; message?: string };
      }

      if (response.code === 200) {
        toast.add({
          title: "Success",
          description: isEditMode.value ? "Paper successfully updated!" : "Paper successfully submitted!",
          color: "success",
        });
        if (isEditMode.value && currentStep.value !== "upload") {
          nextStep();
        }
        else {
          submit();
        }
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

  return {
    form, currentStep, stepIndex, submitted, STEPS, isEditMode,
    goToStep, nextStep, prevStep, skipStep, skipSubmission,
    addAuthor, removeAuthor, reset, submit, submitPaper,
  };
};
