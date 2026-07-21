# 🏗️ Business-Pedia: Fully Dynamic Production Implementation Plan

**Stack:** Nuxt 4 · @nuxt/ui v4 · Tailwind CSS v4 · Pinia · CodeIgniter REST API · JWT (localStorage) · @nuxtjs/i18n · Hybrid SSR/ISR

---

## Background & Goal

The application fetches **all content, navigation, branding, widgets, and SEO data** from a CodeIgniter REST API. The API follows the structure of `?access_key=…` for public endpoints. The `access_key` is a server-side secret, **never exposed to the browser**.

The API response (the reference: `autofymind.com/website/website_api/settings`) reveals the full data contract:

| API Field | Used For |
|---|---|
| `sid_site.app_setting.organization_information` | Logo, favicon, contact info, brand name |
| `sid_site.layout_primary_color` / `layout_secondary_color` | Dynamic CSS custom properties (theme colors) |
| `widgets.menu.main_menu` | Dynamic navigation (supports nested `children` dropdowns) |
| `widgets.slider` | Hero section slider items |
| `widgets.home_page_block` | Homepage sections — each maps to a Vue component via `widget_element_path` |
| `widgets.page_block` | Page-level banner blocks |
| `page_content` | Individual page title, content, SEO, fulltext |
| `seo_meta` | Global/page-level SEO meta injection |
| `sid_site.about_content` | Footer / about snippet |

---

## Phase Overview

```
Phase 1 → Foundation: Types + Env + Settings API bootstrap
Phase 2 → App Bootstrap: Settings store, dynamic theme, server plugin
Phase 3 → Navigation: API-driven TheHeader + TheFooter
Phase 4 → Homepage: Slider + dynamic home_page_block renderer
Phase 5 → Dynamic Pages: [slug].vue + page_content API
Phase 6 → Auth: Login/Register + JWT store + guards
Phase 7 → Protected Pages: Submit Paper, Dashboard
Phase 8 → SEO, Sitemap, Robots, Error Pages
Phase 9 → Production Checklist & Polish
```

---

## Phase 1 — Foundation: Types, Environment & Config

### 1.1 Update `.env`

```bash
# .env — NEVER commit
NUXT_PUBLIC_API_BASE=https://autofymind.com/website/website_api
NUXT_PUBLIC_APP_NAME=Business-Pedia
NUXT_PUBLIC_IMAGE_BASE=https://autofymind.com
NUXT_API_ACCESS_KEY=123456789
```

> [!IMPORTANT]
> `NUXT_API_ACCESS_KEY` must be a **private runtime config** key (no `public:` prefix). It stays server-side only, proxied through Nuxt server routes.

### 1.2 Update `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
  ],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    // 🔒 SERVER-ONLY (private) — never sent to browser
    apiAccessKey: process.env.NUXT_API_ACCESS_KEY ?? "",

    // 🌐 PUBLIC — safe to expose to browser
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8000/website/website_api",
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE ?? "https://autofymind.com",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Business-Pedia",
    },
  },

  routeRules: {
    "/": { isr: 60 },
    "/guidelines": { isr: 300 },
    "/call-for-paper": { isr: 300 },
    "/contact": { ssr: true },
    "/**": { isr: 120 },
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/submit-paper": { ssr: true },
    "/dashboard/**": { ssr: true },
    // Proxy API routes — always fresh
    "/api/**": { cors: true },
  },

  // ... i18n, eslint, colorMode, typescript configs (unchanged from guideline)
});
```

### 1.3 Complete TypeScript Types

#### [MODIFY] `app/types/api.ts` — Typed API response matching the actual API contract

```typescript
// app/types/api.ts

/** Top-level wrapper returned by the settings endpoint */
export interface SettingsApiResponse {
  sid: string;
  version: number;
  page_content: PageContent;
  widgets: Widgets;
  sid_site: SidSite;
  seo_meta: SeoMeta;
  message: string;
  code: number;
}

