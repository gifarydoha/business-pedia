import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ConferenceInitialResponse } from "~/layers/conference/types/conference";

export const useConferenceInitialStore = defineStore("conferenceInitial", () => {
  const config = useRuntimeConfig();
  const confBase = String(config.public.apiBase);

  const initialData = ref<ConferenceInitialResponse | null>(null);

  const conferenceId = computed(() => initialData.value?.conference?.id || "");
  const conferenceDetails = computed(() => initialData.value?.conference || null);
  const conferenceTracks = computed(() => initialData.value?.conference_tracks || []);
  const paperStatuses = computed(() => initialData.value?.paper_statuses || {});
  const finalDecisionList = computed(() => initialData.value?.final_decision_list || {});

  async function init(force: boolean = false) {
    if (initialData.value && !force) {
      return;
    }
    const data = await $fetch<ConferenceInitialResponse>("/conference/conference_api/conference_initial/current", {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
      },
    });
    if (data) {
      initialData.value = data;
    }
  }

  return {
    initialData,
    conferenceId,
    conferenceDetails,
    conferenceTracks,
    paperStatuses,
    finalDecisionList,
    init,
  };
});
