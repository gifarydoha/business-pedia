// Stub — real implementation lives in layers/conference/composables/useUserPaper.ts
// Conference's version overrides this via Nuxt layer resolution order.
// For other layers (lms, chief-adviser-gob) this no-op is used safely,
// keeping login.vue / register.vue imports unchanged across all layer builds.
export const useUserPaper = () => {
  return {
    hasSubmittedPaper: computed(() => false),
    submittedPaperId: computed(() => ""),
    isLoading: computed(() => false),
    refresh: async () => {},
  };
};
