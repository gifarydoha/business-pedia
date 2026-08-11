import { $fetch } from "ofetch";

interface CfpApiContent {
  id: string;
  fulltext: string;
  title?: string;
  sub_title?: string;
  [key: string]: unknown;
}

interface CfpApiResponse {
  content: CfpApiContent;
}

export function useCfpService() {
  const config = useRuntimeConfig();

  async function fetchRawCfpContent(): Promise<{ content: string }> {
    const response = (await $fetch(
      `${config.public.apiBase}/website/website_api/content/call-for-papers`,
      { params: { access_key: config.public.apiAccessKey } },
    )) as CfpApiResponse;

    // The API returns { content: { fulltext: "<html>...", ... } }
    // We extract the fulltext HTML string for the parser.
    return { content: response.content?.fulltext ?? "" };
  }

  return {
    fetchRawCfpContent,
  };
}
