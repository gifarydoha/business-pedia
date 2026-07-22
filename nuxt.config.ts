export default defineNuxtConfig({
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
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Business-Pedia",
    },
  },

  routeRules: {
    "/": { isr: 60 },
    "/pages/**": { isr: 300 },
    "/guidelines": { isr: 300 },
    "/call-for-paper": { isr: 300 },
    "/contact": { ssr: true },
    "/dashboard/**": { ssr: true },
    "/**": { isr: 120 },
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/submit-paper": { ssr: true },
    // Internal Nuxt server API routes — always fresh
    "/api/**": { cors: true, cache: false },
  },
  compatibilityDate: "2025-07-15",

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
    sources: [
      "/api/__sitemap__/urls",
    ],
  },
});
