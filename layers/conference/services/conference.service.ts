import { useConferenceInitialStore } from "~/layers/conference/stores/conferenceInitial.store";

export function useConferenceService() {
  const config = useRuntimeConfig();
  const confBase = String(config.public.apiBase);
  const conferenceStore = useConferenceInitialStore();

  async function submitConferencePaper(formData: FormData, userId: string | number) {
    if (!formData.has("conference_id")) {
      formData.append("conference_id", conferenceStore.conferenceId);
    }
    const isMyPaper = formData.get("is_my_paper")?.toString() || "1";

    // add paper
    return $fetch("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "POST",
      query: {
        access_key: "123456789",
        user_id: String(userId),
        conference_id: conferenceStore.conferenceId,
        is_my_paper: isMyPaper,
      },
      body: formData,
    });
  }

  // get all papers of every user of a conference
  async function getAllConferencePapers(
    userUid: string | number,
    filters?: { track_id?: string; status?: string }
  ) {
    return $fetch<any>("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        conference_id: conferenceStore.conferenceId,
        user_id: String(userUid),
        access_role: "admin",
        ...(filters?.track_id ? { conference_track_id: filters.track_id } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      },
    });
  }

  // Get papers for current user
  async function getConferencePapers(userUid: string | number) {
    return $fetch<any>("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        is_my_paper: "1",
        conference_id: conferenceStore.conferenceId,
        user_id: String(userUid),
      },
    });
  }

  // Get single paper
  async function getConferencePaper(id: string | number, userUid: string | number) {
    return $fetch<any>(`/conference/conference_api/conference_paper/${id}`, {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        is_my_paper: "1",
        conference_id: conferenceStore.conferenceId,
        user_id: String(userUid),
      },
    });
  }

  // Update a single paper
  async function updateConferencePaper(id: string | number, formData: FormData, userId: string | number) {
    if (!formData.has("conference_id")) {
      formData.append("conference_id", conferenceStore.conferenceId);
    }
    const isMyPaper = formData.get("is_my_paper")?.toString() || "1";

    return $fetch(`/conference/conference_api/conference_paper/${id}`, {
      baseURL: confBase,
      method: "PUT",
      query: {
        access_key: "123456789",
        user_id: String(userId),
        conference_id: conferenceStore.conferenceId,
        is_my_paper: isMyPaper,
      },
      body: formData,
    });
  }

  return {
    getAllConferencePapers,
    submitConferencePaper,
    getConferencePapers,
    getConferencePaper,
    updateConferencePaper,
  };
}
