# 🚀 Business-Pedia: Production Nuxt.js SaaS — Full Setup Guideline

> **Stack:** Nuxt 4 · @nuxt/ui · Tailwind CSS v4 · Pinia · CodeIgniter REST API · JWT (localStorage) · Nodemailer · @nuxtjs/i18n (i18n-ready) · Hybrid SSR/ISR Rendering

---

## Table of Contents

1. [Project Context & Architecture Overview](#1-project-context--architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [Packages to Install](#3-packages-to-install)
4. [Step 1 — Configure nuxt.config.ts](#4-step-1--configure-nuxtconfigts)
5. [Step 2 — Runtime Config & Environment Variables](#5-step-2--runtime-config--environment-variables)
6. [Step 3 — Folder-by-Folder Setup Guide](#6-step-3--folder-by-folder-setup-guide)
7. [Step 4 — API Layer (useFetch + $fetch)](#7-step-4--api-layer-usefetch--fetch)
8. [Step 5 — JWT Authentication](#8-step-5--jwt-authentication)
9. [Step 6 — Pinia Stores](#9-step-6--pinia-stores)
10. [Step 7 — Dynamic Homepage & Page Sections](#10-step-7--dynamic-homepage--page-sections)
11. [Step 8 — Dynamic Pages (Submit Paper, Call to Paper, Guidelines, Contact Us)](#11-step-8--dynamic-pages-submit-paper-call-to-paper-guidelines-contact-us)
12. [Step 9 — Role-Based Access Control (RBAC)](#12-step-9--role-based-access-control-rbac)
13. [Step 10 — File/PDF Upload (Paper Submissions)](#13-step-10--filepdf-upload-paper-submissions)
14. [Step 12 — SEO & Auto Sitemap](#15-step-12--seo--auto-sitemap)
15. [Step 13 — i18n Architecture (English-first, RTL-ready)](#16-step-13--i18n-architecture-english-first-rtl-ready)
16. [Step 14 — Hybrid Rendering Strategy (routeRules)](#17-step-14--hybrid-rendering-strategy-routerules)
17. [Step 15 — Error Handling & Loading States](#18-step-15--error-handling--loading-states)
18. [Step 16 — Production Checklist](#19-step-16--production-checklist)

---

## 1. Project Context & Architecture Overview

### What We Are Building

Business-Pedia is a **single-instance dynamic SaaS** journal/business platform with:

- **Public pages** (Homepage, Call to Paper, Guidelines, Contact Us) — content fetched from the CodeIgniter REST API, rendered with **ISR** (cached + revalidated) for performance and SEO.
- **Authenticated pages** (Submit a Paper, My Submissions, Dashboard) — rendered with **SSR** per-request, protected by JWT role guards.
- **Auth pages** (Login, Register) — SPA-mode or SSR, JWT stored in `localStorage`.
- **Separate Admin Panel** — different domain/app, NOT in this Nuxt project.

### Architecture Diagram

```
Browser
  │
  ▼
Nuxt 4 App (this repo)
  ├── Public routes     → ISR cached, fetches from CI API on revalidation
  ├── Auth routes       → SSR per-request, JWT-guarded middleware
  ├── Server API routes → /server/api/* ( proxy wrappers)
  └── Static assets     → /public/*
          │
          ▼
CodeIgniter 4 REST API (external, separate domain)
  ├── /api/home/sections     → Homepage dynamic sections
  ├── /api/pages/{slug}      → Dynamic page content
  ├── /api/auth/login        → JWT issue
  ├── /api/auth/register     → Registration
  ├── /api/papers/submit     → Paper submission
  └── /api/papers/...        → Other paper endpoints
```

---

## 2. Folder Structure

> Nuxt 4 uses the `app/` directory convention. All source code lives inside `app/`.

```
business-pedia/
├── app/                          # All Nuxt source code (Nuxt 4 convention)
│   ├── app.vue                   # Root app wrapper
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css          # Global styles (Tailwind directives, CSS vars)
│   │   └── images/               # Static images imported in components
│   ├── components/
│   │   ├── ui/                   # Generic reusable UI primitives
│   │   │   ├── AppButton.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppBadge.vue
│   │   │   └── AppLoader.vue
│   │   ├── layout/               # Layout-level components
│   │   │   ├── TheHeader.vue
│   │   │   ├── TheFooter.vue
│   │   │   ├── TheSidebar.vue
│   │   │   └── TheBreadcrumb.vue
│   │   ├── home/                 # Homepage section components (dynamic)
│   │   │   ├── HomeHero.vue
│   │   │   ├── HomeAbout.vue
│   │   │   ├── HomeStats.vue
│   │   │   ├── HomeAnnouncements.vue
│   │   │   ├── HomeCallForPapers.vue
│   │   │   └── HomeSectionRenderer.vue   # Dynamic section router
│   │   ├── paper/                # Paper-related components
│   │   │   ├── PaperSubmitForm.vue
│   │   │   ├── PaperUploader.vue
│   │   │   └── PaperCard.vue
│   │   └── shared/               # Cross-page shared components
│   │       ├── ContactForm.vue
│   │       ├── SectionTitle.vue
│   │       └── PageBanner.vue
│   ├── composables/              # Reusable logic (auto-imported)
│   │   ├── useApi.ts             # Central $fetch wrapper with JWT headers
│   │   ├── useAuth.ts            # Login, logout, token management
│   │   ├── useUser.ts            # Current user state helper
│   │   ├── useToast.ts           # Toast notifications
│   │   ├── useUpload.ts          # File/PDF upload logic
│   │   └── useSeo.ts             # useSeoMeta wrapper
│   ├── layouts/
│   │   ├── default.vue           # Public layout (header + footer)
│   │   ├── auth.vue              # Auth layout (centered card)
│   │   └── dashboard.vue         # Authenticated user layout
│   ├── middleware/
│   │   ├── auth.ts               # Redirect to /login if no JWT
│   │   ├── guest.ts              # Redirect to / if already logged in
│   │   └── role.ts               # Role-based guard (admin, editor, author)
│   ├── pages/
│   │   ├── index.vue             # Homepage (dynamic sections)
│   │   ├── login.vue
│   │   ├── register.vue
│   │   ├── guidelines.vue
│   │   ├── contact.vue
│   │   ├── call-to-paper.vue
│   │   ├── submit-paper.vue      # Protected (auth middleware)
│   │   └── [slug].vue            # Catch-all for dynamic CMS pages
│   ├── plugins/
│   │   ├── api.client.ts         # Set up $api global helper on client
│   │   └── auth.client.ts        # Restore JWT from localStorage on app load
│   ├── server/
│   │   ├── api/
│   │   │   └── health.get.ts         # Health check endpoint
│   │   ├── middleware/
│   │   │   └── cors.ts               # CORS headers for server routes
│   ├── stores/                   # Pinia stores (auto-imported)
│   │   ├── auth.ts               # JWT token, user data, login/logout actions
│   │   ├── ui.ts                 # Global UI state (loading, modals, sidebar)
│   │   └── content.ts            # Cached homepage sections, page content
│   └── types/                    # TypeScript interfaces
│       ├── api.ts                # API response shapes
│       ├── user.ts               # User, Role types
│       ├── paper.ts              # Paper submission types
│       └── content.ts            # Homepage section, page content types
├── data/                         # Static/reference files
│   └── nuxt-saas-guideline.md    # This file
├── public/                       # Publicly served static files
│   ├── favicon.ico
│   ├── robots.txt
│   └── og-image.png
├── .env                          # Local secrets (never commit)
├── .env.example                  # Committed template
├── nuxt.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 3. Packages to Install

### 3.1 Already Installed

| Package | Purpose |
|---|---|
| `nuxt` ^4 | Core framework |
| `@nuxt/ui` ^4 | UI component library (Tailwind v4 integrated) |
| `tailwindcss` ^4 | Utility CSS |
| `@vueuse/core` + `@vueuse/nuxt` | Vue composable utilities |
| `@nuxt/eslint` | ESLint module |
| `eslint-plugin-tailwindcss` | Tailwind class linting |

### 3.2 Install Now

Run this single command to install everything at once:

```bash
npm install @pinia/nuxt pinia @nuxtjs/i18n @nuxtjs/sitemap
```

#### Package breakdown

| Package | Purpose | Why |
|---|---|---|
| `@pinia/nuxt` | Pinia Nuxt module | Auto-imports stores, SSR-safe |
| `pinia` | State management | Role-based state, auth state |
| `@nuxtjs/i18n` | Internationalization | English-first, future RTL-ready |
| `@nuxtjs/sitemap` | Auto sitemap generation | SEO requirement |

### 3.3 Optional — Add When Needed

| Package | Purpose | Install Command |
|---|---|---|
| `@vee-validate/nuxt` + `yup` | Form validation with schema | `npm install @vee-validate/nuxt vee-validate yup` |
| `dayjs` | Date formatting | `npm install dayjs` |
| `@nuxt/image` | Optimized NuxtImg component | `npm install @nuxt/image` |

---

## 4. Step 1 — Configure nuxt.config.ts

Replace your existing `nuxt.config.ts` with the following production-ready config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Modules
  modules: [
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
  ],

  // Global CSS
  css: ["~/assets/css/main.css"],

  // Runtime Config (env variables)
  runtimeConfig: {
    // Public — exposed to client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8000/api",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Business-Pedia",
    },
  },

  // Hybrid Rendering (SSR + ISR)
  routeRules: {
    "/": { isr: 60 },
    "/guidelines": { isr: 300 },
    "/call-to-paper": { isr: 300 },
    "/contact": { ssr: true },
    "/**": { isr: 120 },
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/submit-paper": { ssr: true },
  },

  // i18n
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-US", name: "English", dir: "ltr", file: "en.json" },
      // Add more locales here when needed
    ],
    lazy: true,
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  // Sitemap
  sitemap: {
    sources: [
      // "/api/__sitemap__/urls", // Uncomment when implemented
    ],
  },

  // ESLint
  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: "double",
        indent: 2,
        commaDangle: "always-multiline",
        blockSpacing: true,
      },
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Enable in CI, too slow in dev
  },
});
```

---

## 5. Step 2 — Runtime Config & Environment Variables

### Create `.env.example` (commit this file)

```bash
# Public (exposed to browser)
NUXT_PUBLIC_API_BASE=https://api.business-pedia.com/api
NUXT_PUBLIC_APP_NAME=Business-Pedia

```

### Create `.env` (never commit — add to `.gitignore`)

```bash
cp .env.example .env
# Then fill in real values
```

### Verify `.gitignore` includes:

```
.env
.env.local
.env.*.local
```

---

## 6. Step 3 — Folder-by-Folder Setup Guide

### 6.1 Create the `app/locales/` directory

```bash
mkdir -p app/locales
```

Create `app/locales/en.json`:

```json
{
  "nav": {
    "home": "Home",
    "guidelines": "Guidelines",
    "callToPaper": "Call to Paper",
    "submitPaper": "Submit a Paper",
    "contact": "Contact Us",
    "login": "Login",
    "register": "Register"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "email": "Email",
    "password": "Password"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "submit": "Submit",
    "cancel": "Cancel"
  }
}
```

### 6.2 Create TypeScript Types

**`app/types/api.ts`** — Base API response shapes:

```typescript
// app/types/api.ts
export interface ApiResponse<T> {
  data: T;
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

**`app/types/user.ts`** — User and roles:

```typescript
// app/types/user.ts
export type UserRole = "admin" | "editor" | "author" | "reviewer" | "reader";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
}

export interface AuthTokenPayload {
  token: string;
  expires_at: string;
  user: User;
}
```

**`app/types/content.ts`** — Dynamic page/section types:

```typescript
// app/types/content.ts
export type SectionType =
  | "hero"
  | "about"
  | "stats"
  | "announcements"
  | "call_for_papers"
  | "team"
  | "sponsors"
  | "faq"
  | "custom";

export interface HomeSection {
  id: number;
  type: SectionType;
  order: number;
  visible: boolean;
  data: Record<string, unknown>;
}

export interface DynamicPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  updated_at: string;
}
```

**`app/types/paper.ts`** — Paper submission:

```typescript
// app/types/paper.ts
export type PaperStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "revision_requested";

export interface Paper {
  id: number;
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  file_url?: string;
  status: PaperStatus;
  submitted_at?: string;
  user_id: number;
}

export interface PaperSubmitPayload {
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  file: File;
}
```

---

## 7. Step 4 — API Layer (useFetch + $fetch)

Create **`app/composables/useApi.ts`**:

```typescript
// app/composables/useApi.ts
import type { ApiResponse, ApiError } from "~/types/api";

/**
 * Central API wrapper.
 * Automatically injects JWT Authorization header from localStorage.
 * Typed response via generics.
 * Throws a structured ApiError on non-2xx responses.
 */
export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const baseURL = config.public.apiBase as string;

  /**
   * Use for SSR-safe data fetching inside setup() / pages.
   * Wraps useFetch with automatic auth headers.
   */
  function apiFetch<T>(
    path: string,
    options: Parameters<typeof useFetch>[1] = {},
  ) {
    return useFetch<ApiResponse<T>>(path, {
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(authStore.token
          ? { Authorization: `Bearer ${authStore.token}` }
          : {}),
      },
      ...options,
    });
  }

  /**
   * Use for imperative calls (form submissions, mutations).
   * Wraps $fetch with auth headers.
   */
  async function apiCall<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<ApiResponse<T>> {
    try {
      return await $fetch<ApiResponse<T>>(path, {
        baseURL,
        headers: {
          "Content-Type": "application/json",
          ...(authStore.token
            ? { Authorization: `Bearer ${authStore.token}` }
            : {}),
        },
        ...options,
      });
    }
    catch (error: unknown) {
      const e = error as { data?: ApiError; status?: number };
      throw {
        message: e.data?.message ?? "An unexpected error occurred",
        errors: e.data?.errors ?? {},
        status: e.status ?? 500,
      } satisfies ApiError;
    }
  }

  return { apiFetch, apiCall };
}
```

---

## 8. Step 5 — JWT Authentication

### 8.1 Auth Pinia Store

Create **`app/stores/auth.ts`**:

```typescript
// app/stores/auth.ts
import type { User, AuthTokenPayload } from "~/types/user";
import type { ApiResponse } from "~/types/api";

const TOKEN_KEY = "bp_jwt_token";
const USER_KEY = "bp_user";

export const useAuthStore = defineStore("auth", () => {
  // State
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role ?? null);
  const isAdmin = computed(() => userRole.value === "admin");
  const isEditor = computed(() => ["admin", "editor"].includes(userRole.value ?? ""));
  const isAuthor = computed(() => ["admin", "editor", "author"].includes(userRole.value ?? ""));

  // Actions
  function restoreFromStorage() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken) token.value = savedToken;
      if (savedUser) {
        try { user.value = JSON.parse(savedUser); }
        catch { /* ignore corrupt data */ }
      }
    }
  }

  async function login(email: string, password: string) {
    const config = useRuntimeConfig();
    const response = await $fetch<ApiResponse<AuthTokenPayload>>(
      `${config.public.apiBase}/auth/login`,
      { method: "POST", body: { email, password } },
    );

    token.value = response.data.token;
    user.value = response.data.user;

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response.data;
  }

  async function register(payload: { name: string; email: string; password: string }) {
    const config = useRuntimeConfig();
    return await $fetch<ApiResponse<AuthTokenPayload>>(
      `${config.public.apiBase}/auth/register`,
      { method: "POST", body: payload },
    );
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    return navigateTo("/login");
  }

  return {
    token, user, isLoggedIn, userRole,
    isAdmin, isEditor, isAuthor,
    restoreFromStorage, login, register, logout,
  };
});
```

### 8.2 Auth Restore Plugin

Create **`app/plugins/auth.client.ts`**:

```typescript
// app/plugins/auth.client.ts
// Runs only on the client. Restores JWT and user from localStorage on every page load.
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.restoreFromStorage();
});
```

### 8.3 Middleware — Auth Guard

Create **`app/middleware/auth.ts`**:

```typescript
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (import.meta.client) {
    authStore.restoreFromStorage();
  }
  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }
});
```

### 8.4 Middleware — Guest Guard

Create **`app/middleware/guest.ts`**:

```typescript
// app/middleware/guest.ts
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    return navigateTo("/");
  }
});
```

### 8.5 Middleware — Role Guard

Create **`app/middleware/role.ts`**:

```typescript
// app/middleware/role.ts
import type { UserRole } from "~/types/user";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const requiredRole = to.meta.requiredRole as UserRole | undefined;
  if (!requiredRole) return;

  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }

  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    editor: 3,
    author: 2,
    reviewer: 1,
    reader: 0,
  };

  const userLevel = roleHierarchy[authStore.userRole ?? "reader"];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    throw createError({ statusCode: 403, message: "Forbidden: insufficient permissions" });
  }
});
```

---

## 9. Step 6 — Pinia Stores

### UI Store

Create **`app/stores/ui.ts`**:

```typescript
// app/stores/ui.ts
export const useUiStore = defineStore("ui", () => {
  const isLoading = ref(false);
  const globalError = ref<string | null>(null);
  const toasts = ref<Array<{ id: string; type: "success" | "error" | "info"; message: string }>>([]);

  function showToast(type: "success" | "error" | "info", message: string) {
    const id = crypto.randomUUID();
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 4000);
  }

  function setLoading(value: boolean) { isLoading.value = value; }
  function setError(msg: string | null) { globalError.value = msg; }

  return { isLoading, globalError, toasts, showToast, setLoading, setError };
});
```

### Content Store

Create **`app/stores/content.ts`**:

```typescript
// app/stores/content.ts
import type { HomeSection, DynamicPage } from "~/types/content";

