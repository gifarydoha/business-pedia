import { $fetch } from "ofetch";

interface CfpApiContent {
  id: string;
  fulltext: string;
  title?: string;
  sub_title?: string;
  [key: string]: unknown;
}

// interface CfpApiResponse {
//   content: CfpApiContent;
// }

// export function useCfpService() {
//   const config = useRuntimeConfig();

//   async function fetchRawCfpContent(): Promise<{ content: string }> {
//     const response = (await $fetch(
//       `${config.public.apiBase}/website/website_api/content/call-for-papers`,
//       { params: { access_key: config.public.apiAccessKey } },
//     )) as CfpApiResponse;

//     // The API returns { content: { fulltext: "<html>...", ... } }
//     // We extract the fulltext HTML string for the parser.
//     return { content: response.content?.fulltext ?? "" };
//   }

//   return {
//     fetchRawCfpContent,
//   };
// }

// services/cfpService.ts
//
// Thin API layer only — talks to the CMS content endpoint and returns raw
// HTML strings. No parsing and no caching happen here; utils/ parses,
// stores/ caches. Keeping this layer "dumb" makes it trivial to swap the
// endpoint or add auth later without touching parsing or store logic.

interface RawContentResponse {
  content: CfpApiContent;
}

async function fetchContentBySlug(slug: string): Promise<string> {
  const config = useRuntimeConfig();
  const CONTENT_BASE_URL = `${config.public.apiBase}/website/website_api/content`;

  const response = await $fetch<RawContentResponse>(`${CONTENT_BASE_URL}/${slug}`, {
    params: { access_key: config.public.apiAccessKey },
  });
  return response.content?.fulltext ?? "";
}

export const cfpService = {
  fetchCallForPapers: () => fetchContentBySlug("call-for-papers"),
  fetchTracks: () => fetchContentBySlug("tracks"),
  fetchCommittee: () => fetchContentBySlug("committee"),
};
