# Plan: Dynamic `/pages/[slug]` Route Group in Nuxt.js

> **Goal:** Create a single dynamic route that serves `/pages/about`, `/pages/contact`,
> `/pages/privacy`, and `/pages/terms` — all sharing the same API call, layout, and design.
> Design follows the existing `[...slug].vue` pattern: `SharedPageBanner` + prose `v-html` content.

---

## Reference: Next.js → Nuxt.js Concept Mapping

| Next.js Concept                                           | Nuxt.js Equivalent                                         |
| -----------------------------------------------------------| ------------------------------------------------------------|
| `(pages)/` route group (no URL segment)                   | Nuxt **layout** (`pages.vue`) applied via `definePageMeta` |
| `pages/[pageSlug]/page.js` (server component + SSR fetch) | `app/pages/pages/[slug].vue` with `useFetch` (SSR-safe)    |
| `DynamicPageClient.jsx` (client component)                | Vue SFC `<script setup>` — no client split needed          |
| `generateMetadata()`                                      | `useSeoMeta()` inside the page                             |
| `notFound()`                                              | `throw createError({ status: 404 })`                   |
| `layout.jsx` shared wrapper                               | `app/layouts/pages.vue`                                    |

> **Dropped from Next.js reference:** `parsePagesContent()`, `PagesHero`, `PagesIntro`,
> `PagesProcess`, `PagesPillars`, `PagesFeatured`, `PagesContact`, `WaveDivider`, `PagesSkeleton`.
> The Nuxt version uses a simpler, consistent design — same as the existing `[...slug].vue`.

---

## API Contract

```
GET {NUXT_PUBLIC_API_BASE}/content/{slug}?access_key={NUXT_PUBLIC_API_ACCESS_KEY}
```

| Slug | Full URL |
|---|---|
| `about`   | `https://autofymind.com/website/website_api/content/about?access_key=123456789` |
| `terms`   | `https://autofymind.com/website/website_api/content/terms?access_key=123456789` |
| `privacy` | `https://autofymind.com/website/website_api/content/privacy?access_key=123456789` |
| `contact` | `https://autofymind.com/website/website_api/content/contact?access_key=123456789` |

**Response type already exists:** `ContentApiResponse` in `app/types/api.ts`
- `data.page_content.title`    → page title (used in banner)
- `data.page_content.image_url` → banner image
- `data.page_content.fulltext` → HTML content rendered via `v-html`
- `data.seo_meta`              → SEO fields

---

## File Structure After Implementation

```
app/
├── layouts/
│   └── pages.vue                ← [NEW] Shared layout for all /pages/* routes
│
├── pages/
│   ├── index.vue                (existing — untouched)
│   ├── [...slug].vue            (existing — untouched)
│   └── pages/
│       └── [slug].vue           ← [NEW] Dynamic page route (about/terms/privacy/contact)
```

> `nuxt.config.ts` needs one new ISR route rule for `/pages/**`.
> No new components or composables needed — reuses `SharedPageBanner` (already exists).

---

## Step-by-Step Implementation

---

### STEP 1 — Create the `pages` Layout

**File to create:** `app/layouts/pages.vue`

Nuxt equivalent of the Next.js `(pages)/layout.jsx`. Wraps all `/pages/*` routes.

```vue
<!-- app/layouts/pages.vue -->
<template>
  <main class="flex min-w-full flex-1 flex-col items-center bg-white font-sans">
    <slot />
  </main>
</template>
```

**Why:** Applying it via `definePageMeta({ layout: 'pages' })` in the page keeps the
URL clean (no extra prefix from the layout itself). Nuxt layouts are the idiomatic
replacement for Next.js route-group layouts.

---

### STEP 2 — Create the Dynamic Page Route

**File to create:** `app/pages/pages/[slug].vue`

One file handles all four routes. Same design pattern as `[...slug].vue`.