export const useContentStore = defineStore("content", () => {
  const homeSections = ref<HomeSection[]>([]);
  const pageCache = ref<Map<string, DynamicPage>>(new Map());

  function setHomeSections(sections: HomeSection[]) {
    homeSections.value = [...sections].sort((a, b) => a.order - b.order);
  }

  function cachePage(slug: string, page: DynamicPage) {
    pageCache.value.set(slug, page);
  }

  function getCachedPage(slug: string): DynamicPage | undefined {
    return pageCache.value.get(slug);
  }

  return { homeSections, pageCache, setHomeSections, cachePage, getCachedPage };
});
```

---

## 10. Step 7 — Dynamic Homepage & Page Sections

### 10.1 Homepage Page

Create **`app/pages/index.vue`**:

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import type { HomeSection } from "~/types/content";

definePageMeta({ layout: "default" });

const { apiFetch } = useApi();
const contentStore = useContentStore();

const { data, error, status } = await apiFetch<HomeSection[]>("/home/sections");

if (data.value?.data) {
  contentStore.setHomeSections(data.value.data);
}

useSeoMeta({
  title: "Business-Pedia — Journal Platform",
  ogTitle: "Business-Pedia",
  description: "A leading journal platform for business and academic research.",
  ogImage: "/og-image.png",
});
</script>

<template>
  <div>
    <template v-if="status === 'pending'">
      <AppLoader />
    </template>
    <template v-else-if="error">
      <p class="text-center text-red-500 py-20">
        Failed to load page content. Please try again.
      </p>
    </template>
    <template v-else>
      <HomeSectionRenderer
        v-for="section in contentStore.homeSections"
        :key="section.id"
        :section="section"
      />
    </template>
  </div>
</template>
```

