export function useConferenceService() {
  const config = useRuntimeConfig();
  const confBase = String(config.public.confApiBase);

  async function submitConferencePaper(formData: FormData) {
    // We pass conference_id, is_my_paper, and access_key as query parameters
    const conferenceId = formData.get("conference_id")?.toString() || "10";
    const isMyPaper = formData.get("is_my_paper")?.toString() || "1";

    return $fetch("/conference_api/conference_paper", {
      baseURL: confBase,
      method: "POST",
      query: {
        access_key: "123456789",
        conference_id: conferenceId,
        is_my_paper: isMyPaper,
      },
      body: formData,
    });
  }

  async function getConferencePapers(conferenceId: string = "9", userUid: string = "1") {
    return $fetch("/conference/conference_api/conference_paper", {
      baseURL: confBase,
      method: "GET",
      query: {
        access_key: "123456789",
        conference_id: conferenceId,
        user_uid: userUid,
        is_my_paper: "1",
      },
    });
  }

  return {
    submitConferencePaper,
    getConferencePapers,
  };
}
