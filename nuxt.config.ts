export default defineNuxtConfig({
  extends: [
    "./layers/base",
    "./layers/conference",
    "./layers/lms",
    "./layers/website",
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
            "./layers/base/pages/**/*.vue",
            "./layers/conference/pages/**/*.vue",
            "./layers/base/layouts/*.vue",
          ],
        },
        watch: {
          ignored: ["**/node_modules/**", "**/.nuxt/**"],
        },
      },
    },
  },
  devtools: { enabled: true },

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },

  // runtimeConfig: {
  //   public: {
  //     apiAccessKey: process.env.NUXT_PUBLIC_API_ACCESS_KEY ?? "",
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "https://autofymind.com/website/website_api",
  //     kbApiBase: process.env.NUXT_PUBLIC_KB_API_BASE ?? "https://autofymind.com/skb/kb_api",
  //     confApiBase: process.env.NUXT_PUBLIC_CONF_API_BASE ?? "https://localhost:9100",
  //     imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE ?? "https://autofymind.com",
  //     appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Autofy-Frontend",
  //     googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  //   },
  // },

  routeRules: {
    "/": { ssr: true },
    "/pages/**": { isr: 300 },

    "/dashboard/**": { ssr: true },
    "/**": { isr: 120 },

    // auth routes
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/quick-register": { ssr: false },
    "/forgot-password": { ssr: false },
    "/reset-password": { ssr: false },
    "/verify-otp": { ssr: false },
    "/verify-email": { ssr: false },

    // cfp pages — ISR disabled until data loading is confirmed stable
    "/call-for-papers": { ssr: true },
    "/committee": { ssr: true },
    "/tracks": { ssr: true },
    "/guidelines": { ssr: true },
    "/submit-paper": { ssr: true },
    // Internal Nuxt server API routes — always fresh
    "/api/**": { cors: true, cache: false },
  },
  compatibilityDate: "2025-07-15",

  nitro: {
    prerender: {
      failOnError: false,
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

  icon: {
    serverBundle: {
      collections: ["heroicons", "simple-icons", "lucide", "ph"],
    },
    clientBundle: {
      scan: true,
    },
  },

  // Nuxt Image Configuration
  image: {
    domains: ["autofymind.com"],
  },

  // Sitemap
  sitemap: {
    enabled: process.env.NODE_ENV !== "development",
  },

  // VeeValidate
  veeValidate: {
    typedSchemaPackage: "none",
  },
});
