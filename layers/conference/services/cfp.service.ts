import { $fetch } from "ofetch";

// services/cfp.service.ts
//
// Thin API layer only — talks to the CMS content endpoint and returns raw
// HTML strings. No parsing and no caching happen here; utils/ parses,
// stores/ caches. Keeping this layer "dumb" makes it trivial to swap the
// endpoint or add auth later without touching parsing or store logic.
//
// IMPORTANT: Exported as a composable (useCfpService) so that
// useRuntimeConfig() is always called synchronously within a valid
// Nuxt context — never inside an async function body where the context
// can be lost.

interface CfpApiContent {
  id: string;
  fulltext: string;
  title?: string;
  sub_title?: string;
  [key: string]: unknown;
}

interface RawContentResponse {
  content: CfpApiContent;
}

export function useCfpService() {
  // ✅ Called synchronously at composable scope — context is always valid here.
  const config = useRuntimeConfig();
  const CONTENT_BASE_URL = `${config.public.apiBase}/website/website_api/content`;

  async function fetchContentBySlug(slug: string): Promise<string> {
    const response = await $fetch<RawContentResponse>(`${CONTENT_BASE_URL}/${slug}`, {
      params: { access_key: config.public.apiAccessKey },
    });
    return response.content?.fulltext ?? "";
  }

  return {
    fetchCallForPapers: () => fetchContentBySlug("call-for-papers"),
    fetchTracks: () => fetchContentBySlug("tracks"),
    fetchCommittee: () => fetchContentBySlug("committee"),
  };
}
