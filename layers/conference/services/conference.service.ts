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

  return {
    submitConferencePaper,
  };
}