### 10.2 Dynamic Section Renderer

Create **`app/components/home/HomeSectionRenderer.vue`**:

```vue
<!-- app/components/home/HomeSectionRenderer.vue -->
<script setup lang="ts">
import type { HomeSection } from "~/types/content";

defineProps<{ section: HomeSection }>();

const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  hero: defineAsyncComponent(() => import("~/components/home/HomeHero.vue")),
  about: defineAsyncComponent(() => import("~/components/home/HomeAbout.vue")),
  stats: defineAsyncComponent(() => import("~/components/home/HomeStats.vue")),
  announcements: defineAsyncComponent(() => import("~/components/home/HomeAnnouncements.vue")),
  call_for_papers: defineAsyncComponent(() => import("~/components/home/HomeCallForPapers.vue")),
};
</script>

<template>
  <component
    :is="componentMap[section.type]"
    v-if="componentMap[section.type] && section.visible"
    :data="section.data"
  />
</template>
```

---

## 11. Step 8 — Dynamic Pages

### Pattern: All dynamic pages follow this structure

```vue
<!-- Example: app/pages/guidelines.vue -->
<script setup lang="ts">
import type { DynamicPage } from "~/types/content";

definePageMeta({ layout: "default" });

const { apiFetch } = useApi();
const { data, error, status } = await apiFetch<DynamicPage>("/pages/guidelines");
const page = computed(() => data.value?.data);

useSeoMeta({
  title: computed(() => page.value?.meta_title ?? page.value?.title ?? "Guidelines"),
  description: computed(() => page.value?.meta_description ?? ""),
});
</script>

<template>
  <div>
    <AppLoader v-if="status === 'pending'" />
    <div v-else-if="page" class="container mx-auto px-4 py-12">
      <PageBanner :title="page.title" />
      <div class="prose max-w-none" v-html="page.content" />
    </div>
  </div>
</template>
```

