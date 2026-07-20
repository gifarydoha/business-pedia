// app/server/utils/fetchSettings.ts
// Nitro server utility — auto-imported in API handlers & server plugins only.
// Do NOT import or call this from Vue/Pinia stores (not a Nitro context).

import type { H3Event } from "h3";
import type { SettingsApiResponse } from "~/types/api";

export async function fetchSettingsFromApi(event?: H3Event) {
  const config = useRuntimeConfig(event);

  if (!config.apiAccessKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API access key is not configured. Set NUXT_API_ACCESS_KEY in .env",
    });
  }

  return await $fetch<SettingsApiResponse>(
    `${config.public.apiBase}/settings`,
    {
      query: {
        access_key: config.apiAccessKey,
      },
    },
  );
}