```vue
<!-- app/pages/pages/[slug].vue -->
<script setup lang="ts">
import type { ContentApiResponse } from '~/types/api';

// 1. Apply the pages layout
definePageMeta({ layout: 'pages' });

// 2. Read slug from URL params
const route = useRoute();
const slug = route.params.slug as string;

// 3. Whitelist guard — only serve known slugs
const ALLOWED_SLUGS = ['about', 'contact', 'privacy', 'terms'];
if (!ALLOWED_SLUGS.includes(slug)) {
  throw createError({ status: 404, statusMessage: 'Page Not Found' });
}

// 4. Fetch content from API (SSR + client hydration)
const config = useRuntimeConfig();
const { data, error, status } = await useFetch<ContentApiResponse>(
  `${config.public.apiBase}/content/${slug}`,
  {
    query: { access_key: config.public.apiAccessKey },
    key: `page-${slug}`,  // prevents duplicate fetches on navigation
  }
);

// 5. 404 if API returns nothing
if (!data.value?.page_content) {
  throw createError({ status: 404, statusMessage: 'Page Not Found' });
}

// 6. Reactive data refs
const page = computed(() => data.value?.page_content);
const seo  = computed(() => data.value?.seo_meta);

// 7. SEO meta
useSeoMeta({
  title:       computed(() => seo.value?.meta_title ?? page.value?.meta_title ?? page.value?.title),
  description: computed(() => seo.value?.meta_description ?? page.value?.meta_description),
  ogImage:     computed(() => seo.value?.image_url),
  ogUrl:       computed(() => seo.value?.canonical_url),
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="status === 'pending'" class="container mx-auto flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="text-brand-primary size-8 animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error || !page" class="container mx-auto py-20 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto mb-4 size-16 text-red-400" />
      <h1 class="mb-2 text-2xl font-bold text-gray-900">Page Not Found</h1>
      <p class="mb-6 text-gray-500">The content you are looking for does not exist or failed to load.</p>
      <NuxtLink to="/"><UButton class="btn-brand-primary">Return to Home</UButton></NuxtLink>
    </div>

    <!-- Content State -->
    <div v-else class="container mx-auto px-4 py-8">
      <SharedPageBanner :title="page.title" :image="page.image_url" />

      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <div class="prose max-w-none text-gray-700" v-html="page.fulltext" />
      </div>
    </div>
  </div>
</template>
```

---

### STEP 3 — Update `nuxt.config.ts` Route Rules

**File to modify:** `nuxt.config.ts`

```ts
routeRules: {
  // ... existing rules ...
  '/pages/**': { isr: 300 },   // ← ADD THIS LINE
},
```

**Why ISR 300?** About/Terms/Privacy/Contact change rarely. ISR caches the HTML
for 5 minutes then regenerates in the background — fast delivery without stale content.

---

## Implementation Checklist

- [ ] **STEP 1** — Create `app/layouts/pages.vue`
- [ ] **STEP 2** — Create `app/pages/pages/[slug].vue`
- [ ] **STEP 3** — Add `/pages/**` ISR rule to `nuxt.config.ts`
- [ ] **STEP 4** — Test all 4 routes in browser:
  - `/pages/about`
  - `/pages/terms`
  - `/pages/privacy`
  - `/pages/contact`

---

## Notes & Design Decisions

### Same design as `[...slug].vue`
All four pages use `SharedPageBanner` (title + image) followed by a prose card
with `v-html` content — identical to the existing catch-all page. No new components needed.

### Why not just reuse `[...slug].vue`?
The existing catch-all works but has no slug whitelist. The new `/pages/[slug].vue`
adds an explicit allowlist (`about`, `terms`, `privacy`, `contact`) and applies a
dedicated `pages` layout. Nuxt's router always prefers specific routes over catch-alls,
so both files coexist safely.

### SSR Safety
`await useFetch()` in `<script setup>` runs on the server first, then hydrates on
the client — no extra `onServerPrefetch` needed.

### No Route Group Folder Needed
Nuxt has no `(groupName)` convention. The layout is applied via `definePageMeta`.
The existing `app/components/(pages)/` folder is legacy Next.js reference only —
it does not affect Nuxt routing.
