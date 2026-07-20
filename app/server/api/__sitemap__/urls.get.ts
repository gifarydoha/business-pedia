// app/server/api/__sitemap__/urls.get.ts
import type { SitemapUrl } from "#sitemap/types";

export default defineSitemapEventHandler(async () => {
  // If the API provides an endpoint for all page slugs, fetch them here.
  // For now, we return a basic static list for demonstration.

  const pages = ["guidelines", "call-for-paper", "contact", "about", "mind", "technology", "business", "happiness"];

  return pages.map((slug): SitemapUrl => ({
    loc: `/${slug}`,
    changefreq: "weekly",
    priority: 0.8,
    lastmod: new Date().toISOString(),
  }));
});
