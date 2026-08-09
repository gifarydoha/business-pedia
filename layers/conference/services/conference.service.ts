export function useConferenceService() {
  const config = useRuntimeConfig();
  const confBase = String(config.public.confApiBase);

  async function submitConferencePaper(formData: FormData, userId: string | number) {
    // We pass conference_id, is_my_paper, and access_key as query parameters
    const conferenceId = formData.get("conference_id")?.toString() || "10";
    const isMyPaper = formData.get("is_my_paper")?.toString() || "1";

    // add paper
    return $fetch("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "POST",
      query: {
        access_key: "123456789",
        user_id: String(userId),
        conference_id: conferenceId,
        is_my_paper: isMyPaper,
      },
      body: formData,
    });
  }

  // get all papers of a user
  async function getConferencePapers(conferenceId: string = "10", userUid: string = "101") {
    return $fetch("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        is_my_paper: "1",
        conference_id: conferenceId,
        user_id: userUid,
      },
    });
  }

  // get a single paper
  async function getConferencePaper(id: string | number, conferenceId: string = "10", userUid: string = "101101") {
    return $fetch(`/conference/conference_api/conference_paper/${id}`, {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        is_my_paper: "1",
        conference_id: conferenceId,
        user_id: userUid,
      },
    });
  }

  // Update a single paper
  async function updateConferencePaper(id: string | number, formData: FormData) {
    const conferenceId = formData.get("conference_id")?.toString() || "10";
    const isMyPaper = formData.get("is_my_paper")?.toString() || "1";

    return $fetch(`/conference/conference_api/conference_paper/${id}`, {
      baseURL: confBase,
      method: "PUT",
      query: {
        access_key: "123456789",
        user_id: "101",
        conference_id: conferenceId,
        is_my_paper: isMyPaper,
      },
      body: formData,
    });
  }

  return {
    submitConferencePaper,
    getConferencePapers,
    getConferencePaper,
    updateConferencePaper,
  };
}