### Submit Paper Page (Protected)

```vue
<!-- app/pages/submit-paper.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
  requiredRole: "author",
});
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Submit a Paper</h1>
    <PaperSubmitForm />
  </div>
</template>
```

### Call to Paper Page

```vue
<!-- app/pages/call-to-paper.vue -->
<script setup lang="ts">
import type { DynamicPage } from "~/types/content";

definePageMeta({ layout: "default" });

const { apiFetch } = useApi();
const { data } = await apiFetch<DynamicPage>("/pages/call-to-paper");
const page = computed(() => data.value?.data);

useSeoMeta({
  title: computed(() => page.value?.meta_title ?? "Call to Paper"),
});
</script>

<template>
  <div v-if="page" class="container mx-auto px-4 py-12">
    <PageBanner :title="page.title" />
    <div class="prose max-w-none" v-html="page.content" />
    <div class="mt-12 text-center">
      <NuxtLink to="/submit-paper">
        <AppButton size="lg">Submit Your Paper</AppButton>
      </NuxtLink>
    </div>
  </div>
</template>
```

---

## 12. Step 9 — Role-Based Access Control (RBAC)

### Role Hierarchy

```
admin (4) > editor (3) > author (2) > reviewer (1) > reader (0)
```

### Applying RBAC in Pages