/** Page content for CMS pages */
export interface PageContent {
  id: string;
  alias: string;
  title: string;
  sub_title: string;
  fulltext: string;
  introtext: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  url: string;
  image_url: string;
  updated: string;
  created: string;
  publish_date: string;
  status: string;
  page_setting: Record<string, unknown>;
}

/** Widget item (used across menu, slider, page_block, home_page_block items) */
export interface WidgetItem {
  id: string;
  parent_id: string;
  order: string;
  type: string;
  status: string;
  title: string;
  alias: string;
  label: string;
  link?: string;
  content_type: string;
  custom_content: string | null;
  content_id: string | null;
  content_category_id: string | null;
  image: string | null;
  level: number;
  parent: string;
  url: string;
  // Additional fields present on some items:
  name?: string;
  sub_title?: string;
  fulltext?: string;
  image_url?: string;
  children?: WidgetItem[];
  media_info?: unknown[];
}

/** A home_page_block widget section */
export interface HomePageBlock {
  id: string;
  type: "home_page_block";
  widget_element_path: string;  // e.g. "courses", "topics", "call_actions", "questions"
  is_full_section: string;
  title: string;
  alias: string;
  description: string;
  content_selection_option: string;
  content_type_id: string;
  content_category_id: string;
  search_keywords: string;
  quantity: string;
  is_only_featured: string;
  sort_order: string;
  status: string;
  items: WidgetItem[];
}

/** A slider widget section */
export interface SliderBlock {
  id: string;
  type: "slider";
  title: string;
  alias: string;
  sort_order: string;
  status: string;
  items: WidgetItem[];
}

/** All widgets returned by the API */
export interface Widgets {
  page_block: Record<string, WidgetItem[]>;
  home_page_block: Record<string, HomePageBlock>;
  slider: Record<string, SliderBlock>;
  menu: {
    main_menu: WidgetItem[];
    [key: string]: WidgetItem[];
  };
}

/** Organization & theme settings */
export interface OrganizationInfo {
  name: string;
  "company-brief": string;
  "website-url": string;
  logo: string;
  mobile: string;
  "hot-number": string;
  "contact-email": string;
  address: string;
  "meta-title": string;
  "meta-keyword": string;
  "meta-description": string;
  favicon: string;
  "location-map": string;
  "analytic-code": string;
  "logo_description": string;
}

export interface SidSite {
  app_setting: {
    organization_information: OrganizationInfo;
    social_media: {
      messenger?: string;
      whatsapp?: string;
      phone1?: string;
      phone2?: string;
    };
    [key: string]: unknown;
  };
  about_content: string;
  layout_primary_color: string;
  layout_secondary_color: string;
  layout_alias: string;
  template_alias: string;
  theme_alias: string;
  default_language_code: string;
  urls: {
    logo_url: string;
    cover_image_url: string;
  };
}

/** SEO meta fields */
export interface SeoMeta {
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  image_url: string;
  url: string;
  canonical_url: string;
}

/** Generic paginated API list response */
export interface ApiListResponse<T> {
  data: T[];
  message: string;
  success: boolean;
  meta?: ApiMeta;
}

export interface ApiMeta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
```

#### [NEW] `app/types/settings.ts` — Derived app-level settings type

```typescript
// app/types/settings.ts
import type { SidSite, Widgets, SeoMeta, PageContent } from "./api";

/** The normalized app settings stored in Pinia after fetching */
export interface AppSettings {
  sid: string;
  org: SidSite["app_setting"]["organization_information"];
  socialMedia: SidSite["app_setting"]["social_media"];
  primaryColor: string;
  secondaryColor: string;
  defaultLanguage: string;
  aboutContent: string;
  widgets: Widgets;
  homeSeoMeta: SeoMeta;
  homePageContent: PageContent;
  loaded: boolean;
}
```

---

## Phase 2 — App Bootstrap: Settings Server Proxy + Pinia Store

> [!IMPORTANT]
> The `access_key` must NEVER be in client-side code. All calls to the `/website_api/settings` endpoint go through a **Nuxt server route** that injects the key server-side.

### 2.1 [NEW] `app/server/api/settings.get.ts` — Server-side proxy

```typescript
// app/server/api/settings.get.ts
// This route is called by the Nuxt app (client or server) to get settings.
// It injects the secret access_key on the server and proxies the response.

