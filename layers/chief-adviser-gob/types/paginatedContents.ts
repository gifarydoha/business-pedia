import type { PageContent } from "#layers/base/types/api";

export interface PaginatedContentsResponse {
  paging: {
    total: number;
    per_page: number;
    pages: number;
    limit: number;
  };
  contents: PageContent[];
}
