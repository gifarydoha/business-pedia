// app/server/api/page/[alias].get.ts
// Server-side proxy for fetching individual page content.
// Injects the secret access_key — never exposed to the browser.
//
// Endpoint: GET /website/website_api/content/{alias}?access_key=…
// Called by: app/pages/[...slug].vue via useFetch('/api/page/{alias}')

import type { ContentApiResponse } from "~/types/api";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const alias = getRouterParam(event, "alias");

  if (!alias) {
    throw createError({ statusCode: 400, statusMessage: "Page alias is required" });
  }

  if (!config.apiAccessKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API access key is not configured. Set NUXT_API_ACCESS_KEY in .env",
    });
  }

  const data = await $fetch<ContentApiResponse>(
    `${config.public.apiBase}/content/${alias}`,
    {
      query: {
        access_key: config.apiAccessKey,
      },
    },
  );

  return data;
});