import type { SettingsApiResponse } from "~/types/api";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  
  // page alias can be passed to fetch specific page content (default: "home")
  const alias = (query.alias as string) ?? "home";

  const data = await $fetch<SettingsApiResponse>(
    `${config.public.apiBase}/settings`,
    {
      query: {
        access_key: config.apiAccessKey,
        alias,
      },
    }
  );

  return data;
});
```

### 2.2 [NEW] `app/stores/settings.ts` — Global settings Pinia store

```typescript
// app/stores/settings.ts
import type { AppSettings } from "~/types/settings";
import type { SettingsApiResponse } from "~/types/api";

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<AppSettings | null>(null);
  const isLoaded = ref(false);
  const error = ref<string | null>(null);

  // Derived getters
  const org = computed(() => settings.value?.org);
  const primaryColor = computed(() => settings.value?.primaryColor ?? "#266B88");
  const secondaryColor = computed(() => settings.value?.secondaryColor ?? "#F7700B");
  const mainMenu = computed(() => settings.value?.widgets.menu.main_menu ?? []);
  const sliders = computed(() => {
    const sliderMap = settings.value?.widgets.slider ?? {};
    return Object.values(sliderMap).flatMap((s) => s.items);
  });
  const homePageBlocks = computed(() => {
    const blockMap = settings.value?.widgets.home_page_block ?? {};
    return Object.values(blockMap)
      .filter((b) => b.status === "1")
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
  });

  async function loadSettings(alias = "home") {
    if (isLoaded.value) return;
    try {
      const raw = await $fetch<SettingsApiResponse>("/api/settings", {
        query: { alias },
      });

      const orgInfo = raw.sid_site.app_setting.organization_information;

      settings.value = {
        sid: raw.sid,
        org: orgInfo,
        socialMedia: raw.sid_site.app_setting.social_media,
        primaryColor: raw.sid_site.layout_primary_color,
        secondaryColor: raw.sid_site.layout_secondary_color,
        defaultLanguage: raw.sid_site.default_language_code,
        aboutContent: raw.sid_site.about_content,
        widgets: raw.widgets,
        homeSeoMeta: raw.seo_meta,
        homePageContent: raw.page_content,
        loaded: true,
      };

      isLoaded.value = true;
    } catch (e: unknown) {
      error.value = "Failed to load site settings.";
    }
  }

  function reset() {
    settings.value = null;
    isLoaded.value = false;
  }

  return {
    settings, isLoaded, error,
    org, primaryColor, secondaryColor,
    mainMenu, sliders, homePageBlocks,
    loadSettings, reset,
  };
});
```

### 2.3 [NEW] `app/plugins/settings.server.ts` — Load settings on first SSR request

```typescript
// app/plugins/settings.server.ts
// Runs on the server (SSR). Fetches site settings once, hydrates to client via Pinia.
export default defineNuxtPlugin(async () => {
  const settingsStore = useSettingsStore();
  if (!settingsStore.isLoaded) {
    await settingsStore.loadSettings();
  }
});
```

### 2.4 [NEW] `app/plugins/theme.client.ts` — Inject dynamic CSS custom properties

```typescript
// app/plugins/theme.client.ts
// After hydration, inject brand colors as CSS variables onto <html>.
export default defineNuxtPlugin(() => {
  const settingsStore = useSettingsStore();

  watchEffect(() => {
    if (settingsStore.isLoaded) {
      document.documentElement.style.setProperty(
        "--color-primary",
        settingsStore.primaryColor
      );
      document.documentElement.style.setProperty(
        "--color-secondary",
        settingsStore.secondaryColor
      );
    }
  });
});
```

### 2.5 [MODIFY] `app/assets/css/main.css` — Use CSS custom properties for brand colors

```css
/* app/assets/css/main.css */
@import "tailwindcss";

:root {
  --color-primary: #266B88;   /* Overridden at runtime by theme.client.ts */
  --color-secondary: #F7700B;
}

