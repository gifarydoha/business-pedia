import { useConferenceService } from "#layers/conference/services/conference.service";

export const useUserPaper = () => {
  const { getConferencePapers } = useConferenceService();
  const authStore = useAuthStore();

  const { data: rawPapers, status, refresh } = useLazyAsyncData(
    "user-paper-status",
    () => {
      if (!authStore.user?.id) return Promise.resolve(null);
      return getConferencePapers("10", authStore.user.id);
    },
    {
      server: false,
      watch: [() => authStore.user?.id],
      default: () => null,
    },
  );

  const papers = computed(() => {
    if (!rawPapers.value) return [];

    const response = rawPapers.value as Record<string, unknown> | unknown[];
    let items: Record<string, unknown>[] = [];

    if (Array.isArray(response)) {
      items = response as Record<string, unknown>[];
    }
    else if (response && typeof response === "object") {
      if (Array.isArray((response as Record<string, unknown>).conference_papers)) {
        items = (response as Record<string, unknown>).conference_papers as Record<string, unknown>[];
      }
      else if (Array.isArray((response as Record<string, unknown>).data)) {
        items = (response as Record<string, unknown>).data as Record<string, unknown>[];
      }
    }

    return items;
  });

  const hasSubmittedPaper = computed(() => papers.value.length > 0);

  const submittedPaperId = computed(() => {
    if (papers.value.length > 0) {
      const p = papers.value[0];
      return String(p?.id || p?.paper_id || p?.paper_uid || "");
    }
    return "";
  });

  const isLoading = computed(() => status.value === "pending");

  return {
    hasSubmittedPaper,
    submittedPaperId,
    isLoading,
    refresh,
  };
};
