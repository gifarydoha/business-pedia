import type { SubmissionFormData, SubmissionAuthor } from "~/types/submission";

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
    paperFile: null, includeInProceedings: null,
  };
}

export const useSubmissionWizard = () => {
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

  return {
    form, currentStep, stepIndex, submitted, STEPS,
    goToStep, nextStep, prevStep, skipStep,
    addAuthor, removeAuthor, reset, submit,
  };
};