/* Utility classes using dynamic brand colors */
.brand-primary { color: var(--color-primary); }
.bg-brand-primary { background-color: var(--color-primary); }
.border-brand-primary { border-color: var(--color-primary); }
.brand-secondary { color: var(--color-secondary); }
.bg-brand-secondary { background-color: var(--color-secondary); }
```

### 2.6 [MODIFY] `app/app.vue` — Global head + dynamic favicon/title

```vue
<!-- app/app.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const config = useRuntimeConfig();

useHead({
  titleTemplate: (titleChunk) => {
    const appName = settingsStore.org?.name ?? config.public.appName;
    return titleChunk ? `${titleChunk} — ${appName}` : appName;
  },
  link: computed(() => settingsStore.org?.favicon
    ? [{ rel: "icon", href: settingsStore.org.favicon }]
    : []
  ),
  htmlAttrs: { lang: "en" },
});
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

---

## Phase 3 — Navigation: API-Driven Header & Footer

### 3.1 [NEW] `app/composables/useImageUrl.ts` — Image URL helper

```typescript
// app/composables/useImageUrl.ts
export function useImageUrl() {
  const config = useRuntimeConfig();
  const imageBase = config.public.imageBase as string;

  function buildImageUrl(path: string | null | undefined): string {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith("http")) return path;
    return `${imageBase}/${path}`;
  }

  return { buildImageUrl };
}
```

### 3.2 [NEW] `app/layouts/default.vue` — Public layout with dynamic header + footer

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
</script>

<template>
  <div>
    <TheHeader />
    <main>
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
```

### 3.3 [NEW] `app/components/layout/TheHeader.vue` — API-driven navigation

The header reads `settingsStore.mainMenu` and renders:
- Logo from `org.logo`
- Nav items from `mainMenu` — each item with `children` renders a dropdown
- Auth buttons (Login/Register or user avatar if logged in)

```vue
<!-- app/components/layout/TheHeader.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { buildImageUrl } = useImageUrl();

const mainMenu = computed(() => settingsStore.mainMenu);
const logo = computed(() => buildImageUrl(settingsStore.org?.logo));
const orgName = computed(() => settingsStore.org?.name ?? "");
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
    <nav class="container mx-auto px-4 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <NuxtImg :src="logo" :alt="orgName" class="h-10 w-auto" />
      </NuxtLink>

      <!-- Dynamic Menu -->
      <ul class="hidden md:flex items-center gap-6">
        <li v-for="item in mainMenu" :key="item.id" class="relative group">
          <!-- Item with children = dropdown -->
          <template v-if="item.children?.length">
            <button class="nav-link flex items-center gap-1">
              {{ item.label }}
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
            </button>
            <ul class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <li v-for="child in item.children" :key="child.id">
                <NuxtLink :to="`/${child.url}`" class="block px-4 py-2 text-sm hover:bg-gray-50">
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </template>
          <!-- Regular item -->
          <NuxtLink v-else :to="`/${item.url}`" class="nav-link">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Auth buttons -->
      <div class="flex items-center gap-3">
        <template v-if="authStore.isLoggedIn">
          <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
          <UButton variant="ghost" size="sm" @click="authStore.logout()">Logout</UButton>
        </template>
        <template v-else>
          <NuxtLink to="/login">
            <UButton variant="ghost" size="sm">Login</UButton>
          </NuxtLink>
          <NuxtLink to="/register">
            <UButton size="sm" style="background-color: var(--color-primary)">Register</UButton>
          </NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>
