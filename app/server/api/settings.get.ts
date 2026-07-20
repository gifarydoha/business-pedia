// app/server/api/settings.get.ts
// Server-side proxy for the settings endpoint.
// Injects the secret access_key — this key is NEVER exposed to the browser.
//
// Endpoint: GET /website/website_api/settings?access_key=…
// Called by: app/stores/settings.ts via $fetch('/api/settings')

import type { SettingsApiResponse } from "~/types/api";

export default defineEventHandler(async (event) => {
  return await fetchSettingsFromApi(event);
});
