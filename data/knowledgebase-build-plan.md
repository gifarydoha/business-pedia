# Knowledgebase Feature — Build Plan
**Project:** business-pedia (Nuxt 3 + Nuxt UI + Tailwind + TypeScript)
**Scope:** 3 dynamic pages consuming the AutofyMind KB API, directly via `useFetch`/`useAsyncData` (no server proxy)

---

## 1. Problem Statement

The app needs a knowledgebase section with a topic index, per-topic article listings, and article detail pages — all driven by a live external API with no dedicated categories endpoint. The `/[parent_page]` listing page must visually match an existing reference layout (Bootstrap-style row: meta column + content column, plus a sidebar with category counts and a tag cloud), rebuilt in Tailwind/Nuxt UI rather than Bootstrap.

## 2. Routes

| Route                                | Purpose                                                                   |
| --------------------------------------| ---------------------------------------------------------------------------|
| `/topics`                            | Dynamic category index                                                    |
| `/[parent_page]`                     | Category listing (e.g. `/mind`, `/happiness`, `/business`, `/technology`) |
| `/[parent_page]/[detail_child_page]` | Article detail                                                            |

`/topics` is itself dynamic — categories are not hardcoded; they're derived at runtime from the list API response (grouped by `category_name`, slugified).

## 3. API Contracts

**List** — `GET ${NUXT_PUBLIC_KB_API_BASE}/kbs?access_key=${NUXT_PUBLIC_API_ACCESS_KEY}`
Returns `{ kb_titles: KbListItem[] }`.

**Detail** — `GET ${NUXT_PUBLIC_KB_API_BASE}/kb/{alias}?access_key=${NUXT_PUBLIC_API_ACCESS_KEY}`
Returns `{ kb_title: KbDetailItem, h2: Record<string, H2Entry> }`.

### `types/kb.ts`
```ts
export interface KbListItem {
  id: string
  category_id: string
  sub_category_id: string
  category_name: string
  sub_category_name: string
  tag: string
  title: string
  alias: string
  meta_title: string
  meta_description: string
  featured_image: string   // filename only — prefix with https://autofymind.com/fdrives/skb/
  details: string          // raw HTML — do NOT fully render on list pages
  total_view: string
  created: string
  is_featured: string
}

export interface KbDetailItem extends KbListItem {
  // details here contains full HTML with quote-block / highlight / pull-quote
  // divs and a [#FEATURED_MEDIA#] placeholder
}

export interface H2Entry {
  text: string
  h_id: string
}

export interface KbListResponse {
  kb_titles: KbListItem[]
}

export interface KbDetailResponse {
  kb_title: KbDetailItem
  h2: Record<string, H2Entry>
}
```

### Category slug mapping (client-derived, not hardcoded)
- Group `kb_titles` by `category_name`
- Slugify each `category_name` (lowercase, spaces→hyphens, strip punctuation) to produce the `parent_page` param
- Build a `Map<slug, { category_id, category_name, count }>` once per session from the cached list

## 4. File Structure

```
pages/
  topics/
    index.vue                       # category index
  [parent_page]/
    index.vue                       # category listing
    [detail_child_page].vue         # article detail
composables/
  useKnowledgebase.ts
    useKbList()                     # useAsyncData('kb-list', ...) — fetched/cached once
    useKbDetail(alias)              # useAsyncData(`kb-detail-${alias}`, ...)
    useKbCategoryMap()              # derives slug -> {category_id, name, count} from kb-list
types/
  kb.ts
components/kb/
  CategoryCard.vue
  ArticleRow.vue                    # matches the reference: meta col + content col
  KbSidebar.vue
  TagCloud.vue
  ArticleToc.vue
  ArticleContent.vue
```

## 5. Styling System

- Tailwind v4 utilities only — no px values, no inline styles
- Fonts: `font-lora` (headings), `font-poppins` (body)
- Color tokens (already in `tailwind.config.ts`):
  - Teal `#12B793` — primary / buttons / links
  - Blue-teal `#236D86` — secondary
  - Orange `#F4701B` — accents / badges / tag pills
  - Near-black `#040706` — headings / dark backgrounds
  - Muted bg `#f0f7f5`
  - Footer-dark bg `#080f0d`
