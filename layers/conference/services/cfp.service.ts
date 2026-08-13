// $fetch is auto-imported by Nuxt — do NOT import from "ofetch" directly.

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
  // Called synchronously at composable scope — context is always valid here.
  const config = useRuntimeConfig();
  const CONTENT_BASE_URL = `${config.public.apiBase}/website/website_api/content`;

  /**
   * Fetches a CMS content slug with automatic retry.
   *
   * Retries on BOTH:
   *  - Network / HTTP errors (fetch failed, 5xx, timeout)
   *  - Empty `fulltext` responses (confirmed production failure mode where
   *    the API responds 200 but returns no content)
   *
   * Uses linear backoff (600 ms, 1200 ms) between attempts.
   * Throws only after all attempts are exhausted so useAsyncData can
   * set its `error` ref and the client-side watcher can auto-retry.
   */
  async function fetchContentBySlug(slug: string): Promise<string> {
    const MAX_ATTEMPTS = 3;
    const BASE_DELAY_MS = 600;
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await $fetch<RawContentResponse>(`${CONTENT_BASE_URL}/${slug}` as string, {
          params: { access_key: config.public.apiAccessKey },
          timeout: 10000,
        });

        let data: any = response;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          }
          catch {
            // ignore — data stays as-is
          }
        }

        const html = data?.content?.fulltext ?? "";

        if (html) {
          // Got valid content — return immediately.
          return html;
        }

        // API responded but returned empty fulltext — retryable.
        lastError = new Error(
          `[cfpService] "${slug}": API returned empty fulltext (attempt ${attempt}/${MAX_ATTEMPTS}).`,
        );
      }
      catch (e) {
        lastError = e;
      }

      if (attempt < MAX_ATTEMPTS) {
        // Linear backoff: 600 ms, 1200 ms
        await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS * attempt));
      }
    }

    // All attempts exhausted — throw so useAsyncData sets its error ref.
    throw lastError;
  }

  return {
    fetchCallForPapers: () => fetchContentBySlug("call-for-papers"),
    fetchTracks: () => fetchContentBySlug("tracks"),
    fetchCommittee: () => fetchContentBySlug("committee"),
  };
}