```typescript
definePageMeta({
  middleware: ["auth", "role"],
  requiredRole: "editor", // Only editor and above can access
});
```

### Conditional UI Rendering

```vue
<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <AppButton v-if="authStore.isEditor">Edit Content</AppButton>
  <AppButton v-if="authStore.isAdmin">Manage Users</AppButton>
</template>
```

---

## 13. Step 10 — File/PDF Upload (Paper Submissions)

Create **`app/composables/useUpload.ts`**:

```typescript
// app/composables/useUpload.ts
import type { ApiResponse } from "~/types/api";

export function useUpload() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  async function uploadFile(
    file: File,
    endpoint: string = "/papers/upload",
  ): Promise<{ url: string } | null> {
    if (!file) return null;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      uploadError.value = "Only PDF and Word documents are allowed.";
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      uploadError.value = "File size must be less than 10MB.";
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    isUploading.value = true;
    uploadError.value = null;

    try {
      const response = await $fetch<ApiResponse<{ url: string }>>(
        `${config.public.apiBase}${endpoint}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authStore.token}` },
          // Do NOT set Content-Type — browser sets it with boundary for FormData
          body: formData,
        },
      );
      return response.data;
    }
    catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      uploadError.value = e.data?.message ?? "Upload failed. Please try again.";
      return null;
    }
    finally {
      isUploading.value = false;
    }
  }

  return { uploadFile, isUploading, uploadError };
}
```

