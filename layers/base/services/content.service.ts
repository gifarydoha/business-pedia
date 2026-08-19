export const contentService = {

  async fetchContents<T>(contentType: string, page: number = 1, keyword: string = ""): Promise<T> {
    const config = useRuntimeConfig();

    return (await $fetch(
      `${config.public.apiBase}/website/website_api/contents/${contentType}`, {
        query: {
          access_key: config.public.apiAccessKey,
          page,
          keyword,
        },
      },

    )) as T;
  },
};
