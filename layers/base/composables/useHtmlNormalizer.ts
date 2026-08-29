export const useHtmlNormalizer = () => {
  const config = useRuntimeConfig();

  const normalize = (html: string): string => {
    if (!html) return "";
    if (import.meta.server) return html; // no DOMParser on server

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Strip ALL inline styles (they're tenant-specific hardcoded colors)
    doc.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));

    // Fix relative image URLs → absolute using this layer's apiBase
    doc.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src") ?? "";
      if (!src.startsWith("http") && !src.startsWith("//") && !src.startsWith("data:")) {
        img.setAttribute("src", `${config.public.apiBase}/${src.replace(/^\//, "")}`);
      }
    });

    // Fix relative file download links → absolute
    doc.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("fdrives/") || (href.startsWith("/") && href.includes("fdrives"))) {
        a.setAttribute("href", `${config.public.apiBase}/${href.replace(/^\//, "")}`);
      }
    });

    return doc.body.innerHTML;
  };

  return { normalize };
};