---


## 15. Step 12 — SEO & Auto Sitemap

### Page-Level SEO (use in every page)

```typescript
useSeoMeta({
  title: "Page Title — Business-Pedia",
  ogTitle: "Page Title",
  description: "Page description for search engines.",
  ogDescription: "Page description for search engines.",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
});
```

### Sitemap — Dynamic Routes from CI API

Create **`app/server/api/__sitemap__/urls.get.ts`**:

```typescript
// app/server/api/__sitemap__/urls.get.ts
import type { SitemapUrl } from "#sitemap/types";

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig();
  const pages = await $fetch<{ slugs: string[] }>(
    `${config.public.apiBase}/sitemap/pages`,
  );

  return pages.slugs.map((slug): SitemapUrl => ({
    loc: `/${slug}`,
    changefreq: "monthly",
    priority: 0.7,
    lastmod: new Date().toISOString(),
  }));
});
```

### robots.txt

Create **`public/robots.txt`**:

```
User-agent: *
Allow: /

Sitemap: https://business-pedia.com/sitemap.xml

Disallow: /login
Disallow: /register
Disallow: /submit-paper
```

---

## 16. Step 13 — i18n Architecture (English-first, RTL-ready)

### Current Setup (English only)

URLs will look like:
- `/` — English homepage
- `/ar/` — Arabic (when added)

