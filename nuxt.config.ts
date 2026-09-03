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
    "shadcn-nuxt",
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

  routeRules: {
    "/": { ssr: true },
    "/pages/**": { isr: 300 },

    "/dashboard/**": { ssr: true },
    "/**": { isr: 120 },

    // auth routes
    "/login": { ssr: false },
    "/register": { ssr: false },
    "/forgot-password": { ssr: false },
    "/reset-password": { ssr: false },
    "/verify-otp": { ssr: false },
    "/verify-email": { ssr: false },

    // cfp pages — SSR with no ISR cache so every request gets fresh CMS data
    "/call-for-papers": { ssr: true, isr: false },
    "/committee": { ssr: true, isr: false },
    "/tracks": { ssr: true, isr: false },
    "/guidelines": { ssr: true, isr: false },
    "/submit-paper": { ssr: true, isr: false },
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

  shadcn: {
    componentDir: "./layers/base/components/ui",
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
