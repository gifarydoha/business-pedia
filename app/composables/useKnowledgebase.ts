import type { KbListResponse, KbDetailResponse, KbCategory, KbListItem } from "~/types/kb";

export const useKnowledgebase = () => {
  const config = useRuntimeConfig();
  const kbApiBase = config.public.kbApiBase;
  const apiAccessKey = config.public.apiAccessKey;

  /**
   * Fetches the list of all knowledgebase articles.
   * Cached to avoid redundant network requests across pages.
   */
  const getKbList = () => {
    return useAsyncData<KbListResponse>("kb-list", () =>
      $fetch<KbListResponse>(`${kbApiBase}/kbs`, {
        query: { access_key: apiAccessKey },
      }),
    );
  };

  /**
   * Fetches the detail for a specific article by its alias.
   */
  const getKbDetail = (alias: string) => {
    return useAsyncData<KbDetailResponse>(`kb-detail-${alias}`, () =>
      $fetch<KbDetailResponse>(`${kbApiBase}/kb/${alias}`, {
        query: { access_key: apiAccessKey },
      }),
    );
  };

  /**
   * Derives a map of category slugs to Category details from the KB list.
   * Caches the computation based on the list data.
   */
  const getCategoryMap = (kbTitles: Ref<KbListItem[] | undefined>) => {
    return computed(() => {
      const map = new Map<string, KbCategory>();
      if (!kbTitles.value) return map;

      kbTitles.value.forEach((item) => {
        if (!item.category_name) return;

        // Slugify the category name
        const slug = item.category_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        if (map.has(slug)) {
          map.get(slug)!.count++;
        }
        else {
          map.set(slug, {
            category_id: item.category_id,
            name: item.category_name,
            slug,
            count: 1,
          });
        }
      });

      return map;
    });
  };

  return {
    getKbList,
    getKbDetail,
    getCategoryMap,
  };
};