### Adding a New Language Later

**Step 1:** Add the locale to `nuxt.config.ts`:

```typescript
locales: [
  { code: "en", language: "en-US", name: "English", dir: "ltr", file: "en.json" },
  { code: "ar", language: "ar-SA", name: "العربية", dir: "rtl", file: "ar.json" },
],
```

**Step 2:** Create `app/locales/ar.json` with Arabic translations.

**Step 3:** The i18n module automatically sets `dir` on `<html>` — RTL works out of the box.

**Step 4:** Use CSS logical properties for RTL-safe layouts:

```css
/* Use logical properties instead of left/right */
margin-inline-start: 1rem;   /* instead of margin-left */
padding-inline-end: 1rem;    /* instead of padding-right */
```

### Using i18n in Components

```vue
<script setup lang="ts">
const { t, locale, setLocale } = useI18n();
</script>

<template>
  <h1>{{ t("nav.home") }}</h1>
  <button @click="setLocale('ar')">العربية</button>
</template>
```

---

## 17. Step 14 — Hybrid Rendering Strategy (routeRules)

### Summary Table

| Route | Strategy | Reason |
|---|---|---|
| `/` | `isr: 60` | Dynamic but cacheable — 60s revalidation |
| `/guidelines` | `isr: 300` | Rarely changes — 5 min cache |
| `/call-to-paper` | `isr: 300` | Rarely changes — 5 min cache |
| `/contact` | `ssr: true` | Form page — no caching needed |
| `/submit-paper` | `ssr: true` | Protected, user-specific — never cache |
| `/login` | `ssr: false` | SPA-mode, no SEO needed |
| `/register` | `ssr: false` | SPA-mode, no SEO needed |
| `/**` | `isr: 120` | Catch-all dynamic pages — 2 min cache |

### How ISR Works in Nuxt 4

