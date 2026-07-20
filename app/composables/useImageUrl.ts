// app/composables/useImageUrl.ts
// Helper composable to build full image URLs from relative API paths.
// API returns paths like: "fdrives/sid/autofymind/logo/autofymind_logo_f_s87704.png"
// Full URL is: https://autofymind.com/fdrives/sid/autofymind/logo/...

export function useImageUrl() {
  const config = useRuntimeConfig();
  const imageBase = config.public.imageBase as string;

  /**
   * Converts a relative image path from the API to a full URL.
   * If the path is already absolute (http/https), returns as-is.
   * If null/empty, returns the fallback placeholder.
   */
  function buildImageUrl(path: string | null | undefined, fallback = "/images/placeholder.png"): string {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // Strip leading slash if present to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${imageBase}/${cleanPath}`;
  }

  return { buildImageUrl };
}
