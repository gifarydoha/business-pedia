# How Business-Pedia App Works

This document provides a step-by-step breakdown of the architecture, data flow, and structure of the **Business-Pedia** Nuxt 4 application.

## 1. Technology Stack

- **Framework:** Nuxt 4 (Vue 3, Vite, Nitro Server)
- **State Management:** Pinia
- **Styling:** TailwindCSS, Nuxt UI (`@nuxt/ui`)
- **Utilities:** VueUse (`@vueuse/nuxt`), Nuxt Icon, Nuxt Fonts, Nuxt i18n
- **Rendering Modes:** Hybrid Rendering (SSR, ISR, and CSR configured per route)

## 2. Bootstrapping & Global Settings Flow

The application relies heavily on dynamic configurations and content fetched from an external API (`https://autofymind.com/website/website_api`). To keep the API access key secure and optimize load times, the app uses a Server-Side Rendering (SSR) approach.

### Step-by-step Execution:

1. **Server Initialization (`app/plugins/settings.server.ts`):** 
   When a user visits the app, the Nuxt server processes the request. A server-only plugin runs first and checks if the global settings are loaded in the Pinia store. If not, it triggers `settingsStore.loadSettings()`.

2. **API Proxy (`app/server/api/settings.get.ts`):**
   The Pinia store makes a request to the internal Nuxt API route `/api/settings`. This internal endpoint acts as a secure proxy. It attaches the private `NUXT_API_ACCESS_KEY` (read from `.env`) to the request and forwards it to the external API. This ensures the access key is **never exposed** to the client's browser.

3. **State Hydration (`app/stores/settings.ts`):**
   The external API returns the site's configuration (organization details, primary/secondary colors, social media links, homepage slider items, and block widgets). This data is saved into the Pinia `settingsStore`. Because this happened on the server, the Pinia state is "hydrated" (serialized and sent along with the initial HTML) to the browser, ensuring a fast first paint with all settings readily available.

4. **Global Layout & Meta (`app/app.vue`):**
   The root component reads from the `settingsStore` to dynamically inject the correct `<title>` and favicon via `useHead`. It then renders the application layout and pages.

## 3. Routing and Rendering Strategies

Nuxt uses file-based routing. The rendering strategy for each route is explicitly defined in `nuxt.config.ts` under `routeRules`:

- **ISR (Incremental Static Regeneration):**
  - `/` (Home): Regenerates in the background every 60 seconds (`isr: 60`).
  - `/**` (Dynamic Pages): Regenerates every 120 seconds.
  - `/guidelines`, `/call-for-paper`: Regenerate every 300 seconds.
  - *Why?* ISR provides the speed of static sites but keeps content up-to-date by rebuilding the page periodically on the server.

- **CSR (Client-Side Rendering):**
  - `/login`, `/register`: Rendered only in the browser (`ssr: false`).

- **SSR (Server-Side Rendering):**
  - `/dashboard/**`, `/contact`, `/submit-paper`: Rendered dynamically on the server for every request (`ssr: true`).

## 4. Key Pages

### Homepage (`app/pages/index.vue`)
- Fetches data reactively from the Pinia `settingsStore` via computed properties (`homePageBlocks`, `sliderItems`, `homeSeoMeta`).
- Injects dynamic SEO metadata.
- Iterates over the slider items to render the `<HomeHeroSlider />`.
- Iterates over the block data to render various sections using `<HomeBlockRenderer />`.

### Dynamic Content Pages (`app/pages/[...slug].vue`)
- Acts as a catch-all route for any custom pages (e.g., `/about`, `/services/consulting`).
- Extracts the URL slug and makes a server-side `useFetch` call to `/api/page/[slug]`.
- Handles loading and error states (e.g., showing a 404 UI if the page doesn't exist).
- Renders the fetched content securely via `v-html` inside a styled prose container.

## 5. Middleware & Security

- **Middleware (`app/middleware/`):** Contains route guards like `auth.ts`, `guest.ts`, and `role.ts` to protect specific pages (like the dashboard) and ensure users have the correct permissions before they can access a route.
- **Server API:** By utilizing the `app/server/api/` directory, Nuxt Nitro acts as a secure middleman between the frontend and the external database/backend, hiding sensitive tokens and implementing CORS.

## Summary

The Business-Pedia application is a modern, highly optimized Nuxt 4 app. It leverages SSR and state hydration to securely fetch global configurations on the server, resulting in fast load times, excellent SEO, and a completely dynamic UI driven by an external API backend.