1. **First request** → page is SSR-rendered and cached.
2. **Within TTL** → served from cache (fast).
3. **After TTL expires** → next request triggers a background re-render.
4. **Result** → dynamic content + static performance.

---

## 18. Step 15 — Error Handling & Loading States

### Global Error Page

Create **`app/error.vue`**:

```vue
<!-- app/error.vue -->
<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>();

const title = computed(() => {
  if (props.error.statusCode === 404) return "Page Not Found";
  if (props.error.statusCode === 403) return "Access Denied";
  return "Something Went Wrong";
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800">{{ error.statusCode }}</h1>
      <p class="mt-4 text-xl text-gray-600">{{ title }}</p>
      <NuxtLink to="/" class="mt-8 inline-block">Go Home</NuxtLink>
    </div>
  </div>
</template>
```

### API Error Pattern in Pages

```typescript
const { data, error, status } = await apiFetch<DynamicPage>("/pages/guidelines");

// Always handle these three states in your template:
// status === "pending"  → show skeleton/loader
// error.value          → show error message
// data.value           → show content
```

---

## 19. Step 16 — Production Checklist

### Security

- [ ] `.env` is in `.gitignore` and never committed
- [ ] JWT tokens validated on the CodeIgniter API for every protected endpoint
- [ ] File uploads validate type and size on both frontend AND CodeIgniter backend
- [ ] `Content-Security-Policy` headers configured via reverse proxy or Nitro
- [ ] HTTPS enforced on production domain

### Performance

- [ ] `routeRules` configured correctly for ISR on public pages
- [ ] `@nuxt/image` installed for image optimization if using images from API
- [ ] Lazy-loaded async components for homepage sections (`defineAsyncComponent`)
- [ ] Pinia stores don't hold excessively large data sets

### SEO

- [ ] `useSeoMeta` called on every page with unique title + description
- [ ] `public/robots.txt` created and blocks private routes
- [ ] `@nuxtjs/sitemap` configured with API source for dynamic pages
- [ ] `public/og-image.png` created at 1200x630px
- [ ] Canonical URLs set where needed

### Code Quality

- [ ] TypeScript strict mode enabled (`strict: true`)
- [ ] ESLint passes: `npm run lint`
- [ ] All API responses typed using types from `~/types/`
- [ ] No hardcoded API URLs — all use `config.public.apiBase`

### i18n

- [ ] All user-facing strings use `t("key")` — no hardcoded English strings in templates
- [ ] `app/locales/en.json` covers all UI text
- [ ] CSS uses logical properties for RTL compatibility

### Auth

- [ ] `auth.client.ts` plugin restores token on every page load
- [ ] `auth` middleware applied to all protected pages
- [ ] `role` middleware applied to role-restricted pages
- [ ] 401 response from API triggers automatic logout

---

## Quick Reference — File Creation Order

Create files in this order to avoid import errors:

```
1.  app/types/api.ts
2.  app/types/user.ts
3.  app/types/content.ts
4.  app/types/paper.ts
5.  app/stores/auth.ts
6.  app/stores/ui.ts
7.  app/stores/content.ts
8.  app/composables/useApi.ts
9.  app/composables/useUpload.ts
10. app/plugins/auth.client.ts
11. app/middleware/auth.ts
12. app/middleware/guest.ts
13. app/middleware/role.ts
14. app/layouts/default.vue
15. app/layouts/auth.vue
16. app/layouts/dashboard.vue
17. app/pages/index.vue
18. app/pages/login.vue
19. app/pages/register.vue
20. app/pages/guidelines.vue
21. app/pages/call-to-paper.vue
24. app/pages/contact.vue
25. app/pages/submit-paper.vue
26. app/components/home/HomeSectionRenderer.vue
27. app/locales/en.json
28. public/robots.txt
```

---

*Last updated: 2026-07-19 | Stack: Nuxt 4 · @nuxt/ui v4 · Tailwind v4 · Pinia · CodeIgniter REST API · JWT*