```

### 3.4 [NEW] `app/components/layout/TheFooter.vue` — API-driven footer

Reads `settingsStore.org` for contact info, logo, address, and `settingsStore.settings?.aboutContent` for the about snippet.

---

## Phase 4 — Homepage: Slider + Dynamic home_page_block Renderer

### 4.1 [MODIFY] `app/pages/index.vue` — Homepage using store data

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: "default" });

const settingsStore = useSettingsStore();
const homeBlocks = computed(() => settingsStore.homePageBlocks);
const sliders = computed(() => settingsStore.sliders);

// SEO from API
const seo = computed(() => settingsStore.homeSeoMeta ?? settingsStore.settings?.homeSeoMeta);
useSeoMeta({
  title: computed(() => seo.value?.meta_title ?? "Home"),
  description: computed(() => seo.value?.meta_description ?? ""),
  keywords: computed(() => seo.value?.meta_keywords ?? ""),
  ogImage: computed(() => seo.value?.image_url ?? "/og-image.png"),
  ogUrl: computed(() => seo.value?.canonical_url),
});
</script>

<template>
  <div>
    <!-- Hero Slider -->
    <HomeHeroSlider :slides="sliders" />
    
    <!-- Dynamic home_page_block sections, rendered in sort_order -->
    <HomeBlockRenderer
      v-for="block in homeBlocks"
      :key="block.id"
      :block="block"
    />
  </div>
</template>
```

### 4.2 [NEW] `app/components/home/HomeHeroSlider.vue` — Slider

Renders items from `widgets.slider[*].items`. Each item has:
- `image` → relative path (use `useImageUrl()` to build full URL)
- `label` → slide title
- `link` → CTA URL

### 4.3 [NEW] `app/components/home/HomeBlockRenderer.vue` — Dynamic block router

This is the **core dynamic engine**. Maps `widget_element_path` → async Vue component.

```vue
<!-- app/components/home/HomeBlockRenderer.vue -->
<script setup lang="ts">
import type { HomePageBlock } from "~/types/api";

const props = defineProps<{ block: HomePageBlock }>();

// Map widget_element_path values to async components
const widgetComponentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  courses: defineAsyncComponent(() => import("~/components/widgets/WidgetCourses.vue")),
  topics: defineAsyncComponent(() => import("~/components/widgets/WidgetTopics.vue")),
  questions: defineAsyncComponent(() => import("~/components/widgets/WidgetQuestions.vue")),
  call_actions: defineAsyncComponent(() => import("~/components/widgets/WidgetCallActions.vue")),
  // Add new widget_element_path values here as the API grows
};

const resolvedComponent = computed(() =>
  widgetComponentMap[props.block.widget_element_path] ?? null
);
</script>

<template>
  <section
    v-if="resolvedComponent"
    :id="`section-${block.alias}`"
    :class="{ 'w-full': block.is_full_section === '1' }"
  >
    <component :is="resolvedComponent" :block="block" :items="block.items" />
  </section>
  <!-- Graceful: unknown widget_element_path is silently skipped -->
</template>
```

### 4.4 Widget Components

Each widget component (`WidgetCourses.vue`, `WidgetTopics.vue`, etc.) receives:
- `block: HomePageBlock` → contains `title`, `description`, `alias`
- `items: WidgetItem[]` → the rendered data items

**`WidgetQuestions.vue`** — renders FAQ/Q&A accordion from `items[].label` + links to `items[].url`  
**`WidgetTopics.vue`** — renders topic cards  
**`WidgetCourses.vue`** — renders course cards  
**`WidgetCallActions.vue`** — renders CTA banner  

---

## Phase 5 — Dynamic Pages: `page_content` API

### 5.1 [NEW] `app/server/api/page/[alias].get.ts` — Server proxy for page content

> [!NOTE]
> Page content endpoint is: `GET /website/website_api/content/{alias}?access_key=…`

```typescript
// app/server/api/page/[alias].get.ts
import type { PageContent, SeoMeta } from "~/types/api";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const alias = getRouterParam(event, "alias");

  // Endpoint: /website/website_api/content/{alias}?access_key=…
  const data = await $fetch<{ page_content: PageContent; seo_meta: SeoMeta }>(
    `${config.public.apiBase}/content/${alias}`,
    {
      query: { access_key: config.apiAccessKey },
    }
  );

  return data;
});
```

### 5.2 [NEW] `app/pages/[...slug].vue` — Catch-all dynamic page

