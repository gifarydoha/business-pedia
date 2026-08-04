export default defineNuxtConfig({

  extends: [
    "./layers/base",
    "./layers/conference",
    "./layers/autofymind",
    "./layers/ecommerce",
  ],
  modules: [
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@vee-validate/nuxt",
  ],

  $development: {
    vite: {
      server: {
        warmup: {
          clientFiles: [
            "./pages/*.vue",
            "./pages/(auth)/*.vue",
            "./layouts/*.vue",
          ],
        },
        watch: {
          ignored: ["**/node_modules/**", "**/.nuxt/**"],
        },
      },
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },

  runtimeConfig: {
    // 🌐 PUBLIC — safe to expose to browser
    public: {
      apiAccessKey: process.env.NUXT_PUBLIC_API_ACCESS_KEY ?? "",
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "https://autofymind.com/website/website_api",
      kbApiBase: process.env.NUXT_PUBLIC_KB_API_BASE ?? "https://autofymind.com/skb/kb_api",
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE ?? "https://autofymind.com",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Autofy-Frontend",
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    },
  },

  routeRules: {
    "/": { isr: 60 },
    "/pages/**": { isr: 300 },
    "/guidelines": { isr: 300 },
    "/call-for-paper": { isr: 300 },
    "/dashboard/**": { ssr: true },
    "/**": { isr: 120 },
    // auth routes
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/forgot-password": { ssr: false },
    "/reset-password": { ssr: false },
    "/verify-otp": { ssr: false },
    "/verify-email": { ssr: false },

    "/submit-paper": { ssr: true },
    // Internal Nuxt server API routes — always fresh
    "/api/**": { cors: true, cache: false },
  },
  compatibilityDate: "2025-07-15",

  nitro: {
    prerender: {
      // Don't fail the whole build if a dynamic route 404s during generation
      failOnError: false,
      // Ignore routes that require live API data and can't be statically pre-rendered
      ignore: ["/api/__sitemap__/urls"],
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "vee-validate",
        "pinia",
        "zod",
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

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

  fonts: {
    families: [
      { name: "Poppins", weights: [300, 400, 500, 600, 700] },
      { name: "Lora", weights: [400, 500, 600, 700] },
    ],
  },

  // i18n
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-US", name: "English", dir: "ltr", file: "en.json" },
    ],
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  // Sitemap
  sitemap: {
    enabled: process.env.NODE_ENV !== "development",
    // No dynamic API sources — they don't exist during static generation
    // Link crawling is automatic in @nuxtjs/sitemap v8+ (no crawlLinks option needed)
  },
});