- Cards: `rounded-2xl shadow-lg` with a teal-tinted shadow
- Nuxt UI components (`UCard`, `UBadge`, `UButton`) themed via existing tokens

## 6. Page-by-Page Plan

### 6.1 `/topics` — Category Index
- Hero intro (matches AutofyMind tagline styling)
- Responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) of `CategoryCard`s, one per derived category: name, live article count, teal hover border, links to `/[parent_page]`
- Sidebar: `KbSidebar` = category list (from map) + `TagCloud` (unique `tag` values across all `kb_titles`, orange pill badges)
- Loading skeleton while `useKbList()` is pending; empty state if `kb_titles` is empty

### 6.2 `/[parent_page]` — Category Listing (reference-matched layout)
Reproduces the reference HTML structure exactly, in Tailwind:

- Validate `parent_page` against the category map; `throw createError({ statusCode: 404 })` if unmatched
- Header: category name + live count ("view 1 to N of N records" style summary)
- Main column (`lg:col-span-9` equivalent): one `ArticleRow` per article, each row split into:
  - **Left meta column** (`lg:col-span-3`, right-aligned like the reference): tag badge, author, formatted date, view count (comments hidden as per API limits).
  - **Right content column** (`lg:col-span-9`): featured image, title (links to `/[parent_page]/[alias]`), excerpt (from `meta_description`), "View More" button
- Sidebar (`lg:col-span-3`, sticky): same `KbSidebar` + `TagCloud` as `/topics`, current category visually highlighted
- Pagination: client-side slice of the cached list with a fixed page size of 10. "view X to Y of Z records" footer matching the reference.
- Loading + empty states

### 6.3 `/[parent_page]/[detail_child_page]` — Article Detail
- Fetch via `useKbDetail(detail_child_page)` (alias = route param)
- Hero: `tag` as eyebrow, `title` as H1, meta row (category, sub-category, author, date, views)
- Featured image: replace `[#FEATURED_MEDIA#]` placeholder in `details` HTML with the actual image, rendered full-width above the two-column split
- `lg+`: two columns —
  - **Main content**: `ArticleContent.vue` renders `details` via `v-html`, sanitized with `isomorphic-dompurify` (client + server). Restyle `.quote-block` as a teal-left-border card, `.highlight`/`.pull-quote` as orange-left-border blocks via `:deep()` since content is `v-html`
  - **Sticky right sidebar**: `ArticleToc.vue` built from the `h2` map. Since H2 data is empty for some articles, only render the sidebar when valid H2 data is returned. When available, use static jump links (`<a href="#{h_id}">`), teal active-on-click state, no scroll-spy.
  - Ensure headings in the rendered HTML have matching `id="{h_id}"` based on the API data.
- Below content: tag badge row, related articles (same `category_id`, excluding current, 3 cards)
- Mobile: single column; ToC collapses into a `<details>` disclosure above the content

## 7. Cross-Cutting Requirements

- `useSeoMeta()` / `useHead()` on all 3 pages from `meta_title` / `meta_description`
- Graceful error handling on fetch failure (inline error state or toast)
- Fully responsive, mobile-first
- All category/tag data derived client-side from the list API — nothing hardcoded

## 8. Resolved Decisions

1. **Comment counts**: API has no comments field. No need to show comments.
2. **Pagination page size**: Desired page size is set to 10 items per page.
3. **H2 anchor reliability**: Not every article has H2 data (api field is empty for some). The ToC should gracefully hide itself if data is empty.
4. **API Configuration**: Must use `.env` variables `NUXT_PUBLIC_KB_API_BASE` and `NUXT_PUBLIC_API_ACCESS_KEY`.

## 9. Suggested Build Order

1. `types/kb.ts` + `composables/useKnowledgebase.ts` (list, detail, category map)
2. `/topics` page + `CategoryCard`, `KbSidebar`, `TagCloud`
3. `/[parent_page]` page + `ArticleRow` (reference-matched)
4. `/[parent_page]/[detail_child_page]` + `ArticleContent`, `ArticleToc`
5. Sanitization, SEO meta, error/loading/empty states pass across all 3