```vue
<!-- app/pages/[...slug].vue -->
<script setup lang="ts">
import type { PageContent, SeoMeta } from "~/types/api";

definePageMeta({ layout: "default" });

const route = useRoute();
const alias = computed(() => (route.params.slug as string[]).join("/"));

const { data, error, status } = await useFetch<{
  page_content: PageContent;
  seo_meta: SeoMeta;
}>(`/api/page/${alias.value}`);

const page = computed(() => data.value?.page_content);
const seo = computed(() => data.value?.seo_meta);

useSeoMeta({
  title: computed(() => seo.value?.meta_title ?? page.value?.meta_title ?? page.value?.title),
  description: computed(() => seo.value?.meta_description ?? page.value?.meta_description),
  keywords: computed(() => seo.value?.meta_keywords ?? page.value?.meta_keywords),
  ogImage: computed(() => seo.value?.image_url),
  ogUrl: computed(() => seo.value?.canonical_url),
});
</script>

<template>
  <div>
    <AppLoader v-if="status === 'pending'" />
    <div v-else-if="error" class="container mx-auto py-20 text-center text-red-500">
      Page not found or failed to load.
    </div>
    <div v-else-if="page" class="container mx-auto px-4 py-12">
      <SharedPageBanner :title="page.title" :image="page.image_url" />
      <div class="prose max-w-none mt-8" v-html="page.fulltext" />
    </div>
  </div>
</template>
```

> [!NOTE]
> This single catch-all route powers **all** CMS pages: `/guidelines`, `/call-for-paper`, `/about`, `/contact`, `/mind`, `/technology`, `/business`, `/happiness` — all driven by the `alias` field in the API.

---

## Phase 6 — Auth: Login/Register + JWT Pinia Store

> [!NOTE]
> Auth endpoints are **not yet defined** in the API. Auth pages (Login/Register) will be built with a clean interface but the actual API call URLs will be filled in once the backend is ready. The store will use placeholder endpoint stubs.

### Key points:
- `access_key` auth is for **public** endpoints (site settings, pages)
- User auth will use **JWT** (Bearer token) for protected endpoints when endpoints are ready
- JWT stored in `localStorage` under `bp_jwt_token`
- Auth store, middleware, and plugins are set up now — just needs real endpoint URLs later

### Files:
- **`app/stores/auth.ts`** — JWT store with login/logout/register (endpoint URLs as env-configurable stubs)
- **`app/plugins/auth.client.ts`** — restores JWT on page load
- **`app/middleware/auth.ts`** — guards protected routes
- **`app/middleware/guest.ts`** — redirects logged-in users away from login/register

### [NEW] `app/pages/login.vue` and `app/pages/register.vue`
UI-complete pages with `definePageMeta({ middleware: ["guest"] })`. Endpoint wired to `NUXT_PUBLIC_AUTH_BASE` env var (to be filled later).

---

## Phase 7 — Protected Pages

### `app/pages/submit-paper.vue`
```typescript
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
```

### [NEW] `app/layouts/dashboard.vue`
Authenticated layout with sidebar nav (My Submissions, Profile, etc.)

### [NEW] `app/layouts/auth.vue`
Centered card layout for Login/Register pages.

---

## Phase 8 — SEO, Sitemap, Robots

### SEO Pattern (every page)
1. Fetch `seo_meta` from the page's API response
2. Call `useSeoMeta({ title, description, keywords, ogImage, ogUrl })`
3. Set `canonical_url` via `useHead({ link: [{ rel: "canonical", href: ... }] })`

### Sitemap
- **`app/server/api/__sitemap__/urls.get.ts`** — fetches all page aliases from the API
- Enable in `nuxt.config.ts`: `sitemap: { sources: ["/api/__sitemap__/urls"] }`

### [NEW] `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://autofymind.com/sitemap.xml

