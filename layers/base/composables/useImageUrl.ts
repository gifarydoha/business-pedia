// app/composables/useImageUrl.ts
// Helper composable to build full image URLs from relative API paths.
// API returns paths like: "fdrives/sid/autofymind/logo/autofymind_logo_f_s87704.png"
// Full URL is: https://autofymind.com/fdrives/sid/autofymind/logo/...

export function useImageUrl() {
  const config = useRuntimeConfig();
  const imageBase = config.public.apiBase as string;

  /**
   * Converts a relative image path from the API to a full URL.
   * If the path is already absolute (http/https), returns as-is.
   * If null/empty, returns the fallback placeholder.
   */
  function buildImageUrl(path: string | null | undefined, fallback = "/images/placeholder.png"): string {
    if (!path) return fallback;

    const processedPath = path;

    if (processedPath.startsWith("http://") || processedPath.startsWith("https://")) {
      // Fix malformed absolute URLs where the slash is missing before 'fdrives'
      // (e.g., https://domain.comfdrives/... -> https://domain.com/fdrives/...)
      return processedPath.replace(/(\.com|\.net|\.org|\.io|[0-9])fdrives\//i, "$1/fdrives/");
    }

    // Strip leading slash if present to avoid double slashes
    const cleanPath = processedPath.startsWith("/") ? processedPath.slice(1) : processedPath;

    // Strip trailing slash from imageBase if present
    const base = imageBase.endsWith("/") ? imageBase.slice(0, -1) : imageBase;

    return `${base}/${cleanPath}`;
  }

  return { buildImageUrl };
}
