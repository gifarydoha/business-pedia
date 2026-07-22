# Knowledgebase Feature Implementation

- `[x]` Step 1: Types & Composables
  - `[x]` Update `.env` and `nuxt.config.ts` with `NUXT_PUBLIC_KB_API_BASE` and `NUXT_PUBLIC_API_ACCESS_KEY`
  - `[x]` Create `types/kb.ts` with interfaces for the API
  - `[x]` Create `composables/useKnowledgebase.ts` (list, detail, category map)
- `[x]` Step 2: Category Index (`/topics`)
  - `[x]` Create `/topics` page
  - `[x]` Build `CategoryCard`, `KbSidebar`, `TagCloud` components
- `[ ]` Step 3: Category Listing (`/[parent_page]`)
  - `[ ]` Create `/[parent_page]/index.vue`
  - `[ ]` Build `ArticleRow.vue` (without comments, with pagination of 10)
- `[ ]` Step 4: Article Detail (`/[parent_page]/[detail_child_page]`)
  - `[ ]` Create `/[parent_page]/[detail_child_page].vue`
  - `[ ]` Build `ArticleContent.vue` and `ArticleToc.vue` (graceful hide if no H2 data)
- `[ ]` Step 5: Final Polish
  - `[ ]` SEO tags, Sanitization, Error/Empty states