Disallow: /login
Disallow: /register
Disallow: /submit-paper
Disallow: /dashboard
```

### [NEW] `app/error.vue`
Global error page for 404/403/500 with brand-consistent design.

---

## Phase 9 — Polish & Production Checklist

### Image Handling
- All images use `<NuxtImg>` from `@nuxt/image`
- `useImageUrl()` composable converts relative API paths → full URLs using `NUXT_PUBLIC_IMAGE_BASE`

### Analytics
- `sid_site.app_setting.analytic_code` contains the Google Tag Manager snippet
- Inject via `useHead({ script: [...] })` in `app.vue` after settings load

### Content Security
- Never render raw `analytic_code` without sanitization
- `v-html` is only used for trusted API-provided fulltext content

---

## File Creation Order (Dependency-Safe)

```
Phase 1:
  1. .env (update)
  2. nuxt.config.ts (update)
  3. app/types/api.ts (replace)
  4. app/types/settings.ts (new)
  5. app/types/user.ts (keep)

Phase 2:
  6. app/server/api/settings.get.ts (new)
  7. app/stores/settings.ts (new)
  8. app/stores/auth.ts (new)
  9. app/stores/ui.ts (new)
  10. app/plugins/settings.server.ts (new)
  11. app/plugins/auth.client.ts (new)
  12. app/plugins/theme.client.ts (new)
  13. app/assets/css/main.css (update)
  14. app/app.vue (update)

Phase 3:
  15. app/composables/useImageUrl.ts (new)
  16. app/composables/useApi.ts (new)
  17. app/layouts/default.vue (new)
  18. app/layouts/auth.vue (new)
  19. app/layouts/dashboard.vue (new)
  20. app/components/layout/TheHeader.vue (new)
  21. app/components/layout/TheFooter.vue (new)

Phase 4:
  22. app/components/home/HomeHeroSlider.vue (new)
  23. app/components/home/HomeBlockRenderer.vue (new)
  24. app/components/widgets/WidgetCourses.vue (new)
  25. app/components/widgets/WidgetTopics.vue (new)
  26. app/components/widgets/WidgetQuestions.vue (new)
  27. app/components/widgets/WidgetCallActions.vue (new)
  28. app/pages/index.vue (new)

Phase 5:
  29. app/server/api/page/[alias].get.ts (new)
  30. app/components/shared/SharedPageBanner.vue (new)
  31. app/pages/[...slug].vue (new)

Phase 6–7:
  32. app/middleware/auth.ts (new)
  33. app/middleware/guest.ts (new)
  34. app/middleware/role.ts (new)
  35. app/pages/login.vue (new)
  36. app/pages/register.vue (new)
  37. app/pages/submit-paper.vue (new)

Phase 8:
  38. app/server/api/__sitemap__/urls.get.ts (new)
  39. app/error.vue (new)
  40. public/robots.txt (new)
  41. app/locales/en.json (new)
```

---

## Resolved Questions ✅

| # | Question | Answer | Impact |
|---|---|---|---|
| 1 | Page content endpoint? | `GET /website/website_api/content/{alias}?access_key=…` | Server proxy uses this URL pattern |
| 2 | Auth endpoints? | Not yet defined — build UI now, wire endpoints later | Auth store uses env var stub |
| 3 | Widget `items: []` empty? | No data yet — widgets render empty state gracefully | Each widget handles empty items with placeholder/skeleton |
| 4 | Multi-tenant SID? | Multi-tenant, controlled from admin panel (not Nuxt) | Nuxt reads SID from env var; admin sets it externally |

---

## Verification Plan

### Automated
- `npm run lint` — ESLint passes
- TypeScript: `vue-tsc --noEmit` — no type errors

### Manual
- Settings bootstrap: `console.log(settingsStore.settings)` confirms full org data on page load
- Dynamic theme: `document.documentElement.style.getPropertyValue('--color-primary')` returns `#266B88`
- Nav: Header renders all menu items from API including dropdown children
- Dynamic pages: `/mind`, `/technology`, `/business`, `/happiness` all render via `[...slug].vue`
- Home blocks: Each `home_page_block` with `widget_element_path` renders the correct widget component
- SEO: `<title>` matches `seo_meta.meta_title` from API on each page
- Security: `NUXT_API_ACCESS_KEY` is NOT present in browser network requests or page source

---

*Plan created: 2026-07-20 | Stack: Nuxt 4 · @nuxt/ui v4 · Tailwind v4 · Pinia · CI REST API · JWT*
